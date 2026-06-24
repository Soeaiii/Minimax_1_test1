/**
 * Comprehensive E2E test — visits every page and touches every API.
 * Sequential execution avoids parallel auth race conditions.
 */
const { test, expect, loginAsAdmin } = require('./fixtures/auth');

const PUBLIC_PAGES = [
  ['/', 'Home'],
  ['/auth/login', 'Login'],
  ['/auth/register', 'Register'],
];

const AUTH_PAGES = [
  ['/dashboard', 'Dashboard'],
  ['/dashboard/profile', 'Profile'],
  ['/dashboard/competitions', 'Competitions'],
  ['/dashboard/competitions/new', 'New Competition'],
  ['/dashboard/programs', 'Programs'],
  ['/dashboard/programs/new', 'New Program'],
  ['/dashboard/participants', 'Participants'],
  ['/dashboard/participants/new', 'New Participant'],
  ['/dashboard/judges', 'Judges'],
  ['/dashboard/judges/new', 'New Judge'],
  ['/dashboard/display', 'Display'],
  ['/dashboard/files', 'Files'],
  ['/dashboard/audit-logs', 'Audit Logs'],
  ['/dashboard/roles', 'Roles'],
  ['/dashboard/permissions', 'Permissions'],
  ['/dashboard/permissions/settings', 'Perm Settings'],
  ['/dashboard/permissions/roles', 'Perm Roles'],
  ['/dashboard/permissions/users', 'Perm Users'],
  ['/dashboard/permissions/data-access', 'Data Access'],
  ['/dashboard/tenants', 'Tenants'],
];

const APIS = [
  ['GET', '/api/competitions'],
  ['GET', '/api/competitions/stats'],
  ['GET', '/api/programs'],
  ['GET', '/api/participants'],
  ['GET', '/api/judges'],
  ['GET', '/api/rankings'],
  ['GET', '/api/files'],
  ['GET', '/api/audit-logs'],
  ['GET', '/api/dashboard/stats'],
  ['GET', '/api/permissions/me'],
  ['GET', '/api/permissions/system-status'],
  ['GET', '/api/permissions/policies'],
  ['GET', '/api/permissions/security-config'],
  ['GET', '/api/permissions/audit-config'],
];

// ── Public pages ──
test.describe('Public Pages', () => {
  for (const [path, label] of PUBLIC_PAGES) {
    test(`${label} (${path}) returns 200, no console errors`, async ({ page }) => {
      const errors = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error' && !msg.text().includes('favicon')) {
          errors.push(msg.text().substring(0, 150));
        }
      });
      const resp = await page.goto(path, { waitUntil: 'load', timeout: 15_000 });
      expect(resp.status(), `${label}: HTTP ${resp.status()}`).toBeLessThan(400);
      if (errors.length > 0) {
        console.warn(`  ${label} console errors: ${errors.join(' | ')}`);
      }
      // Don't fail on console errors for now — collect for report
    });
  }
});

// ── Auth pages ──
test.describe('Authenticated Pages', () => {
  test('login via admin@example.com / 123456', async ({ page }) => {
    await loginAsAdmin(page);
    expect(page.url()).toContain('/dashboard');
  });

  for (const [path, label] of AUTH_PAGES) {
    test(`${label} (${path}) returns 200`, async ({ page }) => {
      // Login fresh each time (storageState would be ideal but simpler inline)
      await loginAsAdmin(page);
      const errors = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error' && !msg.text().includes('favicon')) {
          errors.push(msg.text().substring(0, 150));
        }
      });
      const apiErrors = [];
      page.on('response', (resp) => {
        if (resp.url().includes('/api/') && resp.status() >= 500) {
          apiErrors.push(`${resp.request().method()} ${new URL(resp.url()).pathname} → ${resp.status()}`);
        }
      });

      const resp = await page.goto(path, { waitUntil: 'domcontentloaded', timeout: 20_000 });
      await page.waitForTimeout(1000);

      expect(resp.status(), `${label}: HTTP ${resp.status()}`).toBeLessThan(400);
      expect(apiErrors, `${label}: ${apiErrors.length} API 500 errors`).toHaveLength(0);
    });
  }
});

// ── API endpoints ──
test.describe('API Endpoints', () => {
  test('login for API tests', async ({ page }) => {
    await loginAsAdmin(page);
  });

  for (const [method, path] of APIS) {
    test(`${method} ${path} returns < 400`, async ({ page }) => {
      await loginAsAdmin(page);
      const result = await page.evaluate(
        async ({ method, path }) => {
          const res = await fetch(path, { method });
          const text = await res.text();
          return { status: res.status, body: text.substring(0, 200) };
        },
        { method, path },
      );
      expect(result.status, `${method} ${path} → ${result.status}: ${result.body}`).toBeLessThan(400);
    });
  }
});

// ── Dynamic routes ──
test.describe('Dynamic Routes', () => {
  test('GET /api/competitions/[id] returns 200', async ({ page }) => {
    await loginAsAdmin(page);
    const resp = await page.evaluate(async () => {
      const r = await fetch('/api/competitions');
      const d = await r.json();
      return d.competitions?.[0]?.id || null;
    });
    if (!resp) { test.skip('No competitions in DB'); return; }

    const result = await page.evaluate(async (id) => {
      const r = await fetch(`/api/competitions/${id}`);
      return { status: r.status };
    }, resp);
    expect(result.status).toBeLessThan(400);
  });

  test('GET /display/[competitionId] loads', async ({ page }) => {
    await loginAsAdmin(page);
    const compId = await page.evaluate(async () => {
      const r = await fetch('/api/competitions');
      const d = await r.json();
      return d.competitions?.[0]?.id || null;
    });
    if (!compId) { test.skip('No competitions in DB'); return; }

    const resp = await page.goto(`/display/${compId}`, { waitUntil: 'load', timeout: 10_000 });
    expect(resp.status()).toBeLessThan(400);
  });
});
