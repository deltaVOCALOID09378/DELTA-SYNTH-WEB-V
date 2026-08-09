# Observation

- Extracted text content from the original HTML files is already available in `assets/data/content.json`.
- `3._All Voicebank _ DELTA SYNTH.html` contains the text for the main voicebanks (e.g., Ayanami Hikaru, SUN, Kochujang, GUREN KANI, Ayanami Kyoko, FANGYU, Thitiya Anantanetr, KangFu, Yamada Takeshi, SRIPHAN, DIWACHI, Mairu Maishi, Arun Kamonlanert, MIRO, Fuwari Bento, ONIKA, ARZBTV, FellowWhite, Ahctan, Narisa, Root, TomAI, Dokya, Namphueng, Charnsamorn, SakultalaAI, Savanna, Mayuree, Azaya Aika, Helen).
- `5._All Callaboraion Voicebank. _ deltasynthstudio.html` contains text for collaboration voicebanks (e.g., Shiroino Mochi, Quint, Felix, Ibara Kouya).
- Image files referenced by the voicebanks are locally available in the workspace under `Picture File/A Full Body Picture/` and `Picture File/A Profile for Singer Picture/`.
- Verified the existence of image files using `Get-ChildItem`. Matches include: `Picture File/A Profile for Singer Picture/Ayanami Hikaru.png`, `Picture File/A Full Body Picture/SUN.png`, `Picture File/A Full Body Picture/Shiroino Mochi.png`, etc.
- `src/index.html` uses Tailwind CSS (`bg-slate-900`, `text-white`) with a fixed navbar and flex-col layout.

# Logic Chain

1. Since `assets/data/content.json` accurately provides the structured text and the image paths are stored locally with names matching the voicebanks (e.g., `Ayanami Hikaru.png`), we can map the character names directly to the existing local images.
2. The current layout in `src/index.html` uses a dark theme. The new pages `/src/voicebank.html` and `/src/collab.html` should inherit this design system (e.g., `bg-slate-900`, `text-white`, matching navbar).
3. The data structure for characters contains metadata like Age, Gender, Voicer, Release Date, etc. A grid of cards is the best way to display this information responsively.

# Caveats

- Some characters might lack a full-body picture but have a profile picture, or vice versa. The implementation should include a fallback image strategy or check both directories.
- The raw JSON contains unstructured string data like `"Name  :  Ayanami Hikaru"`. The implementer will need to clean and parse these strings into a structured JSON array of objects to map them to the cards.

# Conclusion

**Implementation Strategy:**

1. **Data Parsing:** Create a cleaned JSON array from `assets/data/content.json` where each object represents a voicebank (with `name`, `age`, `gender`, `voicer`, etc.).
2. **Image Mapping:** Map each voicebank `name` to its corresponding image path `../Picture File/A Full Body Picture/{name}.png` or `../Picture File/A Profile for Singer Picture/{name}.png`.
3. **UI Layout for `/src/voicebank.html` and `/src/collab.html`:**
   - Use the same dark navbar and footer from `src/index.html`.
   - Main content should be a container `container mx-auto px-4 py-16`.
   - Implement a responsive grid: `<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">`.
   - Each card: `<div class="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 hover:border-blue-500 transition duration-300">`.
   - Image wrapper: `<div class="h-64 overflow-hidden bg-gray-900 flex justify-center items-center">` containing the `<img>`.
   - Content wrapper: `<div class="p-6">` containing the character name (`h3`), and metadata pills or lists (`text-sm text-gray-300`).
   - Call to action: A download/details button at the bottom of the card.

# Verification Method

- Verify the UI by running a local HTTP server and opening `src/voicebank.html` and `src/collab.html`. Check responsiveness across mobile, tablet, and desktop viewports.
- Check if all images load correctly from the `Picture File` directory. If any image gives a 404, implement the fallback image logic or check name spelling differences.
