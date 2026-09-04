# Project: DELTA SYNTH Official Website — Architecture, Restoration & Hardening

## Architecture
DELTA SYNTH is a bilingual (Thai/English) virtual singer ecosystem, music file archive, and catalog platform built on clean semantic HTML5, modern vanilla JavaScript, Tailwind/CSS design tokens, and Wix Velo integration.
- **Static Portal Layer (`src/public/`)**: Core public pages (`index.html`, `about.html`, `voicebank.html`, `files.html`, `collab.html`, `events.html`, `project.html`), and 53 individual singer profiles (`singers/*.html`).
- **Client Script & Interaction Layer (`src/public/`)**: Shared client engine (`script.js`), starfield animator (`js/starfield.js`), audio player (`audioPlayer.js`), toast notification engine (`toast.js`), and theme tokens (`theme.js`).
- **Data & Lore Layer (`src/public/assets/data/`, `src/public/`)**: Authoritative founder lore & milestone history (`content.json`), 53-singer master catalog (`voicebankData.js`), and project catalogs (`projectData.js`).
- **Asset Repositories (`src/public/assets/`, `src/public/Voice/`)**: High-res voicebank artworks (`assets/images/voicebanks/`), profile webp thumbnails (`assets/voicebanks/profile/`), and audio samples (`Voice/*.wav`).
- **Backend Service Layer (`src/backend/`)**: Web modules (`contactService.jsw`, `registrationService.jsw`, `voicebankService.jsw`, `fileService.jsw`), REST API (`http-functions.js`), and access control (`permissions.json`).
- **Automated Test Infrastructure (`tests/`)**: 4-Tier Opaque-box E2E test harness and unit test suites running under native Node test environment (`node tests/run-all-tests.js`).

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| F1 | Navigation & Mobile Drawer System | Unified mobile drawer with outside click, Escape dismissal, ARIA expanded state, and focus management across all portal pages | M1 | Survey Nav Explorer |
| F2 | Active Navbar Resolution | Clean URL normalization (handling `.html`, clean URLs, root) and single active link highlighting without double highlights | M1 | Survey Nav Explorer |
| F3 | Singer Mobile Navigation Integration | Complete mobile drawer markup, hamburger button ID, and `script.js` integration across all 53 singer profile pages | M1 | Survey Nav Explorer |
| F4 | Official Social & Media Link Routing | Replacement of 21 dead `#` footer links with verified official YouTube, TikTok, X, and Facebook channels | M1 | Survey Nav Explorer |
| F5 | Song File Download Access | Actionable download links and `files.zip` integration for 9 project files in `files.html` | M1 | Survey Nav Explorer |
| F6 | UTF-8 Mojibake Elimination | Total elimination of double-encoded UTF-8 mojibake (`à¸`, `à¹`, `Â·`, `â€”`, `Î”`, `ðŸ¤ `) across `index.html`, `about.html`, `files.html`, `collab.html`, `events.html` | M2 | Survey Encoding Explorer |
| F7 | Numeric Hex Entity Cleanup | Elimination of raw `&#xE...` hex escapes in `voicebank.html` and `generate_voicebank.cjs` in favor of native UTF-8 Thai strings | M2 | Survey Encoding Explorer |
| F8 | Founder Lore & Lore Integrity | Complete restoration and preservation of authentic biographies for all 6 founders (Hikaru, SUN, Kochujang, Guren Kani, Kyoko, Thitiya) and Mr. Delta milestone history in `about.html` | M2 | Survey Encoding Explorer |
| F9 | 53-Singer Catalog Synchronization | 100% synchronization of metadata (Age, Gender, Voicer, Genre, Engine, Language, Description, Download URL, Audio Sample) between `voicebankData.js`, `voicebank.html`, and all 53 `singers/*.html` pages | M3 | Survey Voicebank Explorer |
| F10 | Image & Audio Asset Remediation | Fix corrupted 0-byte `kangfu.webp`, provide fallback/remedies for `mochiai.webp`/`Mochiai.png`/`Mochiai.wav`, align double-spaced filenames (`Bew  Powerine.png`), and fix missing `Ball Powerine.wav` | M3 | Survey Voicebank Explorer |
| F11 | Audio Sample Path Normalization | Align all audio sample references in code with exact disk filenames (`Kochujang1.wav`, `Charnsamorn.wav`, `Kikokawa Usagi.wav`, `Bew Powerine.wav`, `ARZBTV.wav`, `Thitiya.wav`, `Beem.wav`, `Sakultala1.wav`, `Yamada Kimada1.wav`, `Natsune Tanda.wav`) | M3 | Survey Voicebank Explorer |
| F12 | Singer Lore & Biographies Upgrade | Eliminate `<li>Unknown</li>` placeholders in Projects across all 53 singer pages and inject authentic bilingual English/Thai descriptions | M3 | Survey Voicebank Explorer |
| F13 | Accessibility (a11y) & WCAG AA Compliance | Implement ARIA tags, button labels, filter chip `aria-pressed`, keyboard navigation, and update low-contrast text colors (`#666666` -> `#9CA3AF`) | M4 | Survey Voicebank & Nav Explorers |
| F14 | Automated Test Suite Expansion (144+ Tests) | Expand Node native test suite to ≥144 tests covering navigation routing, UTF-8 integrity, 53 singer catalog synchronization, asset existence, and a11y standards | M4 | E2E Track & AGENT.md |
| F15 | Zero-Dependency Test Execution | Ensure `node tests/run-all-tests.js` executes seamlessly with zero runtime module resolution errors across all Node environments | M4 | E2E Track |
| F16 | Deployment & Build Certification | Verify static packaging, clean builds, and deployment readiness for Vercel and GitHub Pages | M4 | AGENT.md & Project Spec |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Website Access & Navigation System Repair | `src/public/script.js`, `index.html`, `about.html`, `voicebank.html`, `files.html`, `collab.html`, `events.html`, `project.html`, `generate_voicebank.cjs`, `generate.cjs` | Survey | IN_PROGRESS |
| M2 | Character Encoding & Content Integrity Restoration | `index.html`, `about.html`, `files.html`, `collab.html`, `events.html`, `voicebank.html`, `generate_voicebank.cjs` | M1 | PLANNED |
| M3 | Voicebank & Singer Catalog Synchronization (53 Singers) | `src/public/singers/*.html` (all 53 files), `src/public/voicebank.html`, `src/public/voicebankData.js`, assets, `Voice/*.wav`, `generate.cjs`, `generate_voicebank.cjs` | M1, M2 | PLANNED |
| M4 | Accessibility, E2E Test Expansion (144+ Tests) & Deployment Readiness | `tests/*.js`, `tests/run-all-tests.js`, a11y ARIA in HTML/JS, color contrast tokens, `TEST_READY.md` | M1, M2, M3 | PLANNED |

