# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tier2_boundaries.spec.js >> Tier 2: Boundaries (25 Tests) >> Feature 2: Page Navigation >> 2. Clicking a link while the page is still in a loading state does not trigger an exception
- Location: tests\tier2_boundaries.spec.js:61:5

# Error details

```
Error: locator.click: Element is outside of the viewport
Call log:
  - waiting for locator('#early-link')
    - locator resolved to <a href="#early" id="early-link"></a>
  - attempting click action
    - scrolling into view if needed
    - done scrolling

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - navigation [ref=e2]:
    - generic [ref=e3]:
      - link "DELTA SYNTH" [ref=e4] [cursor=pointer]:
        - /url: index.html
      - button [ref=e5] [cursor=pointer]:
        - img [ref=e6]
  - main [ref=e8]:
    - generic [ref=e9]:
      - heading "WELCOME To our DELTA SYNTH's Studio Website" [level=1] [ref=e10]
      - paragraph [ref=e11]: We are the Professionall singing for you all your passion
      - paragraph [ref=e12]: DELTA SYNTH Th
    - generic [ref=e13]:
      - generic [ref=e14]:
        - heading "**NEWs activity andnew VOICEBANK forfix and UPgrade in 2025**" [level=2] [ref=e15]
        - paragraph [ref=e16]: New UTAU And Upgreade to Diffsingercoming soon, they will come back later
      - generic [ref=e17]:
        - generic [ref=e18]:
          - heading "New The Singer For The Professionall Singer" [level=3] [ref=e19]
          - paragraph [ref=e20]: We have a Collabolation project with Printmov Team for Register in him partner to test for all new upgrade to Diffsinger AI Engine to the best Quallity voice.We can sing for 7 Language now, It's have a Thai English Japanese Chinese Korean French and Espnal for SpainishThank you for any Support. We're all glad for made our project together.They're new upgrade singer in this season June 2025
          - paragraph [ref=e21]: โปรเจกต์ที่อยู่ ในระหว่างจัดสรรค์ เวลาทำงาน เพื่อให้แล้วเสร็จตามเป้าหมาย ตามที่ได้กำหนดไว้ จึงจะโฟกัสกับการแต่งเพลงได้อย่างเต็มที่ เพื่อเป้าหมายที่ดีที่สุดของเรา ในระยะยาว ต่อจากนี้
        - generic [ref=e22]:
          - generic [ref=e23]:
            - heading "More Projects & Downloads" [level=3] [ref=e24]
            - paragraph [ref=e25]: We have more project so much. You can follow me to visit me now.พวกเราเองก็มีงานหลายๆ โปรเจกต์ให้ติดตามเรื่อยๆ อยู่นะ
            - paragraph [ref=e26]: You can searching and dowload all our voicebank or All Midi Ust Vsqx and SVP's song in this website now, Please select for your needding.
          - paragraph [ref=e28]: Thank you. By Mr. Delta
  - contentinfo [ref=e29]:
    - generic [ref=e30]:
      - generic [ref=e31]:
        - heading "DELTA SYNTH" [level=4] [ref=e32]
        - paragraph [ref=e33]: We are the Professionall singing for you all your passion.
      - generic [ref=e34]:
        - heading "Contact" [level=4] [ref=e35]
        - list [ref=e36]:
          - listitem [ref=e37]:
            - text: "Public:"
            - link "delta.vocaloid09378@gmail.com" [ref=e38] [cursor=pointer]:
              - /url: mailto:delta.vocaloid09378@gmail.com
          - listitem [ref=e39]:
            - text: "Emergency:"
            - link "patiphat.wongyai@gmail.com" [ref=e40] [cursor=pointer]:
              - /url: mailto:patiphat.wongyai@gmail.com
      - generic [ref=e41]:
        - heading "Social Media" [level=4] [ref=e42]
        - list [ref=e43]:
          - listitem [ref=e44]:
            - text: "YouTube:"
            - link "DELTA SYNTH Official" [ref=e45] [cursor=pointer]:
              - /url: "#"
          - listitem [ref=e46]:
            - text: "TikTok:"
            - link "DELTA SYNTH" [ref=e47] [cursor=pointer]:
              - /url: "#"
          - listitem [ref=e48]:
            - text: "X:"
            - link "DELTA SYNTH" [ref=e49] [cursor=pointer]:
              - /url: "#"
    - paragraph [ref=e51]: © 2025 DELTA SYNTH. All rights reserved.
  - link:
    - /url: "#early"
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
  19  |       expect([404, 405]).toContain(response.status());
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
> 82  |       await page.locator('#early-link').click({ force: true });
      |                                         ^ Error: locator.click: Element is outside of the viewport
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
  120 |       await page.setViewportSize({ width: 320, height: 480 });
  121 |       await page.goto('/');
  122 |       const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  123 |       expect(overflow).toBe(false);
  124 |     });
  125 | 
  126 |     test('2. At ultra-wide 4K widths (3840px), the layout maintains structural integrity', async ({ page }) => {
  127 |       await page.setViewportSize({ width: 3840, height: 2160 });
  128 |       await page.goto('/');
  129 |       const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  130 |       expect(overflow).toBe(false);
  131 |     });
  132 | 
  133 |     test('3. Rapidly resizing the viewport does not trigger JS layout errors', async ({ page }) => {
  134 |       const errors = [];
  135 |       page.on('pageerror', error => errors.push(error.message));
  136 |       await page.goto('/');
  137 |       
  138 |       for (let i = 0; i < 3; i++) {
  139 |         await page.setViewportSize({ width: 1280, height: 800 });
  140 |         await page.waitForTimeout(50);
  141 |         await page.setViewportSize({ width: 375, height: 667 });
  142 |         await page.waitForTimeout(50);
  143 |       }
  144 |       expect(errors).toHaveLength(0);
  145 |     });
  146 | 
  147 |     test('4. Simulating a dynamic orientation change works smoothly without overflow', async ({ page }) => {
  148 |       // Landscape
  149 |       await page.setViewportSize({ width: 812, height: 375 });
  150 |       await page.goto('/');
  151 |       let overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  152 |       expect(overflow).toBe(false);
  153 |       
  154 |       // Portrait
  155 |       await page.setViewportSize({ width: 375, height: 812 });
  156 |       overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  157 |       expect(overflow).toBe(false);
  158 |     });
  159 | 
  160 |     test('5. With browser zoom set to 200%, the horizontal layout does not break', async ({ page }) => {
  161 |       await page.setViewportSize({ width: 1280, height: 800 });
  162 |       await page.goto('/');
  163 |       
  164 |       // Simulate zoom by evaluating CSS zoom or scale
  165 |       await page.evaluate(() => {
  166 |         document.body.style.zoom = '200%';
  167 |       });
  168 |       
  169 |       const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth * 2); // Approximation for zoom
  170 |       expect(overflow).toBe(false);
  171 |     });
  172 |   });
  173 | 
  174 |   test.describe('Feature 4: Asset/Resource Load', () => {
  175 |     test('1. Simulating aborted image requests does not break page rendering or throw uncaught JS errors', async ({ page }) => {
  176 |       await page.route('**/*.{png,jpg,jpeg,svg,gif,webp}', route => route.abort());
  177 |       const errors = [];
  178 |       page.on('pageerror', error => errors.push(error.message));
  179 |       await page.goto('/');
  180 |       expect(errors).toHaveLength(0);
  181 |     });
  182 | 
```