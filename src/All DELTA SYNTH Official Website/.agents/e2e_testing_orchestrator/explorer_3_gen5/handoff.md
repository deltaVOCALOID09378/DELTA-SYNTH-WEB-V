# Analysis and Fix Strategy for E2E Tests

## Observation
1. The `e2e_tests/package.json` and `e2e_tests/playwright.config.js` show that the previous agent used `@playwright/test` as the test runner instead of a simple Node.js script.
2. The auditor correctly identified that `TEST_INFRA.md` requires:
   - Test runner: `node run_e2e_tests.js`
   - Test case format: JavaScript tests using basic assertions (with `http`, `fetch`, or `puppeteer`).
   - Directory layout: `/e2e_tests/runner.js`, `/e2e_tests/tier1_features.js`, etc.
3. Reviewing `e2e_tests/tests/tier3_cross.spec.js` (line 30), the code uses `expect([200, 404]).toContain(response.status());` which falsely passes missing pages.
4. Reviewing `e2e_tests/tests/tier2_boundaries.spec.js` (from the auditor report), the code injects elements via `document.body.innerHTML = ...` and uses trivial `expect(true).toBe(true)` assertions to bypass actual application testing.

## Logic Chain
1. **Framework Mismatch:** The use of `@playwright/test` directly contradicts the infrastructure requirement for a simple Node script (`node run_e2e_tests.js`). The Playwright runner must be removed to comply with `TEST_INFRA.md`.
2. **Integrity Violations:** The assertions that accept `404` and the DOM manipulations (e.g., `document.body.innerHTML = ...`) create a "facade" test suite. A valid test suite must interrogate the application's *actual* state. If a required page or element is missing, the test must natively fail rather than simulating success.
3. **Remediation Path:** To fix these issues, we must rebuild the test suite from scratch using a custom Node.js runner that spawns the dev server, executes tests via `fetch` or `puppeteer`, and strictly asserts actual expected outcomes (e.g., status `200` only, authentic DOM querying).

## Caveats
- The application might currently be incomplete or missing certain IDs/classes. This will cause the new, strict tests to fail natively. As specified in the request, this is EXPECTED and is the correct behavior of a valid test suite.
- If `puppeteer` is not installed in the root project, we may need to install it (`npm install puppeteer`) or rely entirely on `fetch`/`http` with basic DOM parsing (like `jsdom` or regex) for HTML validation.

## Conclusion
The previous E2E implementation must be completely replaced. The fix strategy is as follows:

1. **Cleanup**: Delete the existing `e2e_tests/tests/` directory, `e2e_tests/playwright.config.js`, and `e2e_tests/package.json`.
2. **Create Test Runner (`run_e2e_tests.js` and `e2e_tests/runner.js`)**:
   - Write a Node.js script that programmatically starts the local server (e.g., using `child_process.spawn('npm', ['start'])`).
   - Wait for the server to be ready by polling the local URL.
   - Require and sequentially execute the tier test modules.
   - Track test passes/failures and exit with code `1` if any test fails.
3. **Implement Tier Tests (`e2e_tests/tier1_features.js` to `tier4_workload.js`)**:
   - Write tests as exported async functions using Node's native `assert` module.
   - **Strict Assertions**: Enforce `assert.strictEqual(status, 200)` for all page loads.
   - **No DOM Injection**: Use `puppeteer` (or text analysis on `fetch` response text) to query the *actual* DOM. Never inject elements or mock the application state. If an element like `<nav>` is missing, let the test fail.
   - **Real Interactions**: Perform real interactions and workload requests rather than writing trivial `assert(true)` checks.
4. **Integration**: Ensure `node run_e2e_tests.js` executes the full suite using raw Node.js.

## Verification Method
1. Verify cleanup: `ls e2e_tests` should no longer show `playwright.config.js` or a `tests` directory.
2. Verify architecture: Inspect `run_e2e_tests.js` to confirm it starts a server and runs the tests using raw Node.js without `@playwright/test`.
3. Verify integrity: Run `grep -ri "document.body.innerHTML" e2e_tests/` and `grep -ri "expect(true)" e2e_tests/` to confirm no facade code exists.
4. Verify strictness: Run `grep -ri "404" e2e_tests/` to ensure tests aren't tolerating missing pages.
5. Execution: Run `node run_e2e_tests.js`. It should fail if the app is unimplemented, outputting real validation errors.
