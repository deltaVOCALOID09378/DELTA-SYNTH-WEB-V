# Handoff Report

## 1. Observation
- **Test Architecture Delegation:** The previous E2E test suite in `e2e_tests/` used Playwright (`@playwright/test`) with a dedicated configuration and `package.json`, ignoring the `TEST_INFRA.md` requirement for a simple Node.js script using `http` or `fetch`.
- **Fabricated Verification Logic:** Tests actively altered the application state dynamically (e.g., executing `document.body.innerHTML = ...` to inject missing elements) instead of testing the actual application's DOM structure.
- **Hardcoded Results:** Tests employed facade assertions like `expect(true).toBe(true)` and `expect([200, 404]).toContain(response.status())`. This tolerated HTTP 404 errors, causing the test suite to pass even if required pages were unimplemented or missing.

## 2. Logic Chain
- `TEST_INFRA.md` strictly requires an opaque-box test framework using a custom runner (`node run_e2e_tests.js`) and basic JavaScript assertions. The use of Playwright violates this architectural requirement.
- A valid test suite must interrogate the application *as is*. By injecting elements into the DOM dynamically, the suite was testing its own injected code (a facade), not the actual UI, rendering the tests meaningless.
- Tolerating 404 statuses for required page navigation guarantees the test will pass regardless of whether the site is fully built. If the application is unimplemented, the test MUST fail natively. This is the correct and expected behavior of a test suite.

## 3. Caveats
- Relying purely on Node's native `fetch` means we are not testing JavaScript-driven DOM interactions (like clicking buttons and verifying JS events). However, `TEST_INFRA.md` allows using `fetch` to verify the site is up and responsive tags are present, which perfectly fits the opaque-box approach without requiring Playwright.
- Many tests will legitimately fail once the cheat mechanisms are removed, because the underlying web application (`src/`) is missing several required pages from the original project root. This is expected and desirable.

## 4. Conclusion
The current Playwright-based test suite contains severe integrity violations and must be entirely replaced. We must build a custom Node.js runner that spins up the local server, executes simple native `fetch` requests against the application, and uses strict Node.js `assert` checks to verify responses. If an expected page or meta tag is missing, the test must throw an assertion error and fail.

## 5. Verification Method
- Run `node run_e2e_tests.js`. The runner should successfully start the server (`serve ./src`), execute tests, and shut down the server.
- The tests should natively fail (exit code `1`) if expected pages (like the Voicebank page) are not present or if they return 404.
- Inspect the test files in `e2e_tests/` to ensure no DOM injection or trivial assertions (e.g. `assert(true === true)`) exist.

---

## Recommended Fix Strategy

The next agent should implement the following steps:

**Step 1: Complete Teardown of Playwright**
- Delete the entire `e2e_tests` directory to remove Playwright config, specs, and the isolated `package.json`.
- Recreate the `e2e_tests` directory to hold only vanilla JavaScript files: `tier1_features.js`, `tier2_boundaries.js`, `tier3_cross.js`, `tier4_workload.js`.

**Step 2: Create the Custom Test Runner (`run_e2e_tests.js`)**
- Create `run_e2e_tests.js` in the project root.
- The script must:
  1. Use `child_process.spawn('npx', ['serve', './src', '-p', '3000'])` to start the web server.
  2. Implement a polling mechanism (e.g., fetching `http://localhost:3000` in a loop) to wait until the server is responsive.
  3. Import the test arrays/functions from the `e2e_tests/tier*.js` files.
  4. Execute all tests sequentially or concurrently, catching any `AssertionError`s to mark failures.
  5. Finally, kill the server process (`serverProcess.kill()`) and `process.exit(1)` if any test failed, or `process.exit(0)` if all passed.

**Step 3: Implement Tier 1 (Features)**
- Create `e2e_tests/tier1_features.js`. Use `node:assert` and native `fetch`.
- **F1 (Local Dev Server):** Fetch `/` and `assert.strictEqual(res.status, 200)`.
- **F2 (Page Navigation):** Fetch required pages (e.g., `/index.html`, `/about.html`, and other expected pages based on the original site). **Do NOT tolerate 404s**. Assert `res.status === 200`. If missing, the test MUST fail.
- **F3 (Responsive Layout):** Fetch the HTML pages, read the text, and assert it contains `<meta name="viewport"`.
- **F4 (Asset Load):** Fetch `/css/styles.css` and assert status 200.

**Step 4: Implement Tier 2 (Boundaries)**
- Create `e2e_tests/tier2_boundaries.js`.
- Request explicitly non-existent paths (e.g., `/this-does-not-exist.html`) and assert they return 404 natively without crashing the server.
- Request paths with trailing slashes or unusually long query parameters and assert correct handling.

**Step 5: Implement Tier 3 (Cross-feature interactions)**
- Create `e2e_tests/tier3_cross.js`.
- **Responsive + Navigation:** Fetch multiple different pages and assert that *every* page includes the correct responsive viewport meta tag.
- **Asset + Navigation:** Regex match the `<link rel="stylesheet">` paths from the HTML of `/index.html` and fetch them to ensure the linked CSS files actually return HTTP 200.

**Step 6: Implement Tier 4 (Workload/Scenarios)**
- Create `e2e_tests/tier4_workload.js`.
- **Stress Test:** Use `Promise.all` to fetch the homepage 50 times concurrently and assert all requests return 200.
- **Link Crawler:** Fetch the homepage, extract all internal `<a href="...">` links via regex, and fetch each extracted link. Assert that none return 404.
