# Scope: E2E Testing Track

## Architecture
The E2E Testing Track implements an opaque-box, requirement-driven automated testing infrastructure for DELTA SYNTH.
The test harness runs under Node.js (`node:test`, `node:assert`) and exercises:
1. Public utilities (`utils.js`, `toast.js`, `theme.js`, `audioPlayer.js`, `voicebankData.js`, `projectData.js`)
2. Backend web modules (`contactService.jsw`, `registrationService.jsw`, `voicebankService.jsw`, `fileService.jsw`, `http-functions.js`, `data.js`, `permissions.json`)
3. Page contracts & UI interaction logic simulation (scoped element access `$wSafely`, repeater handling, debounce, error logging)

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| F1 | Scoped Safe Element Access | Enhanced `$wSafely(selector, action, scope)` supporting canvas & repeaters | E2E Suite | PROJECT.md |
| F2 | Zero Swallowed Exceptions | Clean exception handling & propagation without empty catches | E2E Suite | PROJECT.md |
| F3 | Structured Logging Format | `[Component] Action failed: <cause>. Suggested action: <next step>.` | E2E Suite | PROJECT.md |
| F4 | Toast Engine & Geometry | Max 280x80px, bottom-right (16,20), 6px radius, Leelawadee UI | E2E Suite | PROJECT.md |
| F5 | Toast Signature Fix | Correction of string argument signatures in callers | E2E Suite | PROJECT.md |
| F6 | Audio Player Stability | Play promise token tracking, event detachment, clean disposal | E2E Suite | PROJECT.md |
| F7 | 54-Voicebank Catalog Caching | O(1) Map lookup & filtering across all 54 singers | E2E Suite | PROJECT.md |
| F8 | Backend Input Defense & Whitelisting | Top-level validation & domain whitelisting across services | E2E Suite | PROJECT.md |
| F9 | Permissions Access Control | Verification of all 8 web methods & wildcard fallback | E2E Suite | PROJECT.md |
| F10 | REST API CORS & HTTP Codes | CORS preflight OPTIONS & 400 Bad Request error status | E2E Suite | PROJECT.md |
| F11 | Wix Data Hooks Defense | Safe item validation & defensive normalization in `data.js` | E2E Suite | PROJECT.md |
| F12 | Page Script Error Boundaries | Error boundaries and safe rendering simulation | E2E Suite | PROJECT.md |
| F13 | Form Submission Debounce | Debounce and guard against multiple concurrent submissions | E2E Suite | PROJECT.md |

## Milestones / Test Tiers
| Tier | Name | Target Count | Description | Status |
|------|------|--------------|-------------|--------|
| Tier 1 | Feature Coverage | ≥5 per feature (≥65 tests) | Equivalence classes & happy-path isolation verification | PLANNED |
| Tier 2 | Boundary & Corner Cases | ≥5 per feature (≥65 tests) | Null, undefined, empty, extremes, rapid switching, malformed payloads | PLANNED |
| Tier 3 | Cross-Feature Interactions | ≥15 tests | Pairwise combinatorial testing of shared state & flows | PLANNED |
| Tier 4 | Real-World Workloads | ≥10 tests | Complete user journeys, catalog search bursts, form submission pipelines | PLANNED |

## Deliverables
- `TEST_INFRA.md`: Comprehensive test methodology document at project root.
- `tests/run-all-tests.js`: Native Node.js test runner harness.
- `package.json`: Updated `"scripts": { "test": "node tests/run-all-tests.js" }`.
- `tests/tier1-feature-coverage.test.js`
- `tests/tier2-boundary-corner.test.js`
- `tests/tier3-cross-feature.test.js`
- `tests/tier4-real-world-workloads.test.js`
- `tests/test-helpers.js`: Shared mocks & assertions for Wix environment simulation.
- `TEST_READY.md`: Signal that test suite is complete with full coverage checklist.
