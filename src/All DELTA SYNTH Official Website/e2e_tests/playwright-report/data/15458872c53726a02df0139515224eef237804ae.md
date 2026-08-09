# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tier3_cross.spec.js >> Tier 3: Cross-feature >> Navigation + Responsive: Resize from desktop to mobile on sub-page
- Location: tests\tier3_cross.spec.js:4:3

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
  3  | test.describe('Tier 3: Cross-feature', () => {
  4  |   test('Navigation + Responsive: Resize from desktop to mobile on sub-page', async ({ page }) => {
  5  |     // Desktop
  6  |     await page.setViewportSize({ width: 1080, height: 800 });
  7  |     await page.goto('/');
  8  |     
  9  |     // Find a link and navigate
  10 |     const links = await page.locator('a[href^="/"]').all();
> 11 |     expect(links.length).toBeGreaterThan(0);
     |                          ^ Error: expect(received).toBeGreaterThan(expected)
  12 |     const href = await links[0].getAttribute('href');
  13 |     expect(href).not.toBeNull();
  14 |     await page.goto(href);
  15 |     
  16 |     // Resize to mobile
  17 |     await page.setViewportSize({ width: 375, height: 667 });
  18 |     
  19 |     // Expect hamburger menu or mobile-specific styling to appear
  20 |     const menu = page.getByRole('button', { name: /menu/i });
  21 |     expect(await menu.count()).toBeGreaterThan(0);
  22 |     await expect(menu.first()).toBeVisible();
  23 |   });
  24 | 
  25 |   test('Deep Linking + Dev Server: Navigate to an internal page directly', async ({ page }) => {
  26 |     // We assume /about.html or some sub-page will exist.
  27 |     // We use a safe check
  28 |     const response = await page.goto('/about.html');
  29 |     // We just verify it doesn't crash. If it's 404 because not implemented yet, that's fine for the framework test.
  30 |     expect([200, 404]).toContain(response.status());
  31 |   });
  32 | 
  33 |   test('Assets + Responsive: Check CSS media queries', async ({ page }) => {
  34 |     await page.goto('/');
  35 |     // We can evaluate if the browser applies different styles by checking a common element like body
  36 |     await page.setViewportSize({ width: 375, height: 667 });
  37 |     const mobileDisplay = await page.evaluate(() => {
  38 |       const nav = document.querySelector('nav ul');
  39 |       return nav ? window.getComputedStyle(nav).display : null;
  40 |     });
  41 | 
  42 |     await page.setViewportSize({ width: 1080, height: 800 });
  43 |     const desktopDisplay = await page.evaluate(() => {
  44 |       const nav = document.querySelector('nav ul');
  45 |       return nav ? window.getComputedStyle(nav).display : null;
  46 |     });
  47 | 
  48 |     // We do a loose check.
  49 |     expect(mobileDisplay).not.toBeUndefined();
  50 |   });
  51 | });
  52 | 
```