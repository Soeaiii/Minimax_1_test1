# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: comprehensive.spec.js >> Public Pages >> Login (/auth/login) returns 200, no console errors
- Location: tests/comprehensive.spec.js:56:5

# Error details

```
Error: Login: HTTP 500

expect(received).toBeLessThan(expected)

Expected: < 400
Received:   500
```

# Page snapshot

```yaml
- generic:
  - alert [ref=e1]
  - generic [active]:
    - generic [ref=e6] [cursor=pointer]:
      - button "Open Next.js Dev Tools" [ref=e7]:
        - img [ref=e8]
      - button "Open issues overlay" [ref=e12]:
        - generic [ref=e13]:
          - generic [ref=e14]: "0"
          - generic [ref=e15]: "1"
        - generic [ref=e16]: Issue
    - generic [ref=e19]:
      - generic [ref=e20]:
        - generic [ref=e21]:
          - navigation [ref=e22]:
            - button "previous" [disabled] [ref=e23]:
              - img "previous" [ref=e24]
            - generic [ref=e26]:
              - generic [ref=e27]: 1/
              - text: "1"
            - button "next" [disabled] [ref=e28]:
              - img "next" [ref=e29]
          - img
        - generic [ref=e31]:
          - link "Next.js 15.3.2 (outdated) Turbopack" [ref=e32] [cursor=pointer]:
            - /url: https://nextjs.org/docs/messages/version-staleness
            - img [ref=e33]
            - generic "An outdated version detected (latest is 16.2.7), upgrade is highly recommended!" [ref=e35]: Next.js 15.3.2 (outdated)
            - generic [ref=e36]: Turbopack
          - img
      - generic [ref=e37]:
        - dialog "Build Error" [ref=e38]:
          - generic [ref=e40]:
            - generic [ref=e41]:
              - generic [ref=e42]:
                - generic [ref=e43]:
                  - generic [ref=e45]: Build Error
                  - generic [ref=e46]:
                    - button "Copy Stack Trace" [ref=e47] [cursor=pointer]:
                      - img [ref=e48]
                    - button "No related documentation found" [disabled] [ref=e50]:
                      - img [ref=e51]
                    - link "Learn more about enabling Node.js inspector for server code with Chrome DevTools" [ref=e53] [cursor=pointer]:
                      - /url: https://nextjs.org/docs/app/building-your-application/configuring/debugging#server-side-code
                      - img [ref=e54]
                - paragraph [ref=e63]: Ecmascript file had an error
              - generic [ref=e65]:
                - generic [ref=e67]:
                  - img [ref=e69]
                  - generic [ref=e73]: ./src/app/api/users/route.ts (36:7)
                  - button "Open in editor" [ref=e74] [cursor=pointer]:
                    - img [ref=e76]
                - generic [ref=e78]:
                  - generic [ref=e79]: Ecmascript file had an error
                  - generic [ref=e80]: 34 |
                  - generic [ref=e81]: // 如果有搜索关键词，按姓名或邮箱搜索
                  - generic [ref=e82]: 35 |
                  - text: if
                  - generic [ref=e83]: "(search) {"
                  - text: ">"
                  - generic [ref=e84]: 36 |
                  - generic [ref=e85]: where
                  - text: =
                  - generic [ref=e86]: "{"
                  - generic [ref=e87]: "|"
                  - text: ^^^^^
                  - generic [ref=e88]: 37 |
                  - text: ...where,
                  - generic [ref=e89]: 38 |
                  - text: "OR:"
                  - generic [ref=e90]: "["
                  - generic [ref=e91]: 39 |
                  - generic [ref=e92]: "{ name"
                  - text: ":"
                  - generic [ref=e93]: "{ contains"
                  - text: ":"
                  - generic [ref=e94]: search
                  - text: ","
                  - generic [ref=e95]: mode
                  - text: ": 'insensitive'"
                  - generic [ref=e96]: "} }"
                  - text: ","
                  - generic [ref=e97]: "cannot reassign to a variable declared with `const`"
            - generic [ref=e98]:
              - generic [ref=e99]: "1"
              - generic [ref=e100]: "2"
        - contentinfo [ref=e101]:
          - paragraph [ref=e102]: This error occurred during the build process and can only be dismissed by fixing the error.
```

