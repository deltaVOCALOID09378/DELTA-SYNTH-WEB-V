# E2E Test Strategy Handoff Report

## Observation
- **Original Request**: The user requested UI/UX modernization and reorganization while starting a local dev server and making sure the website runs without syntax/runtime errors and is fully responsive.
- **Current Tests (`e2e_tests/tests/`)**: 
  - `tier1_features.spec.js` contains 5 tests total (1 per feature).
  - `tier2_boundaries.spec.js` contains 5 tests total.
  - Tests conditionally skip logic if elements aren't found (e.g., `if (links.length > 0)` or `if (await menu.count() > 0)`), passing silently even when an application might be completely broken or blank.
  - Tests explicitly query hardcoded implementation details like `/css/main.css` and `header nav a`.
- **Reviewer Feedback**: 
  1. Completeness: Tiers 1 and 2 severely failed the "≥5 per feature" threshold. Need 25 tests per tier.
  2. Robustness: Tests pass silently when targets don't exist. Require explicit assertions (e.g., `expect(links.length).toBeGreaterThan(0)`).
  3. Opaque-box: Tests tightly coupled to implementation. Must use generic semantic locators and verify asset loading dynamically via network requests.

## Logic Chain
1. To pass the completeness check, we must map out exactly 5 distinct tests for each of the 5 features in Tier 1, and 5 distinct tests for each in Tier 2. Total = 50 tests.
2. To satisfy robustness, we must remove all conditional blocks (`if (links.length > 0)`) in tests and replace them with hard assertions (`expect(links.length).toBeGreaterThan(0)`). If a generic semantic element (like a link) doesn't exist, the test *should* fail, as a navigation feature cannot be verified without links.
3. To meet the opaque-box requirement, tests cannot assume the DOM uses specific class names (`.hamburger-menu`) or file paths (`/css/main.css`). Instead, we rely on Playwright's semantic locators (e.g., `page.getByRole('link')`, `page.getByRole('navigation')`) and network interceptors (e.g., checking all requests where `resourceType() === 'stylesheet'`).

## Caveats
- Because tests are opaque-box, they must be resilient to empty states if testing a truly blank skeleton, but for a functional prototype, we must assert the presence of structural elements (links, stylesheets, semantic tags). If the implementation lacks any generic links, the tests will legitimately fail until the implementer adds them.

## Conclusion
A refined test strategy must be implemented using Playwright. The structure will remain similar but expanded to 25+ tests per tier. All element selections must use `getByRole` or generic tag selectors (like `a`, `img`), and lengths must be explicitly asserted (`> 0`). Asset loading must be verified dynamically by sniffing network traffic rather than hardcoding paths.

## Proposed Project Structure
```
/e2e_tests/
  playwright.config.js
  tests/
    tier1_features.spec.js   (25 tests: 5 per feature)
    tier2_boundaries.spec.js (25 tests: 5 per feature)
    tier3_cross.spec.js      (Interactions)
    tier4_workload.spec.js   (Scenarios)
```

## Recommended Test Case Plan

### Tier 1: Features (25 Tests)

**Feature 1: Local Dev Server**
1. Server responds to `/` with HTTP 200.
2. Server response content-type is `text/html`.
3. HTML document starts with a valid `<!DOCTYPE html>`.
4. Response time is within an acceptable latency (< 2000ms).
5. The `window.location.protocol` evaluates to `http:` or `https:`.

**Feature 2: Page Navigation**
1. Page contains at least one navigation link: `expect(await page.getByRole('link').count()).toBeGreaterThan(0)`.
2. Clicking a generic link navigates successfully without returning a 404 status.
3. Back navigation via browser history correctly restores the previous page.
4. All `<a>` tags on the page possess a valid, non-empty `href` attribute.
5. Internal anchor links (if any) do not trigger a full page reload upon click.

