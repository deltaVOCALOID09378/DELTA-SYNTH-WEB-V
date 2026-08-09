# Project: DELTA SYNTH Official Website Redesign

## Architecture
- **Type**: Multi-page static website (HTML5, CSS3, Vanilla JS).
- **Styling**: Tailwind CSS (via CDN or locally built) for rapid, modern styling.
- **Structure**: 
  - Shared Navigation Bar and Footer across all pages.
  - Responsive design (Mobile first).
- **Assets**: Images extracted from original `Picture File` and `*_files` directories.

## Code Layout
```
/src/
  index.html
  about.html
  voicebank.html
  files.html
  collab.html
  events.html
  css/
    styles.css
  js/
    main.js
/assets/
  images/
/server.js (Simple Node or Python server script for local dev, or package.json with `serve` dependency)
```

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | M1_Setup_Content | Extract raw text and images from existing Wix HTML files, setup `/src` folder, `server.js`, and define shared CSS layout/Tailwind config. | none | DONE |
| 2 | M2_Core_Pages | Implement `index.html` and `about.html` using the extracted content and modern UI/UX principles. Ensure responsiveness. | M1 | DONE |
| 3 | M3_Voicebanks | Implement `voicebank.html` and `collab.html`. Organize voicebank data cleanly in a grid or list. | M2 | IN_PROGRESS (e3a68c88-5310-49de-bbee-ab3e154be408) |
| 4 | M4_Files_Events | Implement `files.html` and `events.html`. Finalize integration, navigation links, and Polish. | M2 | IN_PROGRESS (68f884f4-387e-4c1c-9058-1b50b75e65a1) |

## Interface Contracts
### `css/styles.css` & shared JS
- Global theme definitions (colors, fonts).
- Shared classes for buttons, cards, headings, and containers.
- Shared Navbar/Footer HTML snippet structure to be duplicated or injected across pages.
