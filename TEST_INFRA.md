# DELTA SYNTH — Automated Test Infrastructure & 4-Tier Verification Specification
## Native Node.js E2E Test Architecture (AGENT.md Compliant)

> **Document Version**: 1.0.0  
> **Target Environment**: Node.js 18+ / 20+ LTS  
> **Testing Framework**: Native `node:test` & `node:assert/strict` (Zero External Dependencies)  
> **Coverage Goal**: 100% Feature, Boundary, Cross-Feature, and Real-World Workload Coverage  
> **Standards Compliance**: DELTA SYNTH `AGENT.md` (Sections 1–20), `PROJECT.md`, `SCOPE.md`

---

# 1. Executive Summary & Testing Philosophy

The DELTA SYNTH test infrastructure provides an **opaque-box, requirement-driven automated verification platform** designed for full-stack Wix Velo applications and static audio catalog ecosystems.

### Core Architectural Principles:
1. **Zero External Test Dependencies**: Built exclusively on Node.js native testing modules (`node:test` and `node:assert/strict`), eliminating heavy framework dependencies (Jest, Mocha, Vitest) in strict accordance with **AGENT.md Section 4 (Resource-Aware Optimization)** and **Section 16 (Forbidden Practices)**.
2. **High-Fidelity Wix Velo Emulation**: Complete simulation of Wix runtime primitives (`$w`, `$item` repeater scoped contexts, `wix-data` fluent query chains, `wix-location`, `wix-window`, HTML5 `Audio`, DOM Toast geometry).
3. **Deterministic Isolation**: Every test executes inside a fresh sandbox with automatic teardown of timers, audio listeners, global mutations, and DOM elements, guaranteeing zero cross-test state leakage.
4. **Strict AGENT.md Compliance Validation**: Direct assertions for Toast notification geometry (max 280x80px, bottom-right offset 16, 20, 6px border radius), structured logging format (`[Component] Action failed: <cause>. Suggested action: <next step>.`), Buddhist Era date conversion (`formatDateThai`), and defensive input sanitization.

---

# 2. 4-Tier Testing Methodology

```
┌────────────────────────────────────────────────────────────────────────┐
│                        DELTA SYNTH TEST HARNESS                        │
├────────────────────────────────────────────────────────────────────────┤
│  Tier 1: Feature Coverage (Category-Partition Equivalence Classes)     │
│  - Isolated positive & negative branch verification (≥65 tests)       │
├────────────────────────────────────────────────────────────────────────┤
│  Tier 2: Boundary & Corner Cases (Boundary Value Analysis - BVA)       │
│  - Null/undefined, extreme lengths, XSS/SQL payloads, limits (≥35 tests)│
├────────────────────────────────────────────────────────────────────────┤
│  Tier 3: Cross-Feature Interactions (Pairwise Combinatorial Testing)   │
│  - Multi-layer integration, state transitions, hooks, UI (≥10 tests)   │
├────────────────────────────────────────────────────────────────────────┤
│  Tier 4: Real-World Workloads & High Concurrency (Stress & Journeys)   │
│  - Full user journeys, 100 concurrent bursts, race recoveries (≥8 tests)│
└────────────────────────────────────────────────────────────────────────┘
```

### 2.1 Tier 1: Feature Coverage (Category-Partition Testing)
- **Objective**: Verify that each individual function, backend web method (`.jsw`), public utility, data hook, and UI helper behaves as specified under valid inputs and standard expected validation failures.
- **Partitioning Strategy**: For every input parameter, define equivalence partitions (Valid/Invalid, Present/Absent, Match/NoMatch) and test at least one representative value per partition.
- **Scope**:
  - Public Utilities (`utils.js`): `$wSafely` root and scoped access, `logStandard`, `sanitizeInput`, `debounce`, `throttle`, `formatDateThai`, `searchFilter`, `formatNumber`.
  - Toast & Theme (`toast.js`, `theme.js`): DOM binding, shorthand helpers (`toastSuccess`, `toastError`, `toastWarning`, `toastInfo`), auto-dismiss timer, theme tokens.
  - Audio Engine (`audioPlayer.js`): Play, toggle pause, stop, subscribe/unsubscribe, missing URL guard.
  - Data Catalogs (`voicebankData.js`, `projectData.js`): All 54 singers completeness, 18 mandatory schema fields, ID uniqueness, bilingual lookups, `PROJECTS`, `MUSIC_FILES`, `EVENTS`, `BETA_VOICEBANKS`, `CHANGELOGS`.
  - Backend Services (`contactService.jsw`, `registrationService.jsw`, `voicebankService.jsw`, `fileService.jsw`): Contact tickets, event registrations, beta applications, catalog queries, singer details, statistics, file downloads.
  - REST & Data Hooks (`http-functions.js`, `data.js`, `permissions.json`): REST GET/POST routes, CORS preflight, `beforeInsert`/`beforeUpdate` hooks, permissions matrix.

