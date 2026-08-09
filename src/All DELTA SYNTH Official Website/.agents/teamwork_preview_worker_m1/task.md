# M1_Setup_Content Implementation Task

## Objective
Execute the strategy for Milestone 1 (M1_Setup_Content) for the DELTA SYNTH Redesign.

## Instructions
1. **Directories**: Create `/src/css`, `/src/js`, `/assets/images/voicebanks/full`, `/assets/images/voicebanks/profile`, and `/assets/data`.
2. **Images**: Copy `Picture File\A Full Body Picture\*` to `/assets/images/voicebanks/full/` and `Picture File\A Profile for Singer Picture\*` to `/assets/images/voicebanks/profile/`. (In Powershell, use `Copy-Item`). Also copy any useful background images from the `*_files` directories if needed.
3. **Text Extraction**: Write and execute a Python script (`extract.py` using `beautifulsoup4`) or Node script (`cheerio`) to parse the 6 `.html` files. Extract text from `h1`-`h6` and `p` tags. Save to `/assets/data/content.json`. Manually edit the JSON file to remove Wix boilerplate UI text (e.g., "Skip to Main Content").
4. **Package & Server**: Run `npm init -y`. Install dependencies (`npm i -D serve tailwindcss`). Add `"start": "serve ./src"` and `"build:css": "tailwindcss -i ./src/css/input.css -o ./src/css/styles.css"` to `package.json` scripts.
5. **Tailwind Setup**: Run `npx tailwindcss init`. Configure `tailwind.config.js` to scan `./src/**/*.html`. Create `./src/css/input.css` with Tailwind directives (`@tailwind base; @tailwind components; @tailwind utilities;`) and define shared CSS variables/classes there. Run the build command once.

## Important Constraints
- **MANDATORY INTEGRITY WARNING**: DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.
- You must execute the commands (like npm init, script execution, etc.). Use `run_command` tool.
- Provide your handoff.md with verification results. Message me when done.
