# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tier1_features.spec.js >> Tier 1: Features (25 Tests) >> Feature 5: Clean Codebase Structure >> 4. All <img> elements present on the page contain an alt attribute
- Location: tests\tier1_features.spec.js:232:5

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
  136 |       await page.setViewportSize({ width: 1280, height: 800 });
  137 |       await page.goto('/');
  138 |       const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  139 |       expect(overflow).toBe(false);
  140 |     });
  141 | 
  142 |     test('5. The main structural element remains visible across all three viewports', async ({ page }) => {
  143 |       const viewports = [
  144 |         { width: 375, height: 667 },
  145 |         { width: 768, height: 1024 },
  146 |         { width: 1280, height: 800 }
  147 |       ];
  148 |       
  149 |       for (const vp of viewports) {
  150 |         await page.setViewportSize(vp);
  151 |         await page.goto('/');
  152 |         const main = page.getByRole('main');
  153 |         expect(await main.count()).toBeGreaterThan(0);
  154 |         await expect(main.first()).toBeVisible();
  155 |       }
  156 |     });
  157 |   });
  158 | 
  159 |   test.describe('Feature 4: Asset/Resource Load', () => {
  160 |     test('1. At least one stylesheet is dynamically loaded', async ({ page }) => {
  161 |       let stylesheetCount = 0;
  162 |       page.on('response', response => {
  163 |         if (response.request().resourceType() === 'stylesheet') {
  164 |           stylesheetCount++;
  165 |         }
  166 |       });
  167 |       await page.goto('/');
  168 |       expect(stylesheetCount).toBeGreaterThan(0);
  169 |     });
  170 | 
  171 |     test('2. All dynamically loaded stylesheets return HTTP 200', async ({ page }) => {
  172 |       const failedStylesheets = [];
  173 |       page.on('response', response => {
  174 |         if (response.request().resourceType() === 'stylesheet' && response.status() !== 200 && response.status() !== 304) {
  175 |           failedStylesheets.push(response.url());
  176 |         }
  177 |       });
  178 |       await page.goto('/');
  179 |       expect(failedStylesheets).toHaveLength(0);
  180 |     });
  181 | 
  182 |     test('3. At least one script or image is loaded, returning HTTP 200', async ({ page }) => {
  183 |       let resourceCount = 0;
  184 |       page.on('response', response => {
  185 |         const type = response.request().resourceType();
  186 |         if ((type === 'script' || type === 'image') && (response.status() === 200 || response.status() === 304)) {
  187 |           resourceCount++;
  188 |         }
  189 |       });
  190 |       await page.goto('/');
  191 |       expect(resourceCount).toBeGreaterThan(0);
  192 |     });
  193 | 
  194 |     test('4. Page triggers exactly 0 uncaught JavaScript console errors on load', async ({ page }) => {
  195 |       const errors = [];
  196 |       page.on('pageerror', error => errors.push(error.message));
  197 |       await page.goto('/');
  198 |       expect(errors).toHaveLength(0);
  199 |     });
  200 | 
  201 |     test('5. No mixed-content requests (HTTP vs HTTPS mismatch) are triggered', async ({ page }) => {
  202 |       const mixedContentUrls = [];
  203 |       page.on('request', request => {
  204 |         if (request.url().startsWith('http://') && page.url().startsWith('https://')) {
  205 |           mixedContentUrls.push(request.url());
  206 |         }
  207 |       });
  208 |       await page.goto('/');
  209 |       expect(mixedContentUrls).toHaveLength(0);
  210 |     });
  211 |   });
  212 | 
  213 |   test.describe('Feature 5: Clean Codebase Structure', () => {
  214 |     test('1. HTML document contains a <header> or <nav> semantic element', async ({ page }) => {
  215 |       await page.goto('/');
  216 |       const headerOrNav = page.locator('header, nav');
  217 |       expect(await headerOrNav.count()).toBeGreaterThan(0);
  218 |     });
  219 | 
  220 |     test('2. HTML document contains a <main> semantic element', async ({ page }) => {
  221 |       await page.goto('/');
  222 |       const main = page.getByRole('main');
  223 |       expect(await main.count()).toBeGreaterThan(0);
  224 |     });
  225 | 
  226 |     test('3. HTML document contains exactly one <h1> element', async ({ page }) => {
  227 |       await page.goto('/');
  228 |       const h1 = page.getByRole('heading', { level: 1 });
  229 |       expect(await h1.count()).toBe(1);
  230 |     });
  231 | 
  232 |     test('4. All <img> elements present on the page contain an alt attribute', async ({ page }) => {
  233 |       await page.goto('/');
  234 |       const images = page.locator('img');
  235 |       const count = await images.count();
> 236 |       expect(count).toBeGreaterThan(0);
      |                     ^ Error: expect(received).toBeGreaterThan(expected)
  237 |       for (let i = 0; i < count; i++) {
  238 |         const alt = await images.nth(i).getAttribute('alt');
  239 |         expect(alt).not.toBeNull();
  240 |       }
  241 |     });
  242 | 
  243 |     test('5. HTML document contains a <footer> semantic element', async ({ page }) => {
  244 |       await page.goto('/');
  245 |       const footer = page.locator('footer');
  246 |       expect(await footer.count()).toBeGreaterThan(0);
  247 |     });
  248 |   });
  249 | });
  250 | 
```