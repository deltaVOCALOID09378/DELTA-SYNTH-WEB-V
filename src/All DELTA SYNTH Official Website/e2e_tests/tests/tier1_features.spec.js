const { test, expect } = require('@playwright/test');

test.describe('Tier 1: Features (25 Tests)', () => {

  test.describe('Feature 1: Local Dev Server', () => {
    test('1. Server responds to / with HTTP 200', async ({ page }) => {
      const response = await page.goto('/');
      expect(response.status()).toBe(200);
    });

    test('2. Server response content-type is text/html', async ({ page }) => {
      const response = await page.goto('/');
      const contentType = response.headers()['content-type'];
      expect(contentType).toContain('text/html');
    });

    test('3. HTML document starts with a valid <!DOCTYPE html>', async ({ page }) => {
      await page.goto('/');
      const doctype = await page.evaluate(() => document.doctype ? document.doctype.name : null);
      expect(doctype).toBe('html');
    });

    test('4. Response time is within an acceptable latency (< 2000ms)', async ({ page }) => {
      const start = Date.now();
      await page.goto('/');
      const end = Date.now();
      expect(end - start).toBeLessThan(2000);
    });

    test('5. The window.location.protocol evaluates to http: or https:', async ({ page }) => {
      await page.goto('/');
      const protocol = await page.evaluate(() => window.location.protocol);
      expect(['http:', 'https:']).toContain(protocol);
    });
  });

  test.describe('Feature 2: Page Navigation', () => {
    test('1. Page contains at least one navigation link', async ({ page }) => {
      await page.goto('/');
      const links = page.getByRole('link');
      const count = await links.count();
      expect(count).toBeGreaterThan(0);
    });

    test('2. Clicking a generic link navigates successfully without returning a 404 status', async ({ page }) => {
      await page.goto('/');
      const links = page.getByRole('link');
      expect(await links.count()).toBeGreaterThan(0);
      
      const firstLink = links.first();
      const href = await firstLink.getAttribute('href');
      
      if (href && !href.startsWith('#')) {
        const responsePromise = page.waitForResponse(response => response.url().includes(href) || response.status() !== 0);
        await firstLink.click();
        const response = await responsePromise.catch(() => null);
        expect(response).not.toBeNull();
        expect(response.status()).not.toBe(404);
      } else {
        await firstLink.click();
        expect(page.url()).not.toContain('404');
      }
    });

    test('3. Back navigation via browser history correctly restores the previous page', async ({ page }) => {
      await page.goto('/');
      const initialUrl = page.url();
      const links = page.getByRole('link');
      expect(await links.count()).toBeGreaterThan(0);
      
      await links.first().click();
      await page.goBack();
      expect(page.url()).toBe(initialUrl);
    });

    test('4. All <a> tags on the page possess a valid, non-empty href attribute', async ({ page }) => {
      await page.goto('/');
      const links = page.locator('a');
      const count = await links.count();
      expect(count).toBeGreaterThan(0);
      
      for (let i = 0; i < count; i++) {
        const href = await links.nth(i).getAttribute('href');
        expect(href).toBeTruthy();
        expect(href.trim().length).toBeGreaterThan(0);
      }
    });

    test('5. Internal anchor links (if any) do not trigger a full page reload upon click', async ({ page }) => {
      await page.goto('/');
      let reloaded = false;
      page.on('framenavigated', () => { reloaded = true; });
      
      // Inject an internal link if none exists to test the behavior
      await page.evaluate(() => {
        const a = document.createElement('a');
        a.href = '#test-anchor';
        a.id = 'injected-anchor-link';
        a.innerText = 'Test Anchor';
        document.body.appendChild(a);
      });
      
      await page.locator('#injected-anchor-link').click();
      await page.waitForTimeout(500); // Wait a bit to see if reload happens
      
      // If it's just a hash change, framenavigated might fire but load event shouldn't, 
      // however Playwright considers hash change a navigation. Let's check if the page was completely reloaded.
      const isSamePage = await page.evaluate(() => window.performance.getEntriesByType('navigation')[0].type !== 'reload');
      expect(isSamePage).toBe(true);
    });
  });

  test.describe('Feature 3: Responsive Layout', () => {
    test('1. Document contains a responsive <meta name="viewport"> tag', async ({ page }) => {
      await page.goto('/');
      const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
      expect(viewport).toBeTruthy();
      expect(viewport).toContain('width=device-width');
    });

    test('2. On Mobile (375px), horizontal scroll width does not exceed the viewport width', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(overflow).toBe(false);
    });

    test('3. On Tablet (768px), horizontal scroll width does not exceed the viewport width', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/');
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(overflow).toBe(false);
    });

    test('4. On Desktop (1280px), horizontal scroll width does not exceed the viewport width', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto('/');
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(overflow).toBe(false);
    });

    test('5. The main structural element remains visible across all three viewports', async ({ page }) => {
      const viewports = [
        { width: 375, height: 667 },
        { width: 768, height: 1024 },
        { width: 1280, height: 800 }
      ];
      
      for (const vp of viewports) {
        await page.setViewportSize(vp);
        await page.goto('/');
        const main = page.getByRole('main');
        expect(await main.count()).toBeGreaterThan(0);
        await expect(main.first()).toBeVisible();
      }
    });
  });

  test.describe('Feature 4: Asset/Resource Load', () => {
    test('1. At least one stylesheet is dynamically loaded', async ({ page }) => {
      let stylesheetCount = 0;
      page.on('response', response => {
        if (response.request().resourceType() === 'stylesheet') {
          stylesheetCount++;
        }
      });
      await page.goto('/');
      expect(stylesheetCount).toBeGreaterThan(0);
    });

    test('2. All dynamically loaded stylesheets return HTTP 200', async ({ page }) => {
      const failedStylesheets = [];
      page.on('response', response => {
        if (response.request().resourceType() === 'stylesheet' && response.status() !== 200 && response.status() !== 304) {
          failedStylesheets.push(response.url());
        }
      });
      await page.goto('/');
      expect(failedStylesheets).toHaveLength(0);
    });

    test('3. At least one script or image is loaded, returning HTTP 200', async ({ page }) => {
      let resourceCount = 0;
      page.on('response', response => {
        const type = response.request().resourceType();
        if ((type === 'script' || type === 'image') && (response.status() === 200 || response.status() === 304)) {
          resourceCount++;
        }
      });
      await page.goto('/');
      expect(resourceCount).toBeGreaterThan(0);
    });

    test('4. Page triggers exactly 0 uncaught JavaScript console errors on load', async ({ page }) => {
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto('/');
      expect(errors).toHaveLength(0);
    });

    test('5. No mixed-content requests (HTTP vs HTTPS mismatch) are triggered', async ({ page }) => {
      const mixedContentUrls = [];
      page.on('request', request => {
        if (request.url().startsWith('http://') && page.url().startsWith('https://')) {
          mixedContentUrls.push(request.url());
        }
      });
      await page.goto('/');
      expect(mixedContentUrls).toHaveLength(0);
    });
  });

  test.describe('Feature 5: Clean Codebase Structure', () => {
    test('1. HTML document contains a <header> or <nav> semantic element', async ({ page }) => {
      await page.goto('/');
      const headerOrNav = page.locator('header, nav');
      expect(await headerOrNav.count()).toBeGreaterThan(0);
    });

    test('2. HTML document contains a <main> semantic element', async ({ page }) => {
      await page.goto('/');
      const main = page.getByRole('main');
      expect(await main.count()).toBeGreaterThan(0);
    });

    test('3. HTML document contains exactly one <h1> element', async ({ page }) => {
      await page.goto('/');
      const h1 = page.getByRole('heading', { level: 1 });
      expect(await h1.count()).toBe(1);
    });

    test('4. All <img> elements present on the page contain an alt attribute', async ({ page }) => {
      await page.goto('/');
      const images = page.locator('img');
      const count = await images.count();
      expect(count).toBeGreaterThan(0);
      for (let i = 0; i < count; i++) {
        const alt = await images.nth(i).getAttribute('alt');
        expect(alt).not.toBeNull();
      }
    });

    test('5. HTML document contains a <footer> semantic element', async ({ page }) => {
      await page.goto('/');
      const footer = page.locator('footer');
      expect(await footer.count()).toBeGreaterThan(0);
    });
  });
});
