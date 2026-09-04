# Handoff Report: Files & Events Implementation Plan

## Observation
- Read `PROJECT.md`, `.agents/sub_orch_m4/SCOPE.md`.
- Read `src/index.html` and noted the shared Navbar and Footer structures, including the mobile menu script (`mobile-menu-btn`).
- The Navbar currently uses `#` for Voicebanks, Files, Events, and Collab links.
- Analyzed `4._USTX, MIDI, SVP and VSQX file _ DELTA SYNTH.html` and extracted 9 project download links:
  - `ban saen sok`: https://drive.google.com/file/d/1ZgZqAPIhaKFEwY6IpM9cckvXa5id_yTn/view?usp=share_link
  - `Dawn`: https://drive.google.com/file/d/13zagXPdQM2hDS4FXKKXVzLF7ebylUo1D/view?usp=sharing
  - `Falling out of love`: https://drive.google.com/file/d/1Egd5fzkrrg6tLpYM1xcLIFg6XCrrX3-P/view?usp=sharing
  - `Look-oam ลูกอม feat Watchawalee`: https://drive.google.com/file/d/1Ej0YkIVppfm-F3iUGnX9OjBHsTYkgRaz/view?usp=sharing
  - `King -Kanaria ENG`: https://drive.google.com/file/d/1W3Q4P-G5XXEngFUncw31Hl0HqVB_DORY/view?usp=sharing
  - `Ojama Mushi II thai VER`: https://drive.google.com/file/d/1PhA1f1JmV_1Uxh4MH2pZbAIFITZDrfuU/view?usp=drive_link
  - `springtrap Finale UStx and svp`: https://drive.google.com/file/d/1MJt0z9gwGIEMTWIXL6gv6tMccz6ICqC7/view?usp=sharing
  - `Super superhero feat pinochio thai ver`: https://drive.google.com/file/d/1Hw3e2rLkEQeVfdIf5m6R3IE_6veXhiti/view?usp=drive_link
  - `wrinkle Thai ver by lunacat`: https://drive.google.com/file/d/1--8PdhOvGFp-XFPQjpce4PIcFhFzaJoq/view?usp=drive_link
- Analyzed `6._Events _ deltasynthstudio.html` and extracted 5 upcoming events:
  - `Yung Shah w/DJ Maco` (เสาร์ 22 ก.ค. @ Cypher City)
  - `Big Broadie` (ศุกร์ 21 ก.ค. @ Cypher City)
  - `T.O.A.S.T.` (อังคาร 18 ก.ค. @ Cypher City)
  - `Los Gatos del Oeste` (เสาร์ 15 ก.ค. @ Cypher City)
  - `Teflon T` (ศุกร์ 14 ก.ค. @ Cypher City)

## Logic Chain
- To implement `src/files.html`, the Worker should use Tailwind CSS to create a grid or list interface for the 9 extracted download links. The page must include the global Navbar and Footer extracted from `index.html`.
- To implement `src/events.html`, the Worker should present the 5 events, possibly using card layouts with Tailwind styling (e.g., `bg-gray-800 p-6 rounded-lg`). The page must also include the global Navbar and Footer.
- The navigation links across ALL pages (`index.html`, `about.html`, `voicebank.html`, `collab.html`, `files.html`, `events.html`) must be updated:
  - Voicebanks -> `voicebank.html`
  - Files -> `files.html`
  - Events -> `events.html`
  - Collab -> `collab.html`
  This needs to be updated for both the desktop menu (`<div class="hidden md:flex space-x-6">`) and the mobile menu (`<div id="mobile-menu"...>`).

## Caveats
- Since the images for events were extremely large, no specific images are mapped for the events. A clean text-based UI with standard Tailwind styling will suffice unless generic icons are used.
- The target HTML files `voicebank.html` and `collab.html` may have been created or are being created by M3, so the replace instructions should target all existing `.html` files in `src/`.

## Conclusion
**Implementation Plan for Worker:**

1. **Create `src/files.html`**:
   - Duplicate the HTML shell (Navbar + Footer) from `index.html`.
   - Update the `<title>` to "DELTA SYNTH Studio - Files & Downloads".
   - Create a `main` section (`flex-grow pt-20 container mx-auto px-4 py-16`).
   - Implement a grid (`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`) containing the 9 downloads as cards or styled links.

2. **Create `src/events.html`**:
   - Duplicate the HTML shell (Navbar + Footer) from `index.html`.
   - Update the `<title>` to "DELTA SYNTH Studio - Events".
   - Create a `main` section.
   - Implement a list or grid to display the 5 events (Title, Date, Location).

3. **Update Navigation Links**:
   - For every `.html` file in `src/`, find the Desktop and Mobile navigation links.
   - Replace the `href="#"` attributes with their corresponding file paths.
   - E.g., `href="voicebank.html"`, `href="files.html"`, `href="events.html"`, `href="collab.html"`.
   - Also, highlight the active page by changing text color (e.g., adding `text-blue-400` to the current page's link).

## Verification Method
- Open `src/files.html` and `src/events.html` in a browser or viewer to ensure layout consistency.
- Verify that clicking navigation links on any page successfully routes to the other pages.
- Use `grep_search` to confirm `#` is no longer used for navigation links in `src/`.
