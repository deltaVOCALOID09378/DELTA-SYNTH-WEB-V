# Synthesis: M3 Voicebanks Implementation

## Consensus
- **Layout & Theme**: `voicebank.html` and `collab.html` must inherit the dark theme from `src/index.html` (e.g., `bg-slate-900 text-white`, fixed navbar, consistent footer).
- **UI Component**: The voicebanks should be presented using a responsive Tailwind CSS grid of cards (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`).
- **Card Design**: Each card must feature the character's image (`object-cover`), name, basic metadata (Age, Gender, Voicer, Release Date), and a download/action button.

## Resolved Conflicts
- **Image Sources**: Use high-res images from `../Picture File/A Full Body Picture/` or `../Picture File/A Profile for Singer Picture/` where possible. Fall back to `../3._All Voicebank _ DELTA SYNTH_files/` and `../5._All Callaboraion Voicebank. _ deltasynthstudio_files/` if the high-res versions are missing.
- **Text Data**: If `assets/data/content.json` exists and contains structured metadata, use it. Otherwise, you may write a script to scrape the metadata from the original Wix HTML files (`3._All Voicebank _ DELTA SYNTH.html` and `5._All Callaboraion Voicebank. _ deltasynthstudio.html`) and convert it into a structured JSON for injection, or just hardcode the HTML if easier.

## Actionable Steps for Worker
1. Create `/src/voicebank.html`. Copy the `index.html` boilerplate (navbar/footer).
2. Create a grid layout container.
3. Parse the characters from the original HTML files or JSON, and generate cards for the 29 main voicebanks.
4. Create `/src/collab.html` with the same boilerplate, but populated with the 3 collaboration voicebanks.
5. Verify that images load correctly.
6. Verify layout responsiveness.
7. Write your handoff to `handoff.md`.
