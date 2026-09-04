# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tier4_workload.spec.js >> Tier 4: Workload & Scenarios >> Full Desktop Tour: Sequential traversal at 1920x1080
- Location: tests\tier4_workload.spec.js:23:3

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - navigation [ref=e2]:
    - generic [ref=e3]:
      - link "DELTA SYNTH" [ref=e4] [cursor=pointer]:
        - /url: index.html
      - generic [ref=e5]:
        - link "Home" [ref=e6] [cursor=pointer]:
          - /url: index.html
        - link "About Us" [ref=e7] [cursor=pointer]:
          - /url: about.html
        - link "Voicebanks" [ref=e8] [cursor=pointer]:
          - /url: "#"
        - link "Files" [ref=e9] [cursor=pointer]:
          - /url: "#"
        - link "Events" [ref=e10] [cursor=pointer]:
          - /url: "#"
        - link "Collab" [ref=e11] [cursor=pointer]:
          - /url: "#"
  - main [ref=e12]:
    - generic [ref=e13]:
      - heading "WELCOME To our DELTA SYNTH's Studio Website" [level=1] [ref=e14]
      - paragraph [ref=e15]: We are the Professionall singing for you all your passion
      - paragraph [ref=e16]: DELTA SYNTH Th
    - generic [ref=e17]:
      - generic [ref=e18]:
        - heading "**NEWs activity andnew VOICEBANK forfix and UPgrade in 2025**" [level=2] [ref=e19]
        - paragraph [ref=e20]: New UTAU And Upgreade to Diffsingercoming soon, they will come back later
      - generic [ref=e21]:
        - generic [ref=e22]:
          - heading "New The Singer For The Professionall Singer" [level=3] [ref=e23]
          - paragraph [ref=e24]: We have a Collabolation project with Printmov Team for Register in him partner to test for all new upgrade to Diffsinger AI Engine to the best Quallity voice.We can sing for 7 Language now, It's have a Thai English Japanese Chinese Korean French and Espnal for SpainishThank you for any Support. We're all glad for made our project together.They're new upgrade singer in this season June 2025
          - paragraph [ref=e25]: โปรเจกต์ที่อยู่ ในระหว่างจัดสรรค์ เวลาทำงาน เพื่อให้แล้วเสร็จตามเป้าหมาย ตามที่ได้กำหนดไว้ จึงจะโฟกัสกับการแต่งเพลงได้อย่างเต็มที่ เพื่อเป้าหมายที่ดีที่สุดของเรา ในระยะยาว ต่อจากนี้
        - generic [ref=e26]:
          - generic [ref=e27]:
            - heading "More Projects & Downloads" [level=3] [ref=e28]
            - paragraph [ref=e29]: We have more project so much. You can follow me to visit me now.พวกเราเองก็มีงานหลายๆ โปรเจกต์ให้ติดตามเรื่อยๆ อยู่นะ
            - paragraph [ref=e30]: You can searching and dowload all our voicebank or All Midi Ust Vsqx and SVP's song in this website now, Please select for your needding.
          - paragraph [ref=e32]: Thank you. By Mr. Delta
  - contentinfo [ref=e33]:
    - generic [ref=e34]:
      - generic [ref=e35]:
        - heading "DELTA SYNTH" [level=4] [ref=e36]
        - paragraph [ref=e37]: We are the Professionall singing for you all your passion.
      - generic [ref=e38]:
        - heading "Contact" [level=4] [ref=e39]
        - list [ref=e40]:
          - listitem [ref=e41]:
            - text: "Public:"
            - link "delta.vocaloid09378@gmail.com" [ref=e42] [cursor=pointer]:
              - /url: mailto:delta.vocaloid09378@gmail.com
          - listitem [ref=e43]:
            - text: "Emergency:"
            - link "patiphat.wongyai@gmail.com" [ref=e44] [cursor=pointer]:
              - /url: mailto:patiphat.wongyai@gmail.com
      - generic [ref=e45]:
        - heading "Social Media" [level=4] [ref=e46]
        - list [ref=e47]:
          - listitem [ref=e48]:
            - text: "YouTube:"
            - link "DELTA SYNTH Official" [ref=e49] [cursor=pointer]:
              - /url: "#"
          - listitem [ref=e50]:
            - text: "TikTok:"
            - link "DELTA SYNTH" [ref=e51] [cursor=pointer]:
              - /url: "#"
          - listitem [ref=e52]:
            - text: "X:"
            - link "DELTA SYNTH" [ref=e53] [cursor=pointer]:
              - /url: "#"
    - paragraph [ref=e55]: © 2025 DELTA SYNTH. All rights reserved.
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test.describe('Tier 4: Workload & Scenarios', () => {
  4  |   test('Full Mobile Tour: Emulate iPhone, visit pages without errors', async ({ page }) => {
  5  |     const errors = [];
  6  |     page.on('pageerror', error => errors.push(error.message));
  7  | 
  8  |     await page.setViewportSize({ width: 375, height: 812 }); // iPhone X
  9  |     await page.goto('/');
  10 | 
  11 |     const links = await page.locator('a[href^="/"]').all();
  12 |     expect(links.length).toBeGreaterThan(0);
  13 |     const maxPages = Math.min(links.length, 3);
  14 |     for (let i = 0; i < maxPages; i++) {
  15 |       const href = await links[i].getAttribute('href');
  16 |       expect(href).not.toBeNull();
  17 |       await page.goto(href);
  18 |     }
  19 | 
  20 |     expect(errors).toHaveLength(0);
  21 |   });
  22 | 
  23 |   test('Full Desktop Tour: Sequential traversal at 1920x1080', async ({ page }) => {
  24 |     const errors = [];
  25 |     page.on('pageerror', error => errors.push(error.message));
  26 | 
  27 |     await page.setViewportSize({ width: 1920, height: 1080 });
  28 |     await page.goto('/');
  29 | 
  30 |     // Go to a few links
  31 |     const links = await page.locator('a[href^="/"]').all();
> 32 |     expect(links.length).toBeGreaterThan(0);
     |                          ^ Error: expect(received).toBeGreaterThan(expected)
  33 |     for (let i = 0; i < Math.min(links.length, 3); i++) {
  34 |       const href = await links[i].getAttribute('href');
  35 |       expect(href).not.toBeNull();
  36 |       await page.goto(href);
  37 |     }
  38 | 
  39 |     expect(errors).toHaveLength(0);
  40 |   });
  41 | 
  42 |   test('Refresh Stress: Reload page 10 times consecutively', async ({ page }) => {
  43 |     await page.goto('/');
  44 |     for (let i = 0; i < 10; i++) {
  45 |       const response = await page.reload();
  46 |       expect(response.status()).toBe(200);
  47 |     }
  48 |   });
  49 | 
  50 |   test('Parallel Deep Links: Concurrent requests', async ({ browser }) => {
  51 |     const routes = ['/', '/about.html', '/products.html', '/contact.html', '/support.html'];
  52 |     const contexts = await Promise.all(routes.map(() => browser.newContext()));
  53 |     
  54 |     await Promise.all(contexts.map(async (context, i) => {
  55 |       const page = await context.newPage();
  56 |       const response = await page.goto(routes[i]);
  57 |       // Expect it not to timeout, status can be 200 or 404
  58 |       expect([200, 404]).toContain(response.status());
  59 |     }));
  60 |   });
  61 | 
  62 |   test('Fast Resize: Continuous viewport adjustment', async ({ page }) => {
  63 |     await page.goto('/');
  64 |     for (let width = 1000; width >= 400; width -= 100) {
  65 |       await page.setViewportSize({ width, height: 800 });
  66 |       // Just assert it didn't crash
  67 |       const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
  68 |       expect(bodyWidth).toBeLessThanOrEqual(width);
  69 |     }
  70 |   });
  71 | });
  72 | 
```