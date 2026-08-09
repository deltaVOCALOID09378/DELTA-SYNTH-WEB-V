# Handoff Report: Voicebank Content Extraction and Implementation Strategy

## 1. Observation
- The project aims to modernize the website UI/UX using HTML/Tailwind CSS.
- Shared structure: `/src/index.html` uses `bg-slate-900 text-white` for the body, an animated `bg-gray-900` Navbar, and similar Footer. Cards use `bg-gray-800 rounded-xl border-gray-700`.
- The source data file `3._All Voicebank _ DELTA SYNTH.html` is a Wix-generated page containing extensive inline styles, obfuscated class names (`comp-*`, `wixui-*`), and non-semantic DOM trees.
- Existing text extraction (seen in `assets/data/content.json`) successfully identified character metadata such as "Name : Ayanami Hikaru", "Age : 20", "Main Item", etc.
- To fully implement `voicebank.html`, we must extract more than text: images (`<img>` or `<wix-image>`), audio samples (embedded players or `<audio>` tags), and download links (`<a>` with hrefs).
- The file `/src/voicebank.html` does not exist yet.

## 2. Logic Chain
1. **Extraction Approach:** 
   Because the Wix DOM structure is highly convoluted and dynamically built, fully automated extraction via Python (`BeautifulSoup`) will be error-prone if trying to group items purely by DOM hierarchy. 
   - We should use a semi-automated Python script to parse out all image URLs, audio embed links, and `<a>` download links.
   - Assemble the data into a clean JSON file (e.g., `assets/data/voicebanks.json`).
   - Grouping can be done by parsing text nodes for "Name :" and associating the nearest `<img src>` and `<a href>` links. Since there are about 30 voicebanks, manual review and correction of this JSON is highly recommended.
2. **Implementation Strategy:** 
   We must maintain UI consistency with `/src/index.html`. 
   - `voicebank.html` should inherit the same `<body>` classes (`bg-slate-900 text-white flex flex-col min-h-screen`).
   - Wrap the main content in `<main class="flex-grow pt-20">`.
   - Implement a CSS Grid layout for the character cards. A 1-2-3 column responsive layout (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`) is ideal for a gallery-style directory.
3. **Card Component Design:** 
   To present the voicebank data clearly:
   - **Wrapper:** `bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden flex flex-col transition hover:scale-105`.
   - **Image:** Top of the card (`w-full h-64 object-contain bg-gray-900`).
   - **Body:** `p-6 flex flex-col flex-grow`.
   - **Header:** Character Name as `h3` (`text-2xl font-bold text-blue-400 mb-2`).
   - **Tags:** Metadata (Age, Gender) represented as inline badges (`px-3 py-1 bg-gray-700 rounded-full text-xs`).
   - **Stats:** A nested list or grid for "Project", "Voice Rank", "Main Item".
   - **Audio:** A standard `<audio controls>` or a styled custom player placeholder.
   - **Action:** A download link at the bottom, styled as a prominent button (`bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded w-full text-center mt-auto`).

## 3. Caveats
- Obfuscated Wix HTML may use `data-src` or lazy-loading for images instead of standard `src` attributes. The extraction script must account for these variations.
- Some voicebanks might lack images, audio samples, or download links. The Tailwind card design must handle missing elements gracefully (e.g., conditionally hiding the audio player or showing a placeholder image).
- I did not write the extraction code directly due to restricted execution permissions (user timeout).

## 4. Conclusion
We should create a clean `voicebanks.json` file from the Wix HTML (using a mix of BeautifulSoup and manual review). Then, construct `/src/voicebank.html` by mirroring the Navbar/Footer from `index.html` and building a responsive Grid of Tailwind cards. Each card will use `bg-gray-800` and `border-gray-700` to seamlessly match the current dark/premium aesthetic, displaying the character's image, stats badges, an audio sample player, and a high-contrast download button.

## 5. Verification Method
- **Extraction:** Open the resulting `voicebanks.json` to verify that each object contains `name`, `image_url`, `audio_url`, `download_link`, and `stats`.
- **UI Testing:** Open `/src/voicebank.html` in a web browser. Inspect the grid across different screen widths (mobile, tablet, desktop) to ensure the cards stack and scale correctly. Verify that hovering over cards and buttons triggers the correct Tailwind transitions.