### 2.2 Tier 2: Boundary Value Analysis (BVA) & Corner Cases
- **Objective**: Stress software boundaries where off-by-one errors, buffer overflow, prototype manipulation, or unhandled exceptions typically occur.
- **Boundary Vectors**:
  - Null, undefined, empty strings `""`, whitespace-only strings `"   "`, and non-object inputs.
  - Type distortion (numbers/booleans/arrays passed where strings or objects are expected).
  - Extreme string lengths (10,000+ characters) testing clamping and memory stability.
  - Malicious injection vectors (XSS `<script>` tags, HTML attributes, SQL injection strings, path traversal `'../../'`).
  - Extreme pagination boundaries (negative pages, page > totalPages, gigantic pageSize > 1000, non-numeric strings).
  - Rapid audio state switching (successive rapid `play()` calls within 5ms) and subscriber exception isolation.
  - Prototype pollution attacks (`__proto__`, `toString`, `constructor` keys).

### 2.3 Tier 3: Cross-Feature Combinations (Pairwise Combinatorial Testing)
- **Objective**: Verify that independent features interact smoothly without state collisions, memory leaks, or race conditions.
- **Key Combinatorial Interactions**:
  1. Audio Playback -> Global State -> MasterPage UI Sync -> Error Toast Recovery.
  2. Voicebank Catalog Multi-Criteria Filter + Pagination + Audio Preview Dock Synchronization.
  3. REST API `post_contact` -> `submitContactMessage` -> `Contacts_beforeInsert` Data Hook Pipeline.
  4. REST API `post_register` -> `registerForEvent` -> `Registrations_beforeInsert` Data Hook Pipeline.
  5. Multi-Step Discovery to Beta Application Journey (`getVoicebanksList` -> `getSingerDetails` -> `applyBetaTester`).
  6. Catalog Search -> Music File Resources Filter -> Download Telemetry Flow.
  7. REST API CORS Preflight (`options_voicebanks`) -> GET Execution (`get_voicebanks`).
  8. Permissions Enforcement Matrix Simulation across Anonymous, Member, and Owner roles.
  9. Scoped Repeater Item Access (`$wSafely` with `$item`) -> Audio Preview -> Missing Sample Handling.
  10. Untrusted Search Query Sanitization -> Catalog Query -> Thai Buddhist Era Date Formatting.

### 2.4 Tier 4: Real-World Workloads & High Concurrency
- **Objective**: Validate the platform under realistic user journeys, high-concurrency bursts, and failure recovery scenarios.
- **Workload Scenarios**:
  1. Full End-to-End Voicebank Catalog Browsing Journey (search -> filter -> preview audio -> switch track -> toggle pause -> retrieve detail URL).
  2. High-Volume Concurrent Contact Submissions (100 simultaneous burst submissions verifying zero ticket ID collision and non-blocking completion in <200ms).
  3. Rapid Multi-Filter Voicebank Search Bursts (200 consecutive filter swaps verifying zero state corruption).
  4. Batch Event Registration & Capacity Pipeline Simulation (50 concurrent registrations through data hooks).
  5. Audio Playback Network Failure & Defensive Error Recovery (simulated network errors, structured logging, user toast alerts, clean reset).
  6. Music Resource Download & Thai Metadata Display Pipeline (`formatDateThai` Buddhist Era verification).
  7. Unauthenticated Adversarial Penetration Simulation (XSS injection, SQL injection, path traversal, oversized payloads).
  8. High-Frequency File Download Analytics Stream (150 concurrent telemetry events).

---

# 3. Feature-to-Tier Traceability Matrix (F1–F16)

