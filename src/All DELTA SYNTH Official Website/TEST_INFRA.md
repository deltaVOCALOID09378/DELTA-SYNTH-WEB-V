# E2E Test Infra: DELTA SYNTH Redesign

## Test Philosophy
- Opaque-box, requirement-driven. No dependency on implementation design.
- Methodology: Category-Partition + BVA + Pairwise + Workload Testing.
- Framework: A simple Node.js script using `http` and `puppeteer` (if available) or `fetch` to verify the site is up and running.

## Feature Inventory
| # | Feature | Source (requirement) | Tier 1 | Tier 2 | Tier 3 |
|---|---------|---------------------|:------:|:------:|:------:|
| 1 | Local Dev Server | ORIGINAL_REQUEST | 5      | 5      | ✓      |
| 2 | Page Navigation | ORIGINAL_REQUEST | 5      | 5      | ✓      |
| 3 | Responsive Layout | ORIGINAL_REQUEST | 5      | 5      | ✓      |
| 4 | Asset/Resource Load | ORIGINAL_REQUEST | 5      | 5      | ✓      |
| 5 | Clean Codebase Struct| ORIGINAL_REQUEST | 5      | 5      | ✓      |

## Test Architecture
- Test runner: `node run_e2e_tests.js`
- Test case format: JavaScript tests using basic assertions. The test runner will start the server, ping all expected endpoints, check for 404s, and test responsive meta tags in the HTML.
- Directory layout: 
  `/e2e_tests/`
    `runner.js`
    `tier1_features.js`
    `tier2_boundaries.js`
    `tier3_cross.js`
    `tier4_workload.js`

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Complexity |
|---|----------|--------------------|------------|
| 1 | Full Site Tour on Mobile | F1, F2, F3, F4 | Medium |
| 2 | Full Site Tour on Desktop | F1, F2, F3, F4 | Medium |
| 3 | Refresh Stress Test | F1, F4 | Low |
| 4 | Deep Linking to all pages | F2, F4 | Low |
| 5 | Fast viewport resizing | F3 | Medium |

## Coverage Thresholds
- Tier 1: ≥5 per feature
- Tier 2: ≥5 per feature
- Tier 3: pairwise coverage of major feature interactions
- Tier 4: ≥5 realistic application scenarios
