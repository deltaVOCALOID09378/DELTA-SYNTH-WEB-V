# Handoff Report: Refined E2E Test Strategy & Plan

## Observation
Reviewing the current E2E test suite in `e2e_tests/tests/`, the test files `tier1_features.spec.js` and `tier2_boundaries.spec.js` contain only 1 test per feature (5 tests total per file). This directly violates the `TEST_INFRA.md` requirement of "≥5 per feature" (25 tests per tier). Additionally, the tests use conditional logic (e.g., `if (links.length > 0)`) which allows them to pass silently if elements are missing, violating robustness constraints. Finally, the tests are coupled to specific implementations (e.g., `page.locator('header nav a')`, `request.get('/css/main.css')`), violating the opaque-box philosophy.

## Logic Chain
1. **Completeness**: To meet the 5-test-per-feature threshold, we must expand Tier 1 and Tier 2 to 25 tests each. Each feature (Local Dev Server, Page Navigation, Responsive Layout, Asset/Resource Load, Clean Codebase Struct) needs 5 dedicated test scenarios under normal (Tier 1) and boundary (Tier 2) conditions.
2. **Robustness**: Conditional skipping must be eliminated. If a test expects navigation links to exist, it must explicitly assert `expect(links.length).toBeGreaterThan(0)`. If the site is blank, the test should legitimately fail instead of passing.
3. **Opaque-box**: Hardcoded implementation details must be replaced. Instead of querying `header nav a`, tests should use semantic locators like `page.getByRole('link')`. Instead of fetching `/css/main.css`, tests should dynamically listen to network traffic (`page.on('response')`) to verify that all requested stylesheets or scripts load with HTTP 200, regardless of their file names or directory locations.

## Conclusion
The test strategy requires a comprehensive expansion and refactoring of `tier1_features.spec.js` and `tier2_boundaries.spec.js`. 
- **Tooling**: Continue using Playwright (`@playwright/test`) as it supports semantic locators, network interception, and viewport manipulation seamlessly.
- **Structure**: Maintain the current directory structure (`e2e_tests/tests/`), but heavily expand the content of the Tier 1 and Tier 2 files to match the 25-test requirement.

### Recommended Test Case Plan

**Tier 1: Features (Normal Conditions) - 25 Tests**
*F1: Local Dev Server*
1. Root (`/`) returns HTTP 200.
2. Root response has `text/html` content type.
3. Root HTML contains a valid `<title>` tag.
4. Root HTML contains a `<meta name="viewport">` tag.
5. Server response time is within acceptable limits (< 2000ms).

*F2: Page Navigation*
6. Page contains at least one navigational link: `expect(links.length).toBeGreaterThan(0)`.
7. Clicking a link successfully navigates without throwing page errors (HTTP 200).
8. Navigation links have valid, non-empty `href` attributes.
9. Using the browser back button restores the previous page successfully.
10. All internal links on the home page resolve to HTTP 200.

*F3: Responsive Layout*
11. Desktop viewport (1920x1080) renders without horizontal scroll (`scrollWidth <= innerWidth`).
12. Tablet viewport (768x1024) renders without horizontal scroll.
13. Mobile viewport (375x667) renders without horizontal scroll.
14. Mobile viewport prevents horizontal overflow (CSS `overflow-x: hidden` behavior check).
15. Key semantic landmarks (e.g., `<main>`) are visible across all standard viewports.

*F4: Asset/Resource Load*
16. Dynamically intercept and assert that at least one stylesheet is requested and loaded with HTTP 200.
17. All requested stylesheets return HTTP 200.
18. All requested scripts return HTTP 200.
19. All requested images return HTTP 200.
20. No network requests result in HTTP 500 server errors.

*F5: Clean Codebase Struct (Opaque-box)*
21. HTML contains exactly one semantic `<main>` element.
22. HTML contains exactly one semantic `<h1>` element.
23. HTML has a declared `<!DOCTYPE html>`.
24. HTML has a `lang` attribute on the root `<html>` element.
25. No duplicate ID attributes exist in the parsed DOM.

**Tier 2: Boundaries (Edge Cases) - 25 Tests**
*F1: Local Dev Server*
26. Requesting `/non-existent-page` returns HTTP 404.
27. Requesting an extremely long path returns a handled status (e.g., 404, 400, 414).
28. Requesting malformed URL paths handles gracefully without crashing.
29. Sending a POST request to root handles gracefully.
30. Sending a PUT request to root handles gracefully.

*F2: Page Navigation*
31. Rapid, sequential clicks on a link do not crash the browser.
32. Navigating with unknown query parameters (`/?unknown=true`) loads normally.
33. Navigating with hash fragments (`/#unknown`) loads without errors.
34. Attempting to navigate offline fails gracefully (Playwright context offline).
35. Attempting to click an empty `href=""` (if any exist) doesn't cause page crashes.

*F3: Responsive Layout*
36. Ultra-wide viewport (3840x2160) does not break structural layout.
37. Extremely narrow viewport (200x500) behaves predictably (allows scroll if necessary, no crashes).
38. Rapid viewport resizing does not throw JS layout errors.
39. High DPI (deviceScaleFactor: 2) simulation loads successfully.
40. Landscape mobile orientation (667x375) renders without horizontal scroll.

*F4: Asset/Resource Load*
41. Page loads successfully even if all images are blocked (aborted via route).
42. Page loads successfully even if all CSS is blocked.
43. Page loads successfully even if all JS is blocked.
44. Simulating a slow network connection (e.g., slow 3G) completes load within timeout.
45. Large assets (if any) do not exceed reasonable payload sizes.

*F5: Clean Codebase Struct (Opaque-box)*
46. DOM depth does not exceed an extreme threshold (e.g., > 40 levels).
47. Images (if present) include `alt` attributes for accessibility.
48. Page loads with zero `console.error` messages.
49. Page loads with minimal/zero `console.warn` messages.
50. Buttons and links have accessible names (ARIA).

## Caveats
- Without knowing the exact content of the site, tests asserting the presence of images or scripts might fail if the site genuinely has none. To mitigate this, tests checking for generic assets (like CSS) should ensure at least one exists (as a modern site should have CSS), but tests for images/JS might only assert that *if* they are requested, they load successfully.
- Tests that require interacting with links assume that the redesign includes semantic links (`role="link"` or `<a>`). If the design uses `<div>` with `onClick`, opaque-box testing will fail, which correctly flags an accessibility/semantic issue.

## Verification Method
To verify this plan, the implementer will write the tests in `e2e_tests/tests/tier1_features.spec.js` and `e2e_tests/tests/tier2_boundaries.spec.js`. Execute them using `npx playwright test`. The test runner must output exactly 25 passed/failed tests per file. Inspections of the code will confirm no hardcoded implementation selectors (e.g., `/css/main.css`) are used and that assertions like `expect(links.length).toBeGreaterThan(0)` are present.
