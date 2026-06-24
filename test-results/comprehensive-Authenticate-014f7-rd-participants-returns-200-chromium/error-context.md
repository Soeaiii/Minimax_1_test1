# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: comprehensive.spec.js >> Authenticated Pages >> Participants (/dashboard/participants) returns 200
- Location: tests/comprehensive.spec.js:81:5

# Error details

```
Test timeout of 45000ms exceeded.
```

```
Error: page.fill: Test timeout of 45000ms exceeded.
Call log:
  - waiting for locator('input[name="email"]')

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
  1  | const { test: base, expect } = require('@playwright/test');
  2  | 
  3  | /**
  4  |  * Extended test fixture that provides automatic admin login.
  5  |  * Every test starts with an authenticated context.
  6  |  */
  7  | const test = base.extend({
  8  |   authenticatedPage: async ({ page }, use) => {
  9  |     await loginAsAdmin(page);
  10 |     await use(page);
  11 |   },
  12 | });
  13 | 
  14 | async function loginAsAdmin(page) {
  15 |   await page.goto('/auth/login', { waitUntil: 'load' });
> 16 |   await page.fill('input[name="email"]', 'admin@example.com');
     |              ^ Error: page.fill: Test timeout of 45000ms exceeded.
  17 |   await page.fill('input[name="password"]', '123456');
  18 |   await page.click('button[type="submit"]');
  19 |   await page.waitForURL('**/dashboard**', { timeout: 10_000 });
  20 |   await page.waitForLoadState('networkidle');
  21 | }
  22 | 
  23 | module.exports = { test, expect, loginAsAdmin };
  24 | 
```