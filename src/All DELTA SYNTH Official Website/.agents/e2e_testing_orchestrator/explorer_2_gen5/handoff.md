# E2E Test Strategy Handoff Report

## 1. Observation
The previous test implementation failed the Forensic Audit due to three major integrity violations:
- **Test Architecture Delegation & Facade**: Instead of using a simple Node.js script with `puppeteer` and running via `node run_e2e_tests.js` as strictly required by `TEST_INFRA.md`, the agent used `@playwright/test` and placed an invalid facade in `package.json` (`"test": "echo \"Error: no test specified\" && exit 1"`).
- **Hardcoded Test Results**: The test files contained mechanisms to force a pass regardless of actual application state, such as `expect(true).toBe(true)` and permitting `404` status codes for deep-linking tests (`expect([200, 404]).toContain(response.status())`).
- **Fabricated Verification Logic (DOM Injection)**: The tests altered the page's actual DOM at runtime (`document.body.innerHTML = ...`) or injected specific elements (e.g., `<a id="injected-anchor-link">`) just to click them, bypassing the application's actual UI structure.

## 2. Logic Chain
1. **Adherence to Specifications**: `TEST_INFRA.md` requires a specific test architecture (`node run_e2e_tests.js`, `puppeteer`/`fetch`). All traces of Playwright must be removed to satisfy the architectural constraint.
2. **Elimination of Facades**: To legitimately interrogate the application state, the tests must read the unaltered DOM. If a required element (like a navigation menu or specific page link) does not exist, the test script must fail. Accepting a `404` status code for an existing page check is a false positive; the test must strictly enforce a `200` status (or `3xx` valid redirect) for expected routes.
3. **Framework Choice**: Puppeteer provides robust APIs (`page.goto()`, `page.waitForSelector()`, `page.click()`) to interact with the application natively. We must use these APIs to query actual elements (e.g., `<nav>`, `<h1>`, `.voicebank-card`) and fail the promise if the element is not found within a reasonable timeout.

## 3. Caveats
- Since the tests must not inject IDs, they will rely on the HTML structure and CSS classes implemented by the redesign. Test selectors must target semantic HTML (e.g., `header nav a`) or visible text. If the redesign drastically changes DOM tags, tests may break—this is the correct, intended behavior of an opaque-box test.
- The custom test runner (`runner.js`) must correctly manage the local dev server lifecycle (e.g., spawning `npm start`, waiting for port 3000 to be responsive, running tests, and killing the child process). If it fails to clean up, port conflicts may occur on subsequent runs.

## 4. Conclusion (Recommended Strategy & Test Cases)
Implement a pure Node.js test runner using `puppeteer` that strictly queries the live DOM without modifications. 

### Project Structure
```text
/e2e_tests/
  ├── runner.js              (Manages dev server lifecycle and executes tier files)
  ├── tier1_features.js      (Basic feature assertions)
  ├── tier2_boundaries.js    (Edge cases and boundary inputs)
  ├── tier3_cross.js         (Feature interactions)
  └── tier4_workload.js      (Real-world scenarios)
/run_e2e_tests.js          (Entry point script that requires e2e_tests/runner.js)
```

### Test Cases
- **Tier 1: Features**
  1. *Local Dev Server*: Fetch `http://localhost:3000` to verify a `200 OK` response.
  2. *Page Navigation*: Extract real `href` attributes from `<nav>` links and ensure `page.goto()` returns `200` for each.
  3. *Responsive Layout*: Verify the presence of `<meta name="viewport">` in the `<head>`.
  4. *Asset/Resource Load*: Intercept network requests during a page load and verify no `.css`, `.js`, or image files return a `404` or `5xx` error.
  5. *Clean Codebase Struct*: Assert that there are no unhandled JavaScript exceptions in the browser console during navigation.

- **Tier 2: Boundaries**
  1. *Rapid Navigation*: Rapidly click a legitimate link multiple times to ensure the browser/server doesn't hang.
  2. *404 Handling*: Purposefully visit a random, non-existent URL (e.g., `/does-not-exist.html`) and verify it strictly returns a `404` status (testing the boundary of routing).
  3. *Viewport Extremes*: Use `page.setViewport()` to test unusually small (320x480) and unusually large (2560x1440) resolutions, ensuring the main layout container remains visible without throwing overflow errors.
  4. *Asset Timeout Boundaries*: Assert page load completion even if an external tracker or non-critical asset is blocked or delayed.

- **Tier 3: Cross / Pairwise**
  1. *Navigation + Responsive*: Resize the viewport to mobile, open the hamburger menu (if present, else standard nav), and navigate to a new page.
  2. *Resource Load + Navigation*: Start loading a heavy page (e.g., All Voicebanks), and navigate back to Home before all images finish downloading, ensuring no application crash.

- **Tier 4: Workload**
  1. *Full Site Tour on Mobile*: Emulate a mobile device, visit Home -> About Us -> All Voicebanks -> Events, checking for `200` statuses.
  2. *Full Site Tour on Desktop*: Emulate a desktop viewport, repeat the full site tour, verifying correct page rendering.
  3. *Refresh Stress Test*: Call `page.reload()` 10 times rapidly on the index page; verify final state is fully rendered and operational.
  4. *Deep Linking*: Access 4 specific inner `.html` pages directly via `page.goto()`, verifying they load properly without routing through the homepage.
  5. *Fast Viewport Resizing*: Rapidly toggle the viewport dimensions between mobile, tablet, and desktop multiple times on a single page, capturing any unhandled UI exceptions.

## 5. Verification Method
1. Inspect the codebase to ensure `@playwright/test` is uninstalled and `e2e_tests/tests/*.spec.js` files are deleted.
2. Read the source of `e2e_tests/tier*.js`. Search for `innerHTML`, `document.createElement`, `expect(true).toBe(true)`, or arrays allowing `404` (`[200, 404]`). None should exist.
3. Run `node run_e2e_tests.js`. Ensure it exits with code `0` on success, and manually alter the `src/` code (e.g., rename a navigation link or delete an image) to verify the test suite legitimately fails with a non-zero exit code.
