# Observation
1. The project requires transitioning from a Wix export to a modern static HTML/CSS/JS site (`PROJECT.md`).
2. There are 6 main Wix-exported HTML files in the root directory (e.g., `1._Main _ DELTA SYNTH.html`, `2._About US _ DELTA SYNTH.html`).
3. Each HTML file has an associated `*_files` directory containing heavily hashed assets and scripts.
4. There is also a `Picture File` directory containing categorized images (`A Full Body Picture`, `A Profile for Singer Picture`).
5. The Wix HTML files are highly obfuscated with complex React/Thunderbolt minified bundles and generic `<span>`/`<div>` structures, making raw text extraction non-trivial.

# Logic Chain
1. To satisfy M1_Setup_Content (`SCOPE.md`), we must create the `/src` and `/assets` directories.
2. A `package.json` needs to be initialized with a local dev server (e.g., `serve`) to fulfill the server script requirement.
3. A shared `src/css/styles.css` needs to be created to serve as the baseline for custom styling, while Tailwind CSS can be integrated via CDN within the HTML head.
4. Because the Wix HTML files are cluttered with boilerplate, manually copying text is tedious, but script-based extraction might pull in irrelevant UI text. A Node.js (`cheerio`) or Python (`BeautifulSoup`) script is recommended to extract text blocks (`<p>`, `<h1>`-`<h6>`) into `/assets/data/content.json`.
5. Images from `Picture File` and `*_files` should be consolidated into `/assets/images`. A script can copy them, or they can be moved manually given the visual nature of the site.

# Caveats
1. Scripted text extraction from Wix exports will likely include navigation links, footer text, and generic UI strings. The worker will need to manually clean the resulting JSON/Markdown data.
2. Image filenames in `*_files` are hashed (e.g., `11062b_...~mv2.png`). It is highly recommended to rename them to semantic names (e.g., `hero-banner.png`, `voicebank-avatar.png`) during or after extraction.
3. Tailwind CDN is easiest for static HTML. If a local build is preferred later, it will require adding `tailwindcss` to `package.json` and a build script. For M1, CDN is acceptable per `PROJECT.md`.

# Conclusion
The worker agent should execute the following specific strategy:
1. **Scaffold Directories**: `mkdir -p src/css src/js assets/images assets/data`
2. **Setup Dev Server**: Run `npm init -y` and `npm install serve --save-dev`. Add `"start": "serve ."` or `"start": "serve src"` to `package.json` scripts.
3. **Setup CSS**: Create `src/css/styles.css` with generic reset/base styles. Note that Tailwind will be imported via `<script src="https://cdn.tailwindcss.com"></script>` in the HTML files.
4. **Extraction Script**: Write a Node.js script (using `cheerio`) or Python script (using `BeautifulSoup`) to:
   - Loop through the 6 `*.html` files.
   - Extract text from heading and paragraph tags and save it to `assets/data/extracted_content.json`.
   - Copy all images (`.png`, `.jpg`, etc.) from the `*_files` and `Picture File` directories into `assets/images`.
5. **Manual Fallback**: If the script yields too much garbage text, run a script to just consolidate the images, and manually copy/paste the necessary text by opening the HTML files in a browser.

# Verification Method
1. Verify the directory structure exists (`/src/css/styles.css`, `/assets/images`, `/assets/data`).
2. Verify `package.json` exists with the `serve` dependency and `start` script.
3. Run `npm start` and ensure a local server hosts the directory.
4. Check `assets/data/` for the extracted content files and `assets/images/` for the consolidated image files.
