const { chromium } = require('@playwright/test');

// All sample IDs from the seeded database
const IDS = {
  competition: 'bcd2589a-6c16-4b72-95d6-2b381803ab4f',
  competition2: 'bcd2589a-6c16-4b72-95d6-2b381803ab4f',
  program: '42120f03-ab8d-4ce8-9c7f-a141de0f1314',
  participant: '8fef340f-c2f5-4448-9840-c2709b98c8f0',
  file: 'c60d891f-ebaa-426c-8081-1d04d3eff45a',
  judgeAssignment: '69dab417-e718-4832-ae10-fa330cb7ec35',
  ranking: '17ee1b3c-41f8-4aef-99a0-cfc8bd01ccb7',
  tenant: '94f41ae9-7bdb-4db3-8130-c71b04bb6acc',
  tenant2: '67b79bd2-ec26-48ca-bc11-42b389e12d92',
};

const BASE = 'http://localhost:3000';

// Every API route in the app. Method = the HTTP verb the route is known to export.
// GET-only smoke tests are safe; POST/PUT/DELETE are NOT executed against write routes to avoid mutating data.
const API_ROUTES = [
  // dashboard
  ['GET', '/api/dashboard/stats'],
  // competitions
  ['GET', '/api/competitions'],
  ['GET', '/api/competitions?limit=10'],
  ['GET', `/api/competitions/${IDS.competition}`],
  ['GET', `/api/competitions/${IDS.competition}/stats`],
  ['GET', `/api/competitions/${IDS.competition}/custom-fields`],
  ['GET', `/api/competitions/${IDS.competition}/judges-and-criteria`],
  ['GET', '/api/competitions/nonexistent-id-123'],
  // programs
  ['GET', '/api/programs'],
  ['GET', `/api/programs/${IDS.program}`],
  ['GET', `/api/programs/${IDS.program}/scores`],
  ['GET', '/api/programs/nonexistent-id-123'],
  // participants
  ['GET', '/api/participants'],
  ['GET', '/api/participants?limit=10'],
  ['GET', `/api/participants/${IDS.participant}`],
  ['GET', '/api/participants/nonexistent-id-123'],
  // judges
  ['GET', '/api/judges'],
  ['GET', '/api/judges?competitionId=' + IDS.competition],
  ['GET', '/api/users?role=JUDGE'],
  // users
  ['GET', '/api/users'],
  ['GET', '/api/users/roles'],
  // files
  ['GET', '/api/files'],
  ['GET', `/api/files/${IDS.file}`],
  ['GET', `/api/files/${IDS.file}/preview`],
  ['GET', `/api/files/${IDS.file}/download`],
  ['GET', '/api/files/nonexistent-id-123'],
  // rankings
  ['GET', '/api/rankings'],
  ['GET', `/api/rankings?competitionId=${IDS.competition}`],
  ['GET', `/api/rankings/${IDS.ranking}`],
  ['GET', '/api/rankings/nonexistent-id-123'],
  // audit-logs
  ['GET', '/api/audit-logs'],
  ['GET', '/api/audit-logs?page=1&limit=10'],
  // permissions
  ['GET', '/api/permissions'],
  ['GET', '/api/permissions/me'],
  ['GET', '/api/permissions/system-status'],
  ['GET', '/api/permissions/policies'],
  ['GET', '/api/permissions/security-config'],
  ['GET', '/api/permissions/audit-config'],
  ['GET', '/api/permissions/tenants'],
  ['GET', '/api/permissions/data-access/rules'],
  ['GET', '/api/permissions/data-access/logs'],
  ['GET', '/api/permissions/data-access/stats?startDate=2026-01-01&endDate=2026-12-31'],
  ['GET', '/api/permissions/judge-assignments'],
  ['GET', '/api/permissions/users'],
  // admin tenants
  ['GET', '/api/admin/tenants'],
  ['GET', '/api/admin/tenants?pageSize=10'],
  ['GET', `/api/admin/tenants/${IDS.tenant}`],
  ['GET', `/api/admin/tenants/${IDS.tenant}/users`],
  // display
  ['GET', `/api/display/${IDS.competition}/data`],
  ['GET', `/api/display/${IDS.competition}`],
  // rounds & groups (admin)
  ['GET', `/api/competitions/${IDS.competition}/rounds`],
  ['GET', `/api/competitions/${IDS.competition}/groups`],
  // notifications
  ['GET', '/api/notifications'],
  // debug
  ['GET', '/api/debug/scores'],
  // fix / test utilities (GET only if available)
  ['GET', '/api/test-participant-relations'],
];

