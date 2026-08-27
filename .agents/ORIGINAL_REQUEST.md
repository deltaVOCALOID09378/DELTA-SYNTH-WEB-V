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

## 2026-08-24T02:19:16Z

Comprehensive bug-fixing, UTF-8 encoding restoration, mobile & desktop navigation repair, social/portal link routing, complete 53-voicebank catalog verification, and zero-defect accessibility compliance for the DELTA SYNTH official website according to AGENT.md standards.

Working directory: e:\Program Developing\DELTA_SYNTH-main
Integrity mode: development

## Requirements

### R1. Website Access & Navigation System Repair
- Fix broken button interactions and dead '#' anchor tags across all pages (index.html, about.html, voicebank.html, files.html, collab.html, events.html, project.html, and all singers/*.html).
- Ensure the mobile drawer/toggle navigation (.nav-toggle, #mobile-menu-btn) seamlessly toggles open and closed without trapping focus or failing on click.
- Correct active navbar styling so that only the exact current page receives the active highlight class (fixing the bug where multiple items like "About Us" and "Voicebanks" are both highlighted simultaneously).
- Replace dead placeholder links (href="#") with proper functional URLs or official media destinations (YouTube, TikTok, X/Twitter, and direct file download endpoints).

### R2. Character Encoding & Content Integrity Restoration
- Completely eliminate mojibake and encoding corruption across all HTML/JS files in src/public/, restoring clean, native bilingual Thai and English text in strict UTF-8 without BOM issues.
- Preserve all rich biographies, founder histories (Ayanami Hikaru, SUN, Kochujang, Guren Kani, Ayanami Kyoko, Thitiya Anantanetr), and label milestone lore.

### R3. Voicebank & Singer Catalog Synchronization (53 Singers)
- Ensure all 53 singer profile pages in src/public/singers/ and the roster cards in src/public/voicebank.html are 100% synchronized with src/public/voicebankData.js.
- Eliminate all Age: Unknown, Gender: Unknown, and Voicer: Unknown placeholders, populating them with real metadata, correct Thai/English bios, sample audio paths (Voice/*.wav), and Google Drive download links.
- Verify that every voicebank image path exists and renders correctly in both profile thumbnails (assets/voicebanks/profile/*.webp) and high-resolution artworks (assets/images/voicebanks/*.png).

### R4. Accessibility, Defensive Design & Test Verification
- Adhere to AGENT.md and Web Accessibility (a11y) standards: ensure proper ARIA attributes, keyboard navigation, tap target minimums, and color contrast ratios.
- Verify that all automated test suites pass (144+ unit/integration tests) with zero errors, and validate full static deployment readiness on Vercel and GitHub.

## Acceptance Criteria

### Navigation & Functionality
- [ ] No button or link anywhere on the site results in an unhandled dead '#' jump without target action.
- [ ] Mobile navigation toggle opens and closes reliably across all screen widths.
- [ ] Navbar highlights exactly one active link corresponding to the current URL.
- [ ] All social media links navigate to their actual DELTA SYNTH official destinations.

### Content & Encoding
- [ ] Zero mojibake characters (à¹ , à¸ , Ã, etc.) remain in any file across src/public/.
- [ ] All Thai and English text renders crisply in UTF-8.

### Singer Catalog & Assets
- [ ] All 53 singers are present with complete metadata (Age, Gender, Voicer, Genre, Engine, Language, Description, Download URL, Audio Sample) in both voicebank.html and individual singers/*.html pages.
- [ ] Zero broken image icons or 404 image errors exist across the catalog.

### Testing & Deployment
- [ ] All test suites run and pass 100% cleanly (node tests/run-all-tests.js).
- [ ] All files are staged and committed cleanly ready for Vercel/GitHub deployment.

