const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Login
  await page.goto('http://localhost:3000/auth/login', { waitUntil: 'load', timeout: 15000 });
  await page.fill('input[name="email"]', 'admin@example.com');
  await page.fill('input[name="password"]', '123456');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard**', { timeout: 10000 });

  // Test files API
  console.log('=== Testing files API ===');
  const filesResult = await page.evaluate(async () => {
    const res = await fetch('http://localhost:3000/api/files', { credentials: 'include' });
    return { status: res.status, body: await res.json().catch(() => ({ error: 'parse error' })) };
  });
  console.log('Files API:', filesResult.status, JSON.stringify(filesResult.body).substring(0, 100));

  // Test rankings API with competitionId
  console.log('\n=== Testing rankings API ===');
  const compsResult = await page.evaluate(async () => {
    const res = await fetch('http://localhost:3000/api/competitions', { credentials: 'include' });
    const data = await res.json();
    return data.competitions || [];
  });
  console.log('Found competitions:', compsResult.length);

  if (compsResult.length > 0) {
    const rankingResult = await page.evaluate(async (id) => {
      const res = await fetch('http://localhost:3000/api/rankings?competitionId=' + id, { credentials: 'include' });
      return { status: res.status, body: await res.json().catch(() => ({ error: 'parse error' })) };
    }, compsResult[0].id);
    console.log('Rankings API:', rankingResult.status, JSON.stringify(rankingResult.body).substring(0, 100));
  }

  // Test permissions settings page
  console.log('\n=== Testing permissions settings page ===');
  const settingsResult = await page.evaluate(async () => {
    const res = await fetch('http://localhost:3000/api/permissions/system-status', { credentials: 'include' });
    return { status: res.status, ok: res.ok };
  });
  console.log('System-status API:', settingsResult.status, settingsResult.ok ? 'OK' : 'ERROR');

  // Test data-access page
  console.log('\n=== Testing data-access APIs ===');
  const rulesResult = await page.evaluate(async () => {
    const res = await fetch('http://localhost:3000/api/permissions/data-access/rules', { credentials: 'include' });
    return { status: res.status, ok: res.ok };
  });
  console.log('Data-access rules:', rulesResult.status, rulesResult.ok ? 'OK' : 'ERROR');

  const statsResult = await page.evaluate(async () => {
    const res = await fetch('http://localhost:3000/api/permissions/data-access/stats?startDate=2026-01-01&endDate=2026-12-31', { credentials: 'include' });
    return { status: res.status, ok: res.ok };
  });
  console.log('Data-access stats:', statsResult.status, statsResult.ok ? 'OK' : 'ERROR');

  // Test all GET APIs
  console.log('\n=== All API endpoints ===');
  const allApis = [
    ['GET', '/api/competitions'],
    ['GET', '/api/competitions/route'],
    ['GET', '/api/programs'],
    ['GET', '/api/participants'],
    ['GET', '/api/judges'],
    ['GET', '/api/users'],
    ['GET', '/api/files'],
    ['GET', '/api/audit-logs'],
    ['GET', '/api/dashboard/stats'],
    ['GET', '/api/permissions/me'],
    ['GET', '/api/permissions/system-status'],
    ['GET', '/api/permissions/data-access/rules'],
    ['GET', '/api/permissions/data-access/logs'],
    ['GET', '/api/permissions/policies'],
    ['GET', '/api/permissions/security-config'],
    ['GET', '/api/permissions/audit-config'],
    ['GET', '/api/judge/competitions'],
  ];

  for (const [method, path] of allApis) {
    const r = await page.evaluate(async ({ method, path }) => {
      try {
        const res = await fetch('http://localhost:3000' + path, { method, credentials: 'include' });
        return { status: res.status };
      } catch (e) {
        return { status: 0, error: e.message };
      }
    }, { method, path });
    const indicator = r.status >= 200 && r.status < 400 ? 'OK' : `ERR ${r.status}`;
    console.log(`${indicator.padEnd(8)} ${method} ${path}`);
  }

  console.log('\n=== Done ===');
  await browser.close();
})();