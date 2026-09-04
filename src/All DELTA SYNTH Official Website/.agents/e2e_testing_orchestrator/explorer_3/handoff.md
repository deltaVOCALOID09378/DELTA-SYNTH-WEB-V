# E2E Test Strategy Report

## 1. Observation
- `TEST_INFRA.md` specifies an opaque-box, requirement-driven test philosophy using Category-Partition, BVA, Pairwise, and Workload Testing.
- `TEST_INFRA.md` requires Node.js scripts using basic tools like `http` and `puppeteer` (or `fetch`), and dictates a 4-tier test architecture covering Local Dev Server, Page Navigation, Responsive Layout, Asset/Resource Load, and Clean Codebase Struct. Coverage thresholds are explicitly defined (e.g., ≥5 per feature for Tiers 1 & 2).
- `ORIGINAL_REQUEST.md` indicates a UI/UX modernization project focusing on responsiveness across devices, clean code structure, and original logic. No specific testing framework was forced besides basic Node.js capabilities.

## 2. Logic Chain
- Given the requirement for a "simple Node.js script" but also the need for comprehensive UI interactions (responsive layouts, workload testing, scenarios), **Playwright** is highly recommended over bare `puppeteer` or `fetch` because it natively supports modern cross-browser interaction, viewport emulation, and network interception, making it easier to fulfill Tiers 1-4. 
- The project structure should mirror the explicit directory layout requested in `TEST_INFRA.md`.
- Test cases must satisfy the specific feature combinations and thresholds: 5+ tests per feature for T1/T2, pairwise interactions for T3, and 5 specific scenarios for T4.

## 3. Caveats
- `TEST_INFRA.md` suggests using basic `http` and `puppeteer`/`fetch` inside a simple script. Proposing Playwright adds a dependency, but vastly simplifies the required scenario tests (Tier 4). We will provide a strategy that fits a simple Node test runner but leverages Playwright for the heavy lifting of browser manipulation.
- Since the exact pages and assets aren't built yet, the test cases are abstract and target general structural features (e.g., `/`, `/about`, image tags, meta viewports).

## 4. Conclusion

### Recommended Tools
- **Runner**: Node.js built-in `node:test` (or a simple custom script `runner.js` as specified).
- **Automation**: `playwright` (or `puppeteer`) for browser control, viewport sizing, and network response validation.

### Recommended Project Structure
```text
/e2e_tests/
  package.json (if managing Playwright/Puppeteer independently)
  runner.js (custom script to orchestrate the test files)
  tier1_features.js
  tier2_boundaries.js
  tier3_cross.js
  tier4_workload.js
```

### Recommended Test Cases (Tiers 1-4)

**Tier 1: Feature Functionality (≥ 5 per feature)**
- *Local Dev Server*: Verify 200 OK on `/`, 404 on `/nonexistent`, Server header presence, valid HTML content-type, graceful shutdown.
- *Page Navigation*: Click internal links successfully, no broken links (404s), back button works, correct document title per page, URL path updates.
- *Responsive Layout*: Meta viewport tag exists, CSS media queries are linked, verify base font size, verify flex/grid container presence, basic layout block rendering.
- *Asset Load*: All `<img>` src return 200, `<link rel="stylesheet">` load successfully, `<script>` tags load without errors, favicon loads, no console errors.
- *Clean Codebase Struct*: HTML is well-formed, absence of inline CSS (`style` attributes), semantic tags (`<header>`, `<main>`, `<footer>`), valid DOCTYPE, consistent indentation/formatting.

**Tier 2: Boundary Value Analysis (≥ 5 per feature)**
- *Local Dev Server*: Very long URL paths, malformed URLs, special characters in URL, concurrent rapid requests, large payloads (if forms exist).
- *Page Navigation*: Rapid clicking, clicking links before page fully loads, deep linking directly to subpages, double-clicks on links, empty anchor tags (`href=""`).
- *Responsive Layout*: Viewport width 320px (min mobile), Viewport width 4000px (ultra-wide), extreme height limits, zooming out to 50%, zooming in to 200%.
- *Asset Load*: Assets missing/failing gracefully, loading assets with delayed network (throttling), large asset handling (timeout limits), loading without JS execution, caching headers validation.
- *Clean Codebase*: Deeply nested HTML tags limit, excessively long class names, large inline text blocks, extremely small minified files, missing optional structural files (e.g., missing favicon).

**Tier 3: Pairwise Interactions (Cross-feature)**
- *Nav + Responsive*: Navigate pages while constrained to a mobile viewport (375px).
- *Nav + Assets*: Load heavy assets while rapidly navigating away and back.
- *Responsive + Assets*: Ensure different size images load correctly based on viewport changes (e.g., using `srcset` or CSS background).
- *Dev Server + Nav*: Restart dev server during active navigation and ensure the UI handles the disconnect.

**Tier 4: Realistic Scenarios / Workload Testing**
1. *Mobile Full Site Tour*: Start at `/`, resize to 375x667, navigate through all top-level menus, verify layouts do not overflow horizontally.
2. *Desktop Full Site Tour*: Start at `/`, resize to 1920x1080, interact with hover states, verify multi-column layouts hold up.
3. *Refresh Stress Test*: Refresh the main page 10+ times within a second to verify server doesn't crash and assets remain accessible.
4. *Deep Linking*: Open a new browser context directly pointing to a sub-page (e.g., `/features`), verifying CSS and assets load without needing the root `/` first.
5. *Fast Viewport Resizing*: Resize window continuously from 1920px down to 320px and back over 5 seconds to catch layout thrashing or JS resize event errors.

## 5. Verification Method
- **Implementation**: The E2E implementer will create these files under `/e2e_tests/` and write assertions.
- **Run**: Execute `node e2e_tests/runner.js`.
- **Validation**: Ensure the runner output lists passes/fails corresponding to the 4 tiers, verifying the local server boots, endpoints are hit, and Playwright successfully emulates the viewports.