# Test source

```ts
  1   | /**
  2   |  * Comprehensive E2E test — visits every page and touches every API.
  3   |  * Sequential execution avoids parallel auth race conditions.
  4   |  */
  5   | const { test, expect, loginAsAdmin } = require('./fixtures/auth');
  6   | 
  7   | const PUBLIC_PAGES = [
  8   |   ['/', 'Home'],
  9   |   ['/auth/login', 'Login'],
  10  |   ['/auth/register', 'Register'],
  11  | ];
  12  | 
  13  | const AUTH_PAGES = [
  14  |   ['/dashboard', 'Dashboard'],
  15  |   ['/dashboard/profile', 'Profile'],
  16  |   ['/dashboard/competitions', 'Competitions'],
  17  |   ['/dashboard/competitions/new', 'New Competition'],
  18  |   ['/dashboard/programs', 'Programs'],
  19  |   ['/dashboard/programs/new', 'New Program'],
  20  |   ['/dashboard/participants', 'Participants'],
  21  |   ['/dashboard/participants/new', 'New Participant'],
  22  |   ['/dashboard/judges', 'Judges'],
  23  |   ['/dashboard/judges/new', 'New Judge'],
  24  |   ['/dashboard/display', 'Display'],
  25  |   ['/dashboard/files', 'Files'],
  26  |   ['/dashboard/audit-logs', 'Audit Logs'],
  27  |   ['/dashboard/roles', 'Roles'],
  28  |   ['/dashboard/permissions', 'Permissions'],
  29  |   ['/dashboard/permissions/settings', 'Perm Settings'],
  30  |   ['/dashboard/permissions/roles', 'Perm Roles'],
  31  |   ['/dashboard/permissions/users', 'Perm Users'],
  32  |   ['/dashboard/permissions/data-access', 'Data Access'],
  33  |   ['/dashboard/tenants', 'Tenants'],
  34  | ];
  35  | 
  36  | const APIS = [
  37  |   ['GET', '/api/competitions'],
  38  |   ['GET', '/api/competitions/stats'],
  39  |   ['GET', '/api/programs'],
  40  |   ['GET', '/api/participants'],
  41  |   ['GET', '/api/judges'],
  42  |   ['GET', '/api/rankings'],
  43  |   ['GET', '/api/files'],
  44  |   ['GET', '/api/audit-logs'],
  45  |   ['GET', '/api/dashboard/stats'],
  46  |   ['GET', '/api/permissions/me'],
  47  |   ['GET', '/api/permissions/system-status'],
  48  |   ['GET', '/api/permissions/policies'],
  49  |   ['GET', '/api/permissions/security-config'],
  50  |   ['GET', '/api/permissions/audit-config'],
  51  | ];
  52  | 
  53  | // ── Public pages ──
  54  | test.describe('Public Pages', () => {
  55  |   for (const [path, label] of PUBLIC_PAGES) {
  56  |     test(`${label} (${path}) returns 200, no console errors`, async ({ page }) => {
  57  |       const errors = [];
  58  |       page.on('console', (msg) => {
  59  |         if (msg.type() === 'error' && !msg.text().includes('favicon')) {
  60  |           errors.push(msg.text().substring(0, 150));
  61  |         }
  62  |       });
  63  |       const resp = await page.goto(path, { waitUntil: 'load', timeout: 15_000 });
> 64  |       expect(resp.status(), `${label}: HTTP ${resp.status()}`).toBeLessThan(400);
      |                                                                ^ Error: Login: HTTP 500
  65  |       if (errors.length > 0) {
  66  |         console.warn(`  ${label} console errors: ${errors.join(' | ')}`);
  67  |       }
  68  |       // Don't fail on console errors for now — collect for report
  69  |     });
  70  |   }
  71  | });
  72  | 
  73  | // ── Auth pages ──
  74  | test.describe('Authenticated Pages', () => {
  75  |   test('login via admin@example.com / 123456', async ({ page }) => {
  76  |     await loginAsAdmin(page);
  77  |     expect(page.url()).toContain('/dashboard');
  78  |   });
  79  | 
  80  |   for (const [path, label] of AUTH_PAGES) {
  81  |     test(`${label} (${path}) returns 200`, async ({ page }) => {
  82  |       // Login fresh each time (storageState would be ideal but simpler inline)
  83  |       await loginAsAdmin(page);
  84  |       const errors = [];
  85  |       page.on('console', (msg) => {
  86  |         if (msg.type() === 'error' && !msg.text().includes('favicon')) {
  87  |           errors.push(msg.text().substring(0, 150));
  88  |         }
  89  |       });
  90  |       const apiErrors = [];
  91  |       page.on('response', (resp) => {
  92  |         if (resp.url().includes('/api/') && resp.status() >= 500) {
  93  |           apiErrors.push(`${resp.request().method()} ${new URL(resp.url()).pathname} → ${resp.status()}`);
  94  |         }
  95  |       });
  96  | 
  97  |       const resp = await page.goto(path, { waitUntil: 'domcontentloaded', timeout: 20_000 });
  98  |       await page.waitForTimeout(1000);
  99  | 
  100 |       expect(resp.status(), `${label}: HTTP ${resp.status()}`).toBeLessThan(400);
  101 |       expect(apiErrors, `${label}: ${apiErrors.length} API 500 errors`).toHaveLength(0);
  102 |     });
  103 |   }
  104 | });
  105 | 
  106 | // ── API endpoints ──
  107 | test.describe('API Endpoints', () => {
  108 |   test('login for API tests', async ({ page }) => {
  109 |     await loginAsAdmin(page);
  110 |   });
  111 | 
  112 |   for (const [method, path] of APIS) {
  113 |     test(`${method} ${path} returns < 400`, async ({ page }) => {
  114 |       await loginAsAdmin(page);
  115 |       const result = await page.evaluate(
  116 |         async ({ method, path }) => {
  117 |           const res = await fetch(path, { method });
  118 |           const text = await res.text();
  119 |           return { status: res.status, body: text.substring(0, 200) };
  120 |         },
  121 |         { method, path },
  122 |       );
  123 |       expect(result.status, `${method} ${path} → ${result.status}: ${result.body}`).toBeLessThan(400);
  124 |     });
  125 |   }
  126 | });
  127 | 
  128 | // ── Dynamic routes ──
  129 | test.describe('Dynamic Routes', () => {
  130 |   test('GET /api/competitions/[id] returns 200', async ({ page }) => {
  131 |     await loginAsAdmin(page);
  132 |     const resp = await page.evaluate(async () => {
  133 |       const r = await fetch('/api/competitions');
  134 |       const d = await r.json();
  135 |       return d.competitions?.[0]?.id || null;
  136 |     });
  137 |     if (!resp) { test.skip('No competitions in DB'); return; }
  138 | 
  139 |     const result = await page.evaluate(async (id) => {
  140 |       const r = await fetch(`/api/competitions/${id}`);
  141 |       return { status: r.status };
  142 |     }, resp);
  143 |     expect(result.status).toBeLessThan(400);
  144 |   });
  145 | 
  146 |   test('GET /display/[competitionId] loads', async ({ page }) => {
  147 |     await loginAsAdmin(page);
  148 |     const compId = await page.evaluate(async () => {
  149 |       const r = await fetch('/api/competitions');
  150 |       const d = await r.json();
  151 |       return d.competitions?.[0]?.id || null;
  152 |     });
  153 |     if (!compId) { test.skip('No competitions in DB'); return; }
  154 | 
  155 |     const resp = await page.goto(`/display/${compId}`, { waitUntil: 'load', timeout: 10_000 });
  156 |     expect(resp.status()).toBeLessThan(400);
  157 |   });
  158 | });
  159 | 
```