## Interface Contracts
### Client Navigation Engine (`src/public/script.js`)
- Initializes on `DOMContentLoaded`.
- Active Link Handler:
  - Normalizes `window.location.pathname` (strips `.html`, query strings, trailing slashes, maps `""`/`"/"` to `"index"`).
  - Clears all previous `.active` classes and `aria-current="page"` attributes across `.nav-links a`, `#mobile-menu a`, `.mobile-drawer a`.
  - Assigns `.active` and `aria-current="page"` to the single matching link (mapping `/singers/*` to `voicebank`).
- Mobile Navigation Drawers:
  - Portal Header (`.nav-toggle` ↔ `.nav-links`): Toggles `.open`, manages `aria-expanded`, auto-closes on outside click, on link click, and on `Escape` key press.
  - Singer & Project Layouts (`#mobile-menu-btn` ↔ `#mobile-menu`): Toggles `.hidden`, manages `aria-expanded`, auto-closes on outside click, on link click, and on `Escape` key press.

### Voicebank Data Master Schema (`src/public/voicebankData.js` ↔ `singers/*.html`, `voicebank.html`)
Each of the 53 singer objects MUST contain:
```javascript
{
  id: string,               // e.g. 'ayanami_hikaru'
  name: string,             // e.g. 'Ayanami Hikaru'
  nameTh: string,           // e.g. 'อายานามิ ฮิคารุ'
  gender: 'Male' | 'Female',
  age: number,              // e.g. 20
  voicer: string,           // e.g. 'DELTA SYNTH (Patiphat Wongyai)'
  engine: string,           // e.g. 'UTAU / DiffSinger AI'
  type: string,             // e.g. 'CVVC', 'VCV', 'VCCV', 'DiffSinger'
  genre: string,            // e.g. 'Pop / Rock / EDM'
  language: string,         // e.g. 'Thai / Japanese / English'
  status: 'Ready' | 'Beta' | 'Developing' | 'Private',
  image: string,            // 'assets/voicebanks/profile/<id>.webp'
  imageFull: string,        // 'assets/images/voicebanks/<Name>.png'
  audioSample: string,      // 'Voice/<ActualWavFileName>.wav'
  detailUrl: string,        // 'singers/<id>.html'
  downloadUrl: string,      // 'https://drive.google.com/...' or official download URL
  description: string,      // Rich authentic Thai description
  descriptionEn: string,    // Accurate authentic English description
  tags: string[]
}
```

## Code Layout
- `src/public/`: Static HTML entry points, shared CSS stylesheets, client scripts (`script.js`, `audioPlayer.js`, `toast.js`), data catalogs (`voicebankData.js`, `projectData.js`, `assets/data/content.json`).
- `src/public/singers/`: 53 individual static HTML profiles for each virtual singer.
- `src/public/assets/images/voicebanks/`: High-resolution character artwork PNGs.
- `src/public/assets/voicebanks/profile/`: Character thumbnail WebP images.
- `src/public/Voice/`: Audio sample WAV previews.
- `src/backend/`: Wix Velo backend web methods (`.jsw`), REST routes (`http-functions.js`), access control (`permissions.json`).
- `tests/`: 4-Tier test suites, test runner (`run-all-tests.js`), loader, and mocks.
- `.agents/`: Agent orchestration state, plans, handoffs, and verification logs.
