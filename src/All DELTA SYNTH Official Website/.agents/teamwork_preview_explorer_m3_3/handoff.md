# Handoff Report: Voicebank UI Strategy and Extraction

## Observation
1. **Shared Layout (`src/index.html`)**: The website uses a dark theme (`bg-slate-900 text-white`) with a fixed navbar and a flexible main content area (`<main class="flex-grow pt-20">`).
2. **Original Voicebank Data**: 
   - Found 29 character image files for regular voicebanks in `3._All Voicebank _ DELTA SYNTH_files/`, including `Root.png`, `Tom.png`, `Dokya.png`, `Namphueng.png`, `Ahctan.png`, etc.
   - Text metadata in the HTML corresponds to these characters, capturing Name, Age, Gender, Weight, Height, Birth Day, Project, Release Date, Voicer, Voice Rank, Genre, Main Item, Character Item, Like, and Dislike.
3. **Collaboration Voicebanks**: 
   - Found 3 character image files in `5._All Callaboraion Voicebank. _ deltasynthstudio_files/`, specifically `Felix.png`, `MochiAI.png`, and `Quint.png`.

## Logic Chain
1. The original Wix site relies heavily on absolute positioning and inline styles, which is not responsive or maintainable.
2. The new site uses Tailwind CSS. We can represent each voicebank as a "card" in a grid.
3. Because there are 29 regular voicebanks and 3 collaboration voicebanks, a responsive grid (e.g., `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`) will make browsing much easier on both mobile and desktop.
4. Each card can house the character image, name, and a "Details" dropdown or list of metadata, along with styled download buttons for the respective UTAU/Diffsinger files.

## Caveats
- Since the Python script extraction timed out due to the permission prompt on Windows, the exact text metadata for every single character hasn't been parsed into a JSON file. The implementer will need to extract the text manually from the HTML or use a simplified layout where data is populated dynamically later.
- Image paths might need to be copied or referenced correctly relative to the `src/` directory (e.g., `../3._All Voicebank _ DELTA SYNTH_files/Root.png`).

## Conclusion
- **Implementer Action**: Create `/src/voicebank.html` and `/src/collab.html` using the `index.html` boilerplate.
- **UI Strategy**: Use a `<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">` container.
- **Card Design**: Inside the grid, create cards with `<div class="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700">`. Display the character image at the top with `object-cover`, followed by the name, basic info (Age, Gender, etc.), and stylized download links (`class="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-4"`).

## Verification Method
- **Images**: Run `ls "e:\All DELTA SYNTH Official Website\3._All Voicebank _ DELTA SYNTH_files\*.png"` to verify all 29 images exist.
- **UI Testing**: Open `src/voicebank.html` and `src/collab.html` in a browser. Resize the window to verify that the Tailwind grid reflows correctly from 1 column on mobile to 3/4 columns on desktop.
