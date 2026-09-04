# Scope: M1_Setup_Content

## Architecture
- Module boundaries: Set up the project structure (`/src` and `/assets`), package.json for local server, extraction script/process for text and images from old Wix HTML.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | SubM1_Extract | Extract raw text and images from existing Wix HTML and organize into `assets/images` and markdown/json files. | none | DONE |
| 2 | SubM1_Structure | Create `/src` directory, `package.json` with a dev server dependency, and basic `css/styles.css` with Tailwind config/base. | none | DONE |

## Interface Contracts
### Extraction ↔ Structure
- Extracted images stored in `assets/images`
- Extracted text organized in a structured format (JSON or Markdown) in `/assets/data` to be used by M2-M4.
