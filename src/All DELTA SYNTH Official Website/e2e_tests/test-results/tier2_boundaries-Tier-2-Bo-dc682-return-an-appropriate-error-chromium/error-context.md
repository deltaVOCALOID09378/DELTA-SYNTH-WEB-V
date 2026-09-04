# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tier2_boundaries.spec.js >> Tier 2: Boundaries (25 Tests) >> Feature 1: Local Dev Server >> 3. Requests with unsupported HTTP methods return an appropriate error
- Location: tests\tier2_boundaries.spec.js:17:5

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected value: 200
Received array: [404, 405]
```

# Test source

```ts
  1   | const { test, expect } = require('@playwright/test');
  2   | 
  3   | test.describe('Tier 2: Boundaries (25 Tests)', () => {
  4   | 
  5   |   test.describe('Feature 1: Local Dev Server', () => {
  6   |     test('1. Navigating to a non-existent path returns HTTP 404', async ({ page }) => {
  7   |       const response = await page.goto('/non-existent-12345');
  8   |       expect(response.status()).toBe(404);
  9   |     });
  10  | 
  11  |     test('2. Extremely long URL paths are handled gracefully', async ({ page }) => {
  12  |       const longPath = '/' + 'a'.repeat(2000);
  13  |       const response = await page.goto(longPath);
  14  |       expect([404, 414]).toContain(response.status());
  15  |     });
  16  | 
  17  |     test('3. Requests with unsupported HTTP methods return an appropriate error', async ({ request }) => {
  18  |       const response = await request.post('/');
> 19  |       expect([404, 405]).toContain(response.status());
      |                          ^ Error: expect(received).toContain(expected) // indexOf
  20  |     });
  21  | 
  22  |     test('4. Malformed URLs are handled without crashing the server', async ({ page }) => {
  23  |       const response = await page.goto('/%%').catch(e => null);
  24  |       // Playwright might throw an error on malformed URL before it reaches the server,
  25  |       // but if it reaches the server, it shouldn't crash it and should return 400/404.
  26  |       expect(response).not.toBeNull();
  27  |       expect([400, 404]).toContain(response.status());
  28  |     });
  29  | 
  30  |     test('5. Trailing slash inconsistencies resolve without a 500 server error', async ({ page }) => {
  31  |       const response1 = await page.goto('/about/');
  32  |       expect(response1.status()).not.toBe(500);
  33  |       
  34  |       const response2 = await page.goto('/about');
  35  |       expect(response2.status()).not.toBe(500);
  36  |     });
  37  |   });
  38  | 
  39  |   test.describe('Feature 2: Page Navigation', () => {
  40  |     test('1. Rapidly clicking the same link 10 times consecutively produces zero JS errors', async ({ page }) => {
  41  |       const errors = [];
  42  |       page.on('pageerror', error => errors.push(error.message));
  43  |       await page.goto('/');
  44  |       
  45  |       // Inject a safe link to click repeatedly
  46  |       await page.evaluate(() => {
  47  |         const a = document.createElement('a');
  48  |         a.href = '#test-rapid';
  49  |         a.id = 'rapid-link';
  50  |         a.innerText = 'Rapid Link';
  51  |         document.body.appendChild(a);
  52  |       });
  53  |       
  54  |       const link = page.locator('#rapid-link');
  55  |       for (let i = 0; i < 10; i++) {
  56  |         await link.click();
  57  |       }
  58  |       expect(errors).toHaveLength(0);
  59  |     });
  60  | 
  61  |     test('2. Clicking a link while the page is still in a loading state does not trigger an exception', async ({ page }) => {
  62  |       // Intercept a request to hang the page load
  63  |       await page.route('**/slow-resource', async route => {
  64  |         await new Promise(resolve => setTimeout(resolve, 5000));
  65  |         route.continue();
  66  |       });
  67  |       
  68  |       await page.evaluate(() => {
  69  |         document.body.innerHTML = '<a id="early-link" href="#early">Click Me</a><img src="/slow-resource" />';
  70  |       }).catch(() => {});
  71  |       
  72  |       // Go to a base page, then we simulate this behavior
  73  |       await page.goto('/');
  74  |       await page.evaluate(() => {
  75  |         const a = document.createElement('a');
  76  |         a.href = '#early';
  77  |         a.id = 'early-link';
  78  |         document.body.appendChild(a);
  79  |       });
  80  |       
  81  |       // Since Playwright awaits load state, this test ensures no exceptions occur when we click early
  82  |       await page.locator('#early-link').click({ force: true });
  83  |       expect(true).toBe(true); // Simply reaching here means no crash
  84  |     });
  85  | 
  86  |     test('3. Keyboard navigation successfully focuses at least one interactive element', async ({ page }) => {
  87  |       await page.goto('/');
  88  |       // Press Tab
  89  |       await page.keyboard.press('Tab');
  90  |       const isFocused = await page.evaluate(() => document.activeElement !== document.body);
  91  |       expect(isFocused).toBe(true);
  92  |     });
  93  | 
  94  |     test('4. URLs containing unexpected query parameters do not break page rendering', async ({ page }) => {
  95  |       const errors = [];
  96  |       page.on('pageerror', error => errors.push(error.message));
  97  |       await page.goto('/?foo=bar&baz=qux%20invalid');
  98  |       expect(errors).toHaveLength(0);
  99  |     });
  100 | 
  101 |     test('5. Attempting to navigate backward when no history exists does not crash the application', async ({ context }) => {
  102 |       const page = await context.newPage();
  103 |       await page.goto('/');
  104 |       const errors = [];
  105 |       page.on('pageerror', error => errors.push(error.message));
  106 |       
  107 |       // Can't go back, but we just verify it doesn't crash the JS context
  108 |       try {
  109 |         await page.goBack();
  110 |       } catch (e) {
  111 |         // Expected to fail navigation in PW, but not crash the page
  112 |       }
  113 |       expect(errors).toHaveLength(0);
  114 |       await page.close();
  115 |     });
  116 |   });
  117 | 
  118 |   test.describe('Feature 3: Responsive Layout', () => {
  119 |     test('1. At extremely narrow widths (320px), the page does not overflow horizontally', async ({ page }) => {
```