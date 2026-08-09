const { test, expect } = require('@playwright/test');

test.describe('Tier 4: Workload & Scenarios', () => {
  test('Full Mobile Tour: Emulate iPhone, visit pages without errors', async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));

    await page.setViewportSize({ width: 375, height: 812 }); // iPhone X
    await page.goto('/');

    const links = await page.locator('a[href^="/"]').all();
    expect(links.length).toBeGreaterThan(0);
    const maxPages = Math.min(links.length, 3);
    for (let i = 0; i < maxPages; i++) {
      const href = await links[i].getAttribute('href');
      expect(href).not.toBeNull();
      await page.goto(href);
    }

    expect(errors).toHaveLength(0);
  });

  test('Full Desktop Tour: Sequential traversal at 1920x1080', async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));

    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');

    // Go to a few links
    const links = await page.locator('a[href^="/"]').all();
    expect(links.length).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(links.length, 3); i++) {
      const href = await links[i].getAttribute('href');
      expect(href).not.toBeNull();
      await page.goto(href);
    }

    expect(errors).toHaveLength(0);
  });

  test('Refresh Stress: Reload page 10 times consecutively', async ({ page }) => {
    await page.goto('/');
    for (let i = 0; i < 10; i++) {
      const response = await page.reload();
      expect(response.status()).toBe(200);
    }
  });

  test('Parallel Deep Links: Concurrent requests', async ({ browser }) => {
    const routes = ['/', '/about.html', '/products.html', '/contact.html', '/support.html'];
    const contexts = await Promise.all(routes.map(() => browser.newContext()));
    
    await Promise.all(contexts.map(async (context, i) => {
      const page = await context.newPage();
      const response = await page.goto(routes[i]);
      // Expect it not to timeout, status can be 200 or 404
      expect([200, 404]).toContain(response.status());
    }));
  });

  test('Fast Resize: Continuous viewport adjustment', async ({ page }) => {
    await page.goto('/');
    for (let width = 1000; width >= 400; width -= 100) {
      await page.setViewportSize({ width, height: 800 });
      // Just assert it didn't crash
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(bodyWidth).toBeLessThanOrEqual(width);
    }
  });
});
