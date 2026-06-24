/**
 * API test helpers — hit API endpoints programmatically using the authenticated
 * browser context (so cookies/session are shared).
 */
const { expect } = require('@playwright/test');

/**
 * Makes an API call from the authenticated page context.
 * Returns { status, data }.
 */
async function apiCall(page, method, url, body) {
  const response = await page.evaluate(
    async ({ method, url, body }) => {
      const opts = { method, headers: { 'Content-Type': 'application/json' } };
      if (body !== undefined && method !== 'GET') {
        opts.body = JSON.stringify(body);
      }
      const res = await fetch(url, opts);
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = text; }
      return { status: res.status, data };
    },
    { method, url, body },
  );
  return response;
}

/**
 * Asserts the API call returns a 2xx or 3xx status.
 */
async function expectApiOk(page, method, url, body) {
  const { status, data } = await apiCall(page, method, url, body);
  expect(status, `${method} ${url} → ${status}: ${JSON.stringify(data).substring(0, 200)}`)
    .toBeLessThan(400);
  return { status, data };
}

/**
 * Collects console errors during a page visit.
 */
function collectPageErrors(page) {
  const errors = [];
  const handler = (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      if (!text.includes('favicon') && !text.includes('DevTools')) {
        errors.push(text.substring(0, 200));
      }
    }
  };
  page.on('console', handler);
  return { errors, handler };
}

/**
 * Navigates to a page and asserts it loads without errors.
 */
async function smokeTestPage(page, path, label) {
  const { errors, handler } = collectPageErrors(page);
  const response = await page.goto(path, { waitUntil: 'load', timeout: 20_000 });
  page.off('console', handler);

  const status = response.status();
  expect(status, `${label} (${path}): HTTP ${status}`).toBeLessThan(400);
  expect(errors, `${label} (${path}): ${errors.length} console errors\n${errors.join('\n')}`).toHaveLength(0);
  await page.waitForTimeout(500);
}

module.exports = { apiCall, expectApiOk, collectPageErrors, smokeTestPage };