| # | Feature | Scope / Source | Tier 1 (CP) | Tier 2 (BVA) | Tier 3 (Pairwise) | Tier 4 (Workloads) | Total Tests |
|---|---------|----------------|:-----------:|:------------:|:-----------------:|:------------------:|:-----------:|
| **F1** | Scoped Safe Element Access | `$wSafely`, `$w`, `$item` | 5 | 3 | 1 | 1 | **10** |
| **F2** | Zero Swallowed Exceptions | All try/catch blocks | 5 | 3 | 1 | 1 | **10** |
| **F3** | Structured Logging Format | `logStandard` & `console` | 5 | 2 | 1 | 1 | **9** |
| **F4** | Toast Engine & Geometry | `toast.js`, `THEME.toast` | 6 | 2 | 1 | 1 | **10** |
| **F5** | Toast Shorthands & Template | `wixPageTemplate.js` | 4 | 2 | 1 | 1 | **8** |
| **F6** | Audio Player Stability | `globalAudioPlayer` | 6 | 3 | 2 | 2 | **13** |
| **F7** | 54-Voicebank Catalog Caching | `VOICEBANKS`, `queryVoicebanks` | 6 | 3 | 2 | 2 | **13** |
| **F8** | Backend Input Defense | `*.jsw` Services | 15 | 8 | 2 | 2 | **27** |
| **F9** | Permissions Access Control | `permissions.json` | 5 | 2 | 1 | 0 | **8** |
| **F10** | REST API CORS & HTTP Codes | `http-functions.js` | 10 | 4 | 2 | 1 | **17** |
| **F11** | Wix Data Hooks Defense | `data.js` | 5 | 3 | 2 | 1 | **11** |
| **F12** | Universal Utilities | `formatDateThai`, `debounce`, etc. | 8 | 4 | 1 | 1 | **14** |
| **F13** | Project & Music Catalogs | `projectData.js` | 5 | 2 | 1 | 1 | **9** |
| **Total** | | | **≥70** | **≥38** | **≥15** | **≥12** | **≥135** |

---

# 4. Mock & Harness Architecture (`tests/test-helpers.js`)

`tests/test-helpers.js` provides high-fidelity simulations for all Wix Velo client and server runtime environments:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        TEST-HELPERS ARCHITECTURE                       │
├────────────────────────────────────────────────────────────────────────┤
│  1. MockCanvasEngine       - $w selector, comma selectors, $item scope │
│  2. MockRepeater           - Scoped element dictionaries per item ID   │
│  3. MockWixData            - Fluent query chaining, CRUD & data hooks  │
│  4. MockWixLocation        - URL parsing, query params, history log    │
│  5. MockWixWindow          - FormFactor, multilingual, lightboxes      │
│  6. MockAudio              - HTML5 Audio, autoplay reject, events      │
│  7. ConsoleSpy             - Log interception & AGENT.md format checks │
│  8. AGENT.md Validators    - Toast geometry & Structured log matchers  │
└────────────────────────────────────────────────────────────────────────┘
```

---

# 5. Test Execution Commands & CLI Options

```bash
# Run all 4 test tiers with full summary report
npm test

# Direct runner execution
node tests/run-all-tests.js

# Run a specific tier only
node tests/run-all-tests.js --tier=1
node tests/run-all-tests.js --tier=2
node tests/run-all-tests.js --tier=3
node tests/run-all-tests.js --tier=4

# Run with TAP machine-readable output
node tests/run-all-tests.js --tap

# Fail-fast mode (aborts on first failure)
node tests/run-all-tests.js --bail
```

---

# 6. Quality Gates & Acceptance Criteria

To achieve certification and allow `TEST_READY.md` publication:
1. **100% Pass Rate**: 0 failed assertions, 0 unhandled promise rejections across all 4 tiers.
2. **Zero External Test Dependencies**: Pure Node.js standard library execution.
3. **AGENT.md Section 9 Compliance**: Toast geometry strictly bounded (`maxWidth <= 280`, `maxHeight <= 80`, `offsetRight: 16`, `offsetBottom: 20`, `borderRadius: 6`).
4. **AGENT.md Section 11 Compliance**: Structured logs strictly follow `[Component] Action failed: <cause>. Suggested action: <next step>.`.
5. **High Execution Speed**: Entire test suite executes in `< 1000 ms` wall-clock time.
