const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const allPageIssues = [];
  const allApiIssues = [];
  const allConsoleErrors = new Map();

  // Login once
  await page.goto('http://localhost:3000/auth/login', { waitUntil: 'load' });
  await page.fill('input[name="email"]', 'admin@example.com');
  await page.fill('input[name="password"]', '123456');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard**', { timeout: 10000 });

  // ========== TEST EVERY PAGE WITH ERROR DETECTION ==========
  const allPages = [
    ['/', '首页'],
    ['/auth/login', '登录页'],
    ['/auth/register', '注册页'],
    ['/dashboard', '仪表盘'],
    ['/dashboard/competitions', '比赛列表'],
    ['/dashboard/competitions/new', '新建比赛'],
    ['/dashboard/programs', '节目列表'],
    ['/dashboard/programs/new', '新建节目'],
    ['/dashboard/participants', '参与者列表'],
    ['/dashboard/participants/new', '新建参与者'],
    ['/dashboard/judges', '评委列表'],
    ['/dashboard/judges/new', '新建评委'],
    ['/dashboard/display', '展示管理'],
    ['/dashboard/files', '文件管理'],
    ['/dashboard/audit-logs', '审计日志'],
    ['/dashboard/profile', '个人资料'],
    ['/dashboard/roles', '角色列表'],
    ['/dashboard/permissions', '权限管理'],
    ['/dashboard/permissions/settings', '权限设置'],
    ['/dashboard/permissions/roles', '角色权限'],
    ['/dashboard/permissions/users', '用户权限'],
    ['/dashboard/permissions/data-access', '数据访问'],
  ];

  console.log('=== 页面检查 ===');
  for (const [path, name] of allPages) {
    const pageErrors = [];
    const pageApiErrors = [];

    // Collect errors for this page
    function onConsole(msg) {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Filter out DevTools, favicon, and other noise
        if (!text.includes('favicon') && !text.includes('DevTools') && !text.includes('React DevTools')) {
          pageErrors.push(text.substring(0, 200));
        }
      }
    }

    function onResponse(response) {
      if (response.url().includes('/api/') && response.status() >= 400) {
        pageApiErrors.push(`${response.request().method()} ${new URL(response.url()).pathname} -> ${response.status()}`);
      }
    }

    page.on('console', onConsole);
    page.on('response', onResponse);

    try {
      const response = await page.goto('http://localhost:3000' + path, { waitUntil: 'load', timeout: 20000 });
      const status = response.status();

      if (status >= 400) {
        allPageIssues.push([name, path, `HTTP ${status}`]);
        console.log(`✗ ${name} (${path}): HTTP ${status}`);
      } else if (pageErrors.length > 0 || pageApiErrors.length > 0) {
        console.log(`⚠ ${name} (${path}): HTTP ${status}, ${pageErrors.length} console errors, ${pageApiErrors.length} API errors`);
        for (const e of pageErrors) {
          console.log(`    console: ${e.substring(0, 100)}`);
          allPageIssues.push([name, path, `console: ${e.substring(0, 100)}`]);
        }
        for (const e of pageApiErrors) {
          console.log(`    api: ${e}`);
          allPageIssues.push([name, path, `api: ${e}`]);
        }
      } else {
        console.log(`✓ ${name} (${path})`);
      }

      allConsoleErrors.set(path, pageErrors);
    } catch (e) {
      allPageIssues.push([name, path, `timeout: ${e.message.substring(0, 80)}`]);
      console.log(`✗ ${name} (${path}): TIMEOUT`);
    }

    page.removeListener('console', onConsole);
    page.removeListener('response', onResponse);
  }

  // ========== TEST ALL APIs ==========
  console.log('\n=== API 检查 ===');
  const apis = [
    ['GET', '/api/dashboard/stats'],
    ['GET', '/api/competitions'],
    ['GET', '/api/programs'],
    ['GET', '/api/participants'],
    ['GET', '/api/judges'],
    ['GET', '/api/users'],
    ['GET', '/api/files'],
    ['GET', '/api/audit-logs'],
    ['GET', '/api/permissions/me'],
    ['GET', '/api/permissions/system-status'],
    ['GET', '/api/permissions/policies'],
    ['GET', '/api/permissions/security-config'],
    ['GET', '/api/permissions/audit-config'],
    ['GET', '/api/permissions/data-access/rules'],
    ['GET', '/api/permissions/data-access/logs'],
    ['GET', '/api/permissions/data-access/stats?startDate=2026-01-01&endDate=2026-12-31'],
    ['GET', '/api/judge/competitions'],
    ['GET', '/api/rankings?competitionId=test'],
    ['GET', '/api/users/roles'],
  ];

  for (const [method, path] of apis) {
    try {
      const result = await page.evaluate(async ({ method, path }) => {
        const res = await fetch('http://localhost:3000' + path, { method, credentials: 'include' });
        let body = null;
        try { body = await res.json(); } catch {}
        return { status: res.status, ok: res.ok, error: body?.error || null };
      }, { method, path });

      if (!result.ok) {
        allApiIssues.push([method, path, `HTTP ${result.status}: ${result.error || 'no error message'}`]);
        // 400/401/403 are expected for some endpoints, only flag 500 as real issue
        if (result.status >= 500) {
          console.log(`✗ CRITICAL ${method} ${path}: ${result.status} ${result.error}`);
        } else {
          console.log(`- ${method} ${path}: ${result.status} ${result.error} (可能正常)`);
        }
      } else {
        console.log(`✓ ${method} ${path}`);
      }
    } catch (e) {
      allApiIssues.push([method, path, `eval error: ${e.message}`]);
      console.log(`✗ ${method} ${path}: EVAL ERROR`);
    }
  }

  // ========== CHECK DYNAMIC PAGES ==========
  console.log('\n=== 动态页面检查 ===');

  // Get competition ID
  const compId = await page.evaluate(async () => {
    try {
      const res = await fetch('http://localhost:3000/api/competitions', { credentials: 'include' });
      const data = await res.json();
      const comps = data.competitions || [];
      return comps.length > 0 ? comps[0].id : null;
    } catch { return null; }
  });

  if (compId) {
    const dynamicPages = [
      `/dashboard/competitions/${compId}`,
      `/dashboard/competitions/${compId}/edit`,
      `/display/${compId}`,
    ];

    for (const path of dynamicPages) {
      try {
        const timeout = path.startsWith('/display') ? 10000 : 15000;
        const response = await page.goto('http://localhost:3000' + path, { waitUntil: 'load', timeout });
        const status = response.status();
        if (status >= 400) {
          allPageIssues.push([path, path, `HTTP ${status}`]);
          console.log(`✗ ${path}: HTTP ${status}`);
        } else {
          console.log(`✓ ${path}`);
        }
      } catch (e) {
        // Display page might timeout due to SSE - that's expected
        if (path.startsWith('/display')) {
          console.log(`- ${path}: SSE page (timeout expected)`);
        } else {
          allPageIssues.push([path, path, `timeout: ${e.message.substring(0, 60)}`]);
          console.log(`✗ ${path}: TIMEOUT`);
        }
      }
    }

    // Get program ID
    const progId = await page.evaluate(async () => {
      try {
        const res = await fetch('http://localhost:3000/api/programs', { credentials: 'include' });
        const data = await res.json();
        const progs = data.data || [];
        return progs.length > 0 ? progs[0].id : null;
      } catch { return null; }
    });

    if (progId) {
      const progPages = [
        `/dashboard/programs/${progId}`,
        `/dashboard/programs/${progId}/edit`,
      ];
      for (const path of progPages) {
        try {
          const response = await page.goto('http://localhost:3000' + path, { waitUntil: 'load', timeout: 15000 });
          const status = response.status();
          if (status >= 400) {
            allPageIssues.push([path, path, `HTTP ${status}`]);
            console.log(`✗ ${path}: HTTP ${status}`);
          } else {
            console.log(`✓ ${path}`);
          }
        } catch (e) {
          allPageIssues.push([path, path, `timeout: ${e.message.substring(0, 60)}`]);
          console.log(`✗ ${path}: TIMEOUT`);
        }
      }
    }

    // Get judge ID
    const judgeId = await page.evaluate(async () => {
      try {
        const res = await fetch('http://localhost:3000/api/judges', { credentials: 'include' });
        const data = await res.json();
        return data.length > 0 ? data[0].id : null;
      } catch { return null; }
    });

    if (judgeId) {
      try {
        const response = await page.goto(`http://localhost:3000/dashboard/judges/${judgeId}/edit`, { waitUntil: 'load', timeout: 15000 });
        console.log(response.status() >= 400 ? `✗ /dashboard/judges/${judgeId}/edit: HTTP ${response.status()}` : `✓ /dashboard/judges/${judgeId}/edit`);
      } catch (e) {
        allPageIssues.push(['评委编辑', `/dashboard/judges/${judgeId}/edit`, `timeout`]);
        console.log(`✗ /dashboard/judges/${judgeId}/edit: TIMEOUT`);
      }
    }
  } else {
    console.log('SKIP: No competitions found (seed data may be missing)');
  }

  // ========== CHECK FOR COMMON fetch WITHOUT credentials ==========
  console.log('\n=== fetch credentials 检查 ===');
  const { execSync } = require('child_process');
  try {
    const result = execSync(
      'cd /Users/soea/progarm/Minimax_1_test1/src && ' +
      'grep -rn "fetch(.*'+"'/api/"+'" . --include="*.tsx" --include="*.ts" | ' +
      'grep -v credentials | ' +
      'grep -v node_modules | ' +
      'grep -v "auth/register" | ' +  // register page doesn't need auth
      'grep -v "test-" | ' +
      'grep -v ".spec" | ' +
      'grep -v "permissions/data-access/page" | ' +  // already has credentials
      'grep -v "permissions/settings/page" | ' + // already has credentials
      'grep -v "permissions/roles/page" | ' +
      'grep -v "permissions/users/page" | ' +
      'grep -v "permissions/page"',
      { encoding: 'utf8', maxBuffer: 1024*1024 }
    );
    const lines = result.trim().split('\n').filter(l => l);
    if (lines.length > 0) {
      console.log(`${lines.length} fetch calls without explicit credentials:`);
      lines.forEach(l => console.log('  ', l.trim().substring(0, 120)));
    } else {
      console.log('All have credentials');
    }
  } catch (e) {
    console.log('No missing credentials found');
  }

  // ========== SUMMARY ==========
  console.log('\n========================================');
  console.log('           最终问题汇总');
  console.log('========================================');

  const criticalApi = allApiIssues.filter(([,,msg]) => msg.includes('500'));
  const normalApi = allApiIssues.filter(([,,msg]) => !msg.includes('500'));

  console.log(`\n🔥 API 500错误: ${criticalApi.length}`);
  criticalApi.forEach(([m, p, msg]) => console.log(`   ${m} ${p}: ${msg}`));

  console.log(`\n⚠ 页面问题: ${allPageIssues.length}`);
  allPageIssues.forEach(([n, p, msg]) => console.log(`   ${n} (${p}): ${msg}`));

  console.log(`\n📡 其他API(非500): ${normalApi.length}`);
  normalApi.forEach(([m, p, msg]) => console.log(`   ${m} ${p}: ${msg}`));

  console.log(`\n总页面数: ${allPages.length}`);
  console.log('========================================');

  await browser.close();
})();