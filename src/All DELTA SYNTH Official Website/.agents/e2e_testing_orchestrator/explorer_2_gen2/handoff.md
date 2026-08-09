# Handoff Report: E2E Test Strategy Refinement

## Observation
- The test files (`tier1_features.spec.js` and `tier2_boundaries.spec.js`) currently contain exactly 5 tests each (1 per feature), failing the coverage requirement of "≥5 tests per feature" per tier (requiring 25 tests per tier).
- Tests like `Page Navigation` fetch elements (`page.locator('header nav a').all()`) and loop through them, but pass silently if `links.length === 0`.
- Tests are tightly coupled to implementation specifics, using hardcoded DOM locators (e.g., `header nav a`, `.hamburger-menu`) and specific asset URLs (e.g., `/css/main.css`), violating the opaque-box testing philosophy.

## Logic Chain
- **Completeness**: To meet the threshold (5 features * 5 tests = 25 tests per tier), the strategy must be expanded. Each feature requires 5 distinct sanity/normal scenarios for Tier 1 and 5 boundary/edge-case scenarios for Tier 2.
- **Robustness**: Tests iterating over elements must explicitly verify element existence (e.g., `expect(links.length).toBeGreaterThan(0)`) to prevent false positives when a page is blank or elements are missing.
- **Opaque-box**: Tests must decouple from specific implementation details. We must replace CSS locators with generic semantic locators (`getByRole('link')`, `getByRole('navigation')`) and replace hardcoded file paths with dynamic network resource interceptions (`request.resourceType() === 'stylesheet'`).

## Caveats
- Since this is an opaque-box test, we cannot know the exact number of links, images, or stylesheets. Tests will assert that *at least one* such element exists, which assumes a minimal viable web page structure. If the design intentionally omits images, the image test may fail.

## Conclusion
The testing suite must be expanded to 50 test cases (25 for Tier 1, 25 for Tier 2). All selectors must be refactored to use semantic HTML roles, and explicit `toBeGreaterThan(0)` assertions must be added to prevent silent passes.

### Recommended Test Case Plan

**Tier 1: Features (Sanity/Normal) - 25 Tests**
*Feature 1: Local Dev Server*
1. Root (`/`) responds with HTTP 200.
2. Root HTML contains a valid `<!DOCTYPE html>`.
3. Root HTML contains a non-empty `<title>`.
4. Response headers include `Content-Type: text/html`.
5. Server responds within an acceptable latency (<500ms).

*Feature 2: Page Navigation*
1. Explicitly assert at least one navigation element (`role="navigation"`) exists.
2. Find all links (`getByRole('link')`), assert `length > 0`, and verify none return 404.
3. Validate Back/Forward browser history works after clicking an internal link.
4. Ensure internal links point to valid relative paths, not empty fragments.
5. Verify clicking a "home" semantic element navigates to the root URL.

*Feature 3: Responsive Layout*
1. Layout renders correctly on Desktop (1920x1080) with no horizontal scroll (`scrollWidth <= viewport`).
2. Layout renders correctly on Tablet (768x1024) with no horizontal scroll.
3. Layout renders correctly on Mobile (375x667) with no horizontal scroll.
4. Page includes `<meta name="viewport">` tag.
5. Key interactive elements (buttons/links) have a computed height ≥ 44px (touch target size) on mobile.

*Feature 4: Asset/Resource Load*
1. Dynamically intercept `stylesheet` requests; assert `length > 0` and all return 200 OK.
2. Dynamically intercept `script` requests; assert all return 200 OK (if any exist).
3. Dynamically intercept `image` requests; assert all return 200 OK (if any exist).
4. Verify the application requests a favicon (intercepting standard favicon requests).
5. Ensure no assets take excessively long to load (>2 seconds).

*Feature 5: Clean Codebase Struct*
1. Root HTML uses minimal or no inline `<style>` blocks.
2. Root HTML has standard document structure (`<html>`, `<head>`, `<body>`).
3. Root HTML does not contain placeholder strings like "Lorem Ipsum".
4. Page utilizes core semantic landmarks (`getByRole('banner')`, `getByRole('main')`, `getByRole('contentinfo')`).
5. Intercepted asset requests reflect a structured directory layout (paths contain `/css/`, `/js/`, `/assets/`, or `/images/` instead of flat root paths).

**Tier 2: Boundaries (Edge Cases) - 25 Tests**
*Feature 1: Local Dev Server*
1. Unknown routes (e.g., `/non-existent-page`) correctly return 404.
2. Root endpoint handles trailing slashes (`/?` or `/index.html`) gracefully.
3. Very long query strings do not crash the server.
4. Server does not expose sensitive files (e.g., requests to `/.env` or `/package.json` fail).
5. Cache-Control headers prevent aggressive caching during development.

*Feature 2: Page Navigation*
1. Rapid consecutive clicks on the same link do not throw unhandled exceptions.
2. External links (if any) have `target="_blank"` and `rel="noopener"`.
3. Page content loads gracefully without relying solely on JavaScript navigation (JS disabled fallback).
4. Navigating with extremely long URL hashes does not break the layout.
5. Self-referencing links (clicking a link to the current page) do not cause a crash or infinite loop.

*Feature 3: Responsive Layout*
1. Layout survives extreme narrow viewports (e.g., 320x480) without breaking.
2. Layout survives extreme ultra-wide viewports (e.g., 3840x2160).
3. Rapid resizing between Mobile and Desktop does not cause text overflow or layout overlap.
4. Simulating device orientation change (portrait to landscape) maintains proportional rendering.
5. System text-scaling preferences (if emulated) do not overlap or break containers.

*Feature 4: Asset/Resource Load*
1. Page renders correctly even when images fail to load (simulated abort via Playwright routing).
2. Page renders correctly even when external fonts/scripts are blocked.
3. Total HTML document size is below a reasonable threshold (e.g., <500KB) for fast parsing.
4. Network throttling (Slow 3G) does not result in timeout errors.
5. No mixed-content requests occur (if served over HTTPS, all assets must be HTTPS).

*Feature 5: Clean Codebase Struct*
1. Console has exactly 0 `console.error` logs on initial load.
2. Console has exactly 0 `console.warn` logs on initial load.
3. Maximum DOM depth is evaluated and kept under 32 levels to prevent nested div-soup.
4. Missing required assets (e.g., a missing image) log a 404, but don't cause an unhandled 500 server crash.
5. Page HTML avoids excessive use of non-semantic tags (ratio of `<div>`/`<span>` to semantic tags is within a reasonable heuristic).

## Verification Method
- Implement the 50 tests into the `tier1_features.spec.js` and `tier2_boundaries.spec.js` files.
- Execute the tests using `npx playwright test e2e_tests/tests/`.
- Verify the total number of executed tests is exactly 50.
- Check that tests fail when target elements do not exist (e.g., if there are no links, the `length > 0` assertion should explicitly fail).
- Verify no DOM implementation specifics (`.class` or `#id`) or static paths (`/css/main.css`) are present in the test definitions.
