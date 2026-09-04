# Handoff Report: M1_Setup_Content Strategy

## Observation
- The project root `e:\All DELTA SYNTH Official Website` contains 6 Wix-exported `.html` files (e.g., `1._Main _ DELTA SYNTH.html`).
- The `Picture File` directory contains two subdirectories: `A Full Body Picture` and `A Profile for Singer Picture`, which contain 55 high-quality `.png` image files each, corresponding to character voicebanks (e.g., `Azaya Aika.png`).
- The `*_files` directories contain mostly downloaded JS bundles, minified CSS, and scaled/cropped versions of images used by the Wix renderer.
- `PROJECT.md` specifies building a multi-page static website (HTML5, CSS3, Vanilla JS) using Tailwind CSS.
- `SCOPE.md` indicates Milestone 1 requires extracting raw text/images, setting up `/src` and `/assets` directories, `package.json` for a local dev server, and a basic `css/styles.css` with Tailwind config.

## Logic Chain
1. **Image Extraction**: Because the `Picture File` directory already holds the pristine, high-resolution source images organized neatly, we do NOT need to scrape images from the HTML files. We can simply copy the contents of `Picture File` into our new `/assets/images/voicebanks/` structure.
2. **Text Extraction**: The 6 `.html` files are heavily bloated with Wix's proprietary tags and inline styles. A Python script using `BeautifulSoup` is the most efficient way to strip HTML tags and extract readable text (from `<p>`, `<h1>` to `<h6>`, and `<span>`) into a structured JSON or Markdown file in `/assets/data/`.
3. **Directory Setup**: Following `PROJECT.md`, the root should have a clear separation of concerns: `/src` for source code (HTML, CSS, JS) and `/assets` for media and extracted data.
4. **Dev Server**: A standard `package.json` utilizing the `serve` npm package will fulfill the requirement for a local dev server seamlessly.
5. **Tailwind & CSS**: Given the project is a simple static site and needs rapid, modern styling, setting up Tailwind CSS via the official CLI (with a `tailwind.config.js`) will allow generation of a minimized `src/css/styles.css` containing shared utility classes.

## Caveats
- Text extraction via BeautifulSoup might pull in hidden Wix UI text (e.g., "Skip to Main Content", "Login"). The implementer will need to manually clean the resulting `content.json` to keep only the actual website copy.
- The implementer must ensure Python and `beautifulsoup4` are installed to run the extraction script, or alternatively use Node.js (`cheerio`) if they prefer sticking to the JS ecosystem.

## Conclusion
**Recommended Strategy for Worker:**

1. **Directories**: Create `/src/css`, `/src/js`, `/assets/images/voicebanks/full`, `/assets/images/voicebanks/profile`, and `/assets/data`.
2. **Images**: Copy `Picture File\A Full Body Picture\*` to `/assets/images/voicebanks/full/` and `Picture File\A Profile for Singer Picture\*` to `/assets/images/voicebanks/profile/`.
3. **Text Extraction Script**: Write and execute a Python script (`extract.py`) using `bs4` to parse the 6 `.html` files. Extract `tag.get_text(strip=True)` for `['h1','h2','h3','h4','h5','h6','p']` and save to `/assets/data/content.json`.
4. **Package & Server**: Run `npm init -y`, install dependencies (`npm i -D serve tailwindcss`), and add `"start": "serve ./src"` and `"build:css": "tailwindcss -i ./src/css/input.css -o ./src/css/styles.css"` to `package.json` scripts.
5. **Tailwind Setup**: Run `npx tailwindcss init`. Configure it to scan `./src/**/*.html`. Create `./src/css/input.css` with Tailwind directives (`@tailwind base; @tailwind components; @tailwind utilities;`) and define shared CSS variables/classes there.

## Verification Method
1. Verify `content.json` exists in `/assets/data/` and contains readable text.
2. Verify images are present in `/assets/images/voicebanks/`.
3. Run `npm run start` and ensure the local server is hosted correctly.
4. Run `npm run build:css` and verify `src/css/styles.css` is generated without errors.