// Pages reachable while authenticated as admin
const PAGES = [
  '/',
  '/auth/login',
  '/auth/register',
  '/auth/register-tenant',
  '/unauthorized',
  '/dashboard',
  '/dashboard/competitions',
  '/dashboard/competitions/new',
  `/dashboard/competitions/${IDS.competition}`,
  `/dashboard/competitions/${IDS.competition}/edit`,
  `/dashboard/competitions/${IDS.competition}/custom-fields/manage`,
  '/dashboard/programs',
  '/dashboard/programs/new',
  `/dashboard/programs/${IDS.program}`,
  `/dashboard/programs/${IDS.program}/edit`,
  '/dashboard/participants',
  '/dashboard/participants/new',
  `/dashboard/participants/${IDS.participant}`,
  `/dashboard/participants/${IDS.participant}/edit`,
  '/dashboard/judges',
  '/dashboard/judges/new',
  '/dashboard/display',
  `/dashboard/display/${IDS.competition}`,
  '/dashboard/files',
  '/dashboard/audit-logs',
  '/dashboard/profile',
  '/dashboard/roles',
  '/dashboard/permissions',
  '/dashboard/permissions/settings',
  '/dashboard/permissions/roles',
  '/dashboard/permissions/users',
  '/dashboard/permissions/data-access',
  '/dashboard/tenants',
  '/dashboard/tenants/new',
  `/dashboard/tenants/${IDS.tenant}`,
  `/dashboard/tenants/${IDS.tenant}/settings`,
  `/dashboard/notifications`,
  `/dashboard/competitions/${IDS.competition}/certificates`,
  `/display/${IDS.competition}`,
];

