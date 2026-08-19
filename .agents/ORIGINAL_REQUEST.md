# Original User Request

## 2026-08-15T21:09:45Z

Wix Velo script optimization, defensive architecture hardening, security audit, and code quality verification for the DELTA SYNTH website according to AGENT.md standards.

Working directory: `e:\Program Developing\DELTA_SYNTH-main`
Integrity mode: development

## Requirements

### R1. Wix Velo Architecture & Code Quality Audit
Audit all 14 Wix Velo page scripts in `src/pages/`, backend web modules in `src/backend/`, and public shared utilities in `src/public/`. Ensure strict adherence to AGENT.md:
- Defensive `$wSafely` wrapper on all UI interactions to prevent unhandled runtime exceptions.
- Structured logging format: `[Component] Action failed: <cause>. Suggested action: <next step>.`
- Zero swallowed exceptions and clean error propagation.
- Strict type contracts, null-safety checks, and sanitization of all user inputs.

### R2. Performance, Stability & Asset Optimization
Refactor existing code to eliminate redundant operations, excessive DOM lookups, and memory leaks:
- Optimize cache and state management for the 54-voicebank catalog and music file resources.
- Ensure smooth audio playback transitions and non-blocking background tasks.
- Verify asset references, image preloading, and clean resource disposal.

### R3. Security & Data Integrity Verification
Validate boundaries across all backend web methods (`voicebankService.jsw`, `fileService.jsw`, `registrationService.jsw`, `contactService.jsw`, `http-functions.js`):
- Sanitize and validate inputs in `contactService` and `registrationService`.
- Verify `permissions.json` access control and prevent privilege escalation or data tampering.

## Acceptance Criteria

### Code Quality & Standards (AGENT.md)
- [ ] All 14 page scripts in `src/pages/` pass ESLint and syntax checks without errors or unhandled warnings.
- [ ] No `except: pass`, empty catch blocks, or suppressed lint errors exist across the codebase.
- [ ] All backend endpoints in `src/backend/` validate inputs defensively and return standard error responses on invalid payloads.
- [ ] `permissions.json` correctly declares permissions for all exported web methods.

### Performance & Stability
- [ ] Static web assets (`src/public/*.html`) and Velo scripts share consistent data bindings and naming conventions.
- [ ] Audio player module handles rapid track switching, pause, and stop events without memory leakage or state collision.
- [ ] Toast notification system strictly adheres to AGENT.md geometry (max 280x80px, bottom-right offset 16, 20, radius 6px).
