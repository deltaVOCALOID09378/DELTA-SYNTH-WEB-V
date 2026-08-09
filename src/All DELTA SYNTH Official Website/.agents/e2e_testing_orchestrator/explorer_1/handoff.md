# E2E Test Strategy Report

## 1. Observation
- **TEST_INFRA.md** defines an E2E test philosophy that is opaque-box and requirement-driven.
- It specifies 5 main features to test: Local Dev Server, Page Navigation, Responsive Layout, Asset/Resource Load, and Clean Codebase Structure.
- The test architecture requires a simple Node.js script (using `http`, `fetch`, and `puppeteer`) and an explicit directory layout: `/e2e_tests/` with `runner.js` and separate files for Tiers 1 to 4.
- **ORIGINAL_REQUEST.md** confirms acceptance criteria: no syntax/runtime errors, fully responsive design, well-organized codebase, and a running local dev server.

## 2. Logic Chain
Based on the observations, the testing strategy must implement Tiers 1-4 while strictly following the architectural constraints. 
- **Tools**: `puppeteer` is ideal for evaluating responsive layouts and rendering, as it allows simulating different viewports (mobile, tablet, desktop). `http`/`fetch` is suitable for testing the server status, 404 handling, and asset loads. Node's built-in `assert` should be used for simple validations to avoid heavy framework dependencies, aligning with the "simple Node.js script" requirement.
- **Project Structure**: We will adopt the `/e2e_tests/` layout prescribed in `TEST_INFRA.md`, ensuring tests are categorized by tiers.
- **Test Cases**: To meet coverage thresholds (≥5 for Tier 1, 2, and 4; pairwise for Tier 3), we need specific actionable test cases mapped to the identified features.

## 3. Caveats
- The exact pages, routes, and assets of the new UI/UX design are unknown at this stage. Test cases use placeholder concepts (e.g., "Homepage", "Secondary Page") that must be updated with actual routes during implementation.
- Verifying "Clean Codebase Structure" (Feature 5) automatically in an E2E test is unconventional; we will rely on static file existence checks and directory listing rather than runtime application behavior.

## 4. Conclusion
We recommend the following E2E Testing Strategy for implementation:

### Tools to Use
- **Runner**: Node.js executable running a custom test orchestrator script (`node e2e_tests/runner.js`).
- **Browser Automation**: `puppeteer` to verify rendering, responsive viewport meta tags, and visual layout.
- **Network Validation**: Node.js native `fetch` or `http` to assert server uptime, asset resolution, and HTTP status codes.
- **Assertions**: Node.js built-in `assert` module for simplicity.

### Project Structure
```text
/e2e_tests/
  runner.js              # Orchestrates server startup, runs tier scripts, and reports results
  tier1_features.js      # ≥5 basic functional tests per feature
  tier2_boundaries.js    # ≥5 edge-case and boundary tests per feature
  tier3_cross.js         # Pairwise integration tests (e.g., resizing while navigating)
  tier4_workload.js      # Real-world user flows and stress tests
```

### Recommended Test Cases

**Tier 1: Feature Tests (Basic Functionality)**
- *F1 (Local Server)*: Start server, fetch root URL, expect HTTP 200.
- *F2 (Navigation)*: Use Puppeteer to click from Homepage to a Secondary Page and verify URL change.
- *F3 (Responsive)*: Parse HTML for `<meta name="viewport" content="width=device-width, initial-scale=1">`.
- *F4 (Assets)*: Fetch CSS and main JS files; expect HTTP 200 and valid content types.
- *F5 (Codebase)*: Use `fs` to check for presence of structured directories (e.g., `src/`, `assets/`, `styles/`).

**Tier 2: Boundary & Edge Case Tests**
- *F1/F2 (Errors)*: Fetch a non-existent URL (e.g., `/does-not-exist`); expect HTTP 404.
- *F3 (Viewport Limits)*: Set Puppeteer viewport to 320x480 (mobile) and verify no horizontal scrollbar appears. Set to 1920x1080 and verify main container max-width.
- *F4 (Broken Assets)*: Inject an invalid image source and verify the page doesn't crash.
- *F5 (File Limits)*: Assert that no individual HTML/CSS file exceeds a reasonable size threshold (e.g., 500KB) to enforce cleanliness.

**Tier 3: Cross & Pairwise Tests**
- *Navigation + Responsive*: Start on mobile viewport, navigate to a new page, ensure the mobile menu (hamburger) state resets and functions on the new page.
- *Assets + Responsive*: Check that different background images or CSS rules load properly across desktop vs. mobile views.
- *Server + Assets*: Rapidly toggle between pages and ensure no broken pipe or 500 errors occur while loading assets.

**Tier 4: Workload & Scenarios (From TEST_INFRA.md)**
- *Scenario 1 (Mobile Tour)*: Puppeteer opens at 375x812, visits index, clicks 3 links, verifies content, and captures a screenshot.
- *Scenario 2 (Desktop Tour)*: Puppeteer opens at 1440x900, completes a full site navigation loop.
- *Scenario 3 (Refresh Stress)*: Programmatically refresh the homepage 50 times in rapid succession, asserting 100% 200 OK responses.
- *Scenario 4 (Deep Linking)*: Direct HTTP/Puppeteer navigation to all known sub-pages without going through the homepage.
- *Scenario 5 (Viewport Resizing)*: Rapidly resize the browser window continuously while the page is loading and verifying layout stability.

## 5. Verification Method
To verify this strategy:
1. Create the recommended `/e2e_tests/` directory structure.
2. Draft a stub `runner.js` script to execute the tier files.
3. Once tests are implemented by the development agent, run `node e2e_tests/runner.js`. The output should successfully validate the 4-tier test plan against the redesigned frontend.
