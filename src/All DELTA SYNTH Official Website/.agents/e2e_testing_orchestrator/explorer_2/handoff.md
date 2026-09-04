# Handoff Report

## 1. Observation
- `TEST_INFRA.md` specifies a requirement-driven, opaque-box E2E testing philosophy utilizing Tiers 1-4 (Features, Boundaries, Cross-feature interactions, and Workload scenarios). 
- It suggests using Node.js, `http`, `puppeteer`, or `fetch` with tests split by tier (`tier1_features.js`, etc.).
- `ORIGINAL_REQUEST.md` focuses on UI/UX modernization and responsive layouts, requiring verification that the server runs without errors, responsive layouts work, and the codebase is neat.
- The user explicitly requested an implementation strategy in Node.js focusing on Tiers 1-4, defining test cases, project structure, and tools (e.g., Playwright).

## 2. Logic Chain
- To best handle responsive layout checks (Tier 1 & Tier 4), asset tracking, and modern E2E assertions, **Playwright Test** is superior to writing a custom Node.js runner with raw `puppeteer` or `fetch`. Playwright features native device emulation, auto-waiting, and network interception.
- The original test infrastructure proposed custom test files like `tier1_features.js`. Integrating this into Playwright's ecosystem means mapping these tiers to Playwright test files (`.spec.js`) inside a structured `/e2e_tests/` folder.
- Playwright's `webServer` configuration natively solves the "start a local dev server" requirement from Tier 1, allowing seamless test execution.
- Tier 2 boundaries (edge cases like 404s, rapid clicks, varying screen sizes) and Tier 3 pairwise (navigation + mobile) naturally fit into Playwright's parameterized tests and network interception capabilities.
- Tier 4 workloads (full site tours, resize stress tests) leverage Playwright's multi-page contexts and layout validation.

## 3. Caveats
- No code or tests have been implemented yet, as explicitly restricted.
- "Clean Codebase Struct" (Tier 1) is difficult to test strictly via E2E/black-box tools like Playwright; it is interpreted here as verifying that expected standard asset paths return HTTP 200s.
- Rapid viewport resizing and refresh stress tests (Tier 4) might experience flakiness if there are heavy animations in the new UI/UX. Tests will need robust assertions.

## 4. Conclusion

### Strategy & Tools
**Tools**: Use **Playwright Test** via Node.js. It natively supports web server bootstrapping, robust assertions, network interception, and mobile/desktop viewport emulation. Use `http-server` or Playwright's web server functionality to serve the static files during the run.

### Recommended Project Structure
```text
/e2e_tests/
  playwright.config.js       # Playwright config, device profiles, webServer bootstrap
  /tests/
    tier1_features.spec.js   # Basic sanity and normal conditions
    tier2_boundaries.spec.js # Edge cases, missing assets, 404s
    tier3_cross.spec.js      # Combinations: Navigation while on mobile
    tier4_workload.spec.js   # Realistic workflows, stress tests
  /utils/
    helpers.js               # Shared logic (e.g., wait for animations)
```

### Recommended Test Cases

**Tier 1: Features (Sanity/Normal)**
1. **Local Dev Server**: Assert `index.html` loads successfully with HTTP 200.
2. **Page Navigation**: Click all primary header links and assert URL changes without 404s.
3. **Responsive Layout**: Verify the presence of the mobile hamburger menu at 375px viewport and its absence at 1080px.
4. **Asset Load**: Assert CSS and JS files load with HTTP 200 (using Playwright network monitoring).
5. **Clean Codebase**: Assert standard asset paths (e.g., `/css/main.css`) are accessible, implying a neat structure.

**Tier 2: Boundaries (Edge Cases)**
1. **Dev Server (404)**: Navigate to `/fake-page.html` and assert a 404 status/custom 404 page is returned.
2. **Navigation (Rapid Clicks)**: Rapidly click a navigation link 5 times and ensure the DOM stabilizes without JS console errors.
3. **Responsive (Extremes)**: Render at 320x480 and 4K, asserting no critical elements overflow the viewport width.
4. **Asset Load (Slow Network)**: Throttle network to 3G and assert page still renders core textual content correctly.
5. **Asset Load (Missing Image)**: Intercept and abort a non-critical image request; assert the page doesn't crash.

**Tier 3: Cross-feature**
1. **Navigation + Responsive**: Navigate to a sub-page, resize from desktop to mobile, and assert the navigation state adjusts cleanly.
2. **Deep Linking + Dev Server**: Direct navigation to an internal page bypassing the home page.
3. **Assets + Responsive**: Verify different images or CSS rules apply specifically when loaded directly into a mobile context vs desktop.

**Tier 4: Workload & Scenarios**
1. **Full Mobile Tour**: Emulate iPhone, load site, open menu, visit 3 main pages, and assert no console errors occur.
2. **Full Desktop Tour**: Sequential traversal of all pages in a single context at 1920x1080.
3. **Refresh Stress**: Reload the page 10 times consecutively and check if the DOM loads correctly each time.
4. **Parallel Deep Links**: Open 5 contexts simultaneously to different routes to ensure the dev server handles concurrent requests.
5. **Fast Resize**: Continuously adjust viewport width from 1000px down to 400px to detect CSS transition glitches.

## 5. Verification Method
- **Method**: The implementer will install Playwright (`npm init playwright@latest`) inside `/e2e_tests/` or the root directory.
- **Validation**: Execute `npx playwright test`. All tests mapped from Tiers 1-4 should execute, and the `playwright-report` will act as proof of passing E2E tests against the redesigned site.