**Feature 3: Responsive Layout**
1. Document contains a responsive `<meta name="viewport">` tag.
2. On Mobile (375px), horizontal scroll width does not exceed the viewport width (`scrollWidth <= innerWidth`).
3. On Tablet (768px), horizontal scroll width does not exceed the viewport width.
4. On Desktop (1280px), horizontal scroll width does not exceed the viewport width.
5. The main structural element (e.g., `getByRole('main')`) remains visible across all three viewports.

**Feature 4: Asset/Resource Load**
1. At least one stylesheet is dynamically loaded (intercept `resourceType() === 'stylesheet'` and assert `count > 0`).
2. All dynamically loaded stylesheets return HTTP 200.
3. At least one script or image is loaded, returning HTTP 200.
4. Page triggers exactly 0 uncaught JavaScript console errors on load.
5. No mixed-content requests (HTTP vs HTTPS mismatch) are triggered.

**Feature 5: Clean Codebase Structure**
1. HTML document contains a `<header>` or `<nav>` semantic element.
2. HTML document contains a `<main>` semantic element.
3. HTML document contains exactly one `<h1>` element.
4. All `<img>` elements present on the page contain an `alt` attribute.
5. HTML document contains a `<footer>` semantic element.

---

### Tier 2: Boundaries (25 Tests)

**Feature 1: Local Dev Server**
1. Navigating to a non-existent path (e.g., `/non-existent-12345`) returns HTTP 404.
2. Extremely long URL paths are handled gracefully (404 or 414, no server crash).
3. Requests with unsupported HTTP methods (e.g., POST to `/`) return an appropriate error (404 or 405).
4. Malformed URLs (e.g., `/%%`) are handled without crashing the server.
5. Trailing slash inconsistencies (e.g., `/about/` vs `/about`) resolve without a 500 server error.

**Feature 2: Page Navigation**
1. Rapidly clicking the same link 10 times consecutively produces zero JS errors.
2. Clicking a link while the page is still in a loading state does not trigger an exception.
3. Keyboard navigation (pressing 'Tab') successfully focuses at least one interactive element.
4. URLs containing unexpected query parameters (e.g., `/?foo=bar`) do not break page rendering.
5. Attempting to navigate backward when no history exists does not crash the application.

**Feature 3: Responsive Layout**
1. At extremely narrow widths (320px), the page does not overflow horizontally.
2. At ultra-wide 4K widths (3840px), the layout maintains structural integrity (no horizontal overflow).
3. Rapidly resizing the viewport from 1280px to 375px and back does not trigger JS layout errors.
4. Simulating a dynamic orientation change (landscape to portrait) works smoothly without overflow.
5. With browser zoom set to 200%, the horizontal layout does not break (scrollWidth <= innerWidth * zoom factor).

**Feature 4: Asset/Resource Load**
1. Simulating aborted image requests (Network interception) does not break page rendering or throw uncaught JS errors.
2. Simulating slow 3G network conditions still allows the DOM to fire the `DOMContentLoaded` event.
3. Simulating aborted stylesheet requests does not cause JS execution to crash.
4. The total initial HTML payload size is within an acceptable boundary (e.g., < 2MB).
5. Network requests with extremely long query parameters are handled without freezing the client.

**Feature 5: Clean Codebase Structure**
1. DOM tree depth does not exceed an extreme boundary (e.g., <= 40 levels deep).
2. The page utilizes zero inline style attributes (`$('[style]')` count is 0), proving CSS class separation.
3. Deprecated HTML tags (e.g., `<marquee>`, `<font>`, `<center>`) are strictly absent from the DOM.
4. Page generates zero console warnings (not just errors) during the initial load.
5. Any form input elements (if present) are paired with corresponding labels or ARIA names.

## Verification Method
To independently verify this strategy:
1. Implement the specified tests in `e2e_tests/tests/tier1_features.spec.js` and `e2e_tests/tests/tier2_boundaries.spec.js`.
2. Run `npx playwright test`. 
3. Verify that `expect().toBeGreaterThan(0)` fails correctly if the implementer provides an empty HTML skeleton.
4. Verify that no test uses `.css` hardcoded paths or `nav a` css selectors, ensuring implementation-agnostic behavior.