const PASS = '\x1b[32m✓\x1b[0m';
const FAIL = '\x1b[31m✗\x1b[0m';
const WARN = '\x1b[33m⚠\x1b[0m';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = { api: [], pages: [], console: [] };

  // ---------- ADMIN CONTEXT ----------
  const adminCtx = await browser.newContext();
  const adminPage = await adminCtx.newPage();

  console.log('Logging in as admin...');
  await adminPage.goto(`${BASE}/auth/login`, { waitUntil: 'load' });
  await adminPage.fill('input[name="email"]', 'admin@example.com');
  await adminPage.fill('input[name="password"]', '123456');
  await adminPage.click('button[type="submit"]');
  await adminPage.waitForURL('**/dashboard**', { timeout: 15000 });
  console.log('Admin logged in.\n');

  // ---------- TEST ALL APIs (admin) ----------
  console.log('================ API ROUTES (admin) ================');
  for (const [method, path] of API_ROUTES) {
    try {
      const result = await adminPage.evaluate(async ({ method, path }) => {
        const res = await fetch(path, { method, credentials: 'include' });
        let body = null, text = '';
        try { text = await res.text(); body = JSON.parse(text); } catch {}
        const msg = body?.error || (body?.message) || (text && text.slice(0, 120));
        return { status: res.status, ok: res.ok, msg };
      }, { method, path });
      const flag = result.status >= 500 ? FAIL : (result.ok ? PASS : WARN);
      const detail = result.ok ? '' : ` ${result.status}${result.msg ? ' ' + String(result.msg).slice(0, 70) : ''}`;
      console.log(`${flag} ${method} ${path}${detail}`);
      results.api.push({ method, path, status: result.status, ok: result.ok });
    } catch (e) {
      console.log(`${FAIL} ${method} ${path}: ${e.message.slice(0, 80)}`);
      results.api.push({ method, path, status: 0, ok: false, error: e.message });
    }
  }

  // ---------- TEST ALL PAGES (admin) ----------
  console.log('\n================ PAGES (admin) ================');
  const consoleErrors = [];
  adminPage.on('console', (msg) => {
    if (msg.type() === 'error') {
      const t = msg.text();
      if (!t.includes('favicon') && !t.includes('DevTools')) {
        consoleErrors.push(t.slice(0, 200));
      }
    }
  });
  adminPage.on('pageerror', (err) => {
    consoleErrors.push('PAGEERROR: ' + err.message.slice(0, 200));
  });

  for (const path of PAGES) {
    // capture page-specific errors
    const beforeCount = consoleErrors.length;
    const pageErrs = [];
    const handler = (msg) => {
      if (msg.type() === 'error') {
        const t = msg.text();
        if (!t.includes('favicon') && !t.includes('DevTools') && !t.includes('CLIENT_FETCH_ERROR')) {
          pageErrs.push(t.slice(0, 150));
        }
      }
    };
    const errHandler = (err) => pageErrs.push('PAGEERROR: ' + err.message.slice(0, 150));
    adminPage.on('console', handler);
    adminPage.on('pageerror', errHandler);

    try {
      const isStream = path.startsWith('/display/') && path !== '/dashboard/display';
      const response = await adminPage.goto(`${BASE}${path}`, { waitUntil: 'load', timeout: isStream ? 12000 : 20000 });
      const status = response ? response.status() : 0;
      let flag = PASS;
      if (status >= 500) flag = FAIL;
      else if (status >= 400) flag = WARN;
      // give client a moment to emit console errors
      await adminPage.waitForTimeout(800);
      const newErrs = consoleErrors.slice(beforeCount);
      let detail = status >= 400 ? ` HTTP ${status}` : '';
      if (pageErrs.length > 0) {
        detail += ` [${pageErrs.length} errors]`;
        if (status < 400) flag = WARN;
      }
      console.log(`${flag} ${path}${detail}`);
      if (pageErrs.length > 0) {
        pageErrs.slice(0, 2).forEach(e => console.log(`     · ${e.slice(0, 120)}`));
      }
      results.pages.push({ path, status, ok: status < 400, consoleErrors: pageErrs.length });
    } catch (e) {
      const msg = e.message.slice(0, 70);
      const flag = path.includes('/display/') ? WARN : FAIL;
      console.log(`${flag} ${path}: TIMEOUT/ERR ${msg}`);
      results.pages.push({ path, status: 0, ok: false, error: msg });
    }
    adminPage.off('console', handler);
    adminPage.off('pageerror', errHandler);
  }

  // ---------- JUDGE CONTEXT ----------
  console.log('\n================ JUDGE CONTEXT ================');
  const judgeCtx = await browser.newContext();
  const judgePage = await judgeCtx.newPage();

  // Login as judge
  await judgePage.goto(`${BASE}/auth/login`, { waitUntil: 'load' });
  await judgePage.fill('input[name="email"]', 'judge1@example.com');
  await judgePage.fill('input[name="password"]', '123456');
  await judgePage.click('button[type="submit"]');
  await judgePage.waitForURL('**/judge**', { timeout: 15000 });
  console.log('Judge logged in.\n');

  const judgeApis = [
    ['GET', '/api/judge/competitions'],
    ['GET', '/api/judge/profile'],
    ['GET', `/api/judge/competitions/${IDS.competition}`],
    ['GET', `/api/judge/competitions/${IDS.competition}/current-display`],
    ['GET', `/api/judge/programs/${IDS.program}/scores`],
  ];
  for (const [method, path] of judgeApis) {
    try {
      const result = await judgePage.evaluate(async ({ method, path }) => {
        const res = await fetch(path, { method, credentials: 'include' });
        let body = null, text = '';
        try { text = await res.text(); body = JSON.parse(text); } catch {}
        const msg = body?.error || text?.slice(0, 100);
        return { status: res.status, ok: res.ok, msg };
      }, { method, path });
      const flag = result.status >= 500 ? FAIL : (result.ok ? PASS : WARN);
      const detail = result.ok ? '' : ` ${result.status} ${result.msg || ''}`.slice(0, 90);
      console.log(`${flag} ${method} ${path}${detail}`);
      results.api.push({ method, path, status: result.status, ok: result.ok, context: 'judge' });
    } catch (e) {
      console.log(`${FAIL} ${method} ${path}: ${e.message.slice(0, 80)}`);
    }
  }

  // ---------- SUMMARY ----------
  console.log('\n================ SUMMARY ================');
  const apiFail = results.api.filter(r => r.status >= 500);
  const apiWarn = results.api.filter(r => !r.ok && r.status < 500);
  const apiOk = results.api.filter(r => r.ok);
  const pageFail = results.pages.filter(p => !p.ok && (p.status === 0 || p.status >= 500));
  const pageWarn = results.pages.filter(p => (!p.ok && p.status < 500 && p.status > 0) || (p.consoleErrors > 0 && p.ok));
  const pageOk = results.pages.filter(p => p.ok && (p.consoleErrors || 0) === 0);

  console.log(`API: ${apiOk.length} ok, ${apiWarn.length} soft (${apiWarn.length} 4xx), ${apiFail.length} CRITICAL (5xx)`);
  console.log(`Pages: ${pageOk.length} ok, ${pageWarn.length} with issues, ${pageFail.length} CRITICAL`);
  if (apiFail.length) {
    console.log('\n🔥 CRITICAL API ERRORS (5xx):');
    apiFail.forEach(r => console.log(`   ${r.method} ${r.path}: ${r.status}`));
  }
  if (pageFail.length) {
    console.log('\n🔥 CRITICAL PAGE ERRORS:');
    pageFail.forEach(p => console.log(`   ${p.path}: ${p.status || 'load fail'} ${p.error||''}`));
  }
  if (pageWarn.length) {
    console.log('\n⚠ PAGES WITH CONSOLE/4xx ERRORS:');
    pageWarn.forEach(p => console.log(`   ${p.path}: ${p.status>=400?'HTTP '+p.status:''} ${p.consoleErrors} console errors`));
  }

  await browser.close();

  // exit code: non-zero if any critical failures
  const critical = apiFail.length + pageFail.length;
  console.log(`\nCritical issues: ${critical}`);
  process.exit(critical > 0 ? 1 : 0);
})();
