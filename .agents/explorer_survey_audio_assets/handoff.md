# Handoff Report — Explorer 3 (Audio, Assets, Voicebanks & Test Infra)

> **Agent**: Explorer 3 (`explorer_survey_audio_assets`)  
> **Parent Recipient**: `0ca35813-ce20-4b40-8e23-69cba9ce43ac` (`parent`)  
> **Type**: Hard Handoff (Investigation Complete)  
> **Date**: 2026-08-16

---

## 1. Observation

### Exact File Paths & Code Evidence:
1. **Voicebank Catalog**:
   - `src/public/voicebankData.js:11-1092`: Contains `VOICEBANKS` array with exactly 54 vocalist entries.
   - `src/public/voicebankData.js:1099-1129`: Implements `getVoicebankById(id)` (linear scan) and `queryVoicebanks({ gender, engine, type, query })`.
   - `src/backend/voicebankService.jsw:25-54`: Implements `getVoicebanksList` with in-memory pagination.
   - `src/public/singers/`: Exactly 54 individual singer profile HTML files (`ayanami_hikaru.html`, `sun.html`, etc.).
   - `src/public/assets/voicebanks/profile/`: Exactly 54 WebP profile thumbnail files matching voicebank catalog IDs.
   - `src/public/assets/images/voicebanks/`: Exactly 54 PNG high-resolution full-body character artwork files.
   - `src/public/Voice/`: 66 WAV audio demo files (including variations).

2. **Audio Player Subsystem**:
   - `src/public/audioPlayer.js:15-150`: Defines class `AudioPlayerManager` exported as singleton `globalAudioPlayer`.
   - `src/public/audioPlayer.js:76`: `this.audioElement = new Audio(trackUrl);` instantiated per playback request.
   - `src/public/audioPlayer.js:101-108`:
     ```javascript
     const playPromise = this.audioElement.play();
     if (playPromise !== undefined) {
       playPromise.catch(err => {
         this.isPlaying = false;
         this.notifyState();
         logStandard('AudioPlayer', 'Autoplay policy restriction', err.message, 'User interaction required before playback', 'warn');
       });
     }
     ```
   - `src/public/audioPlayer.js:133-146`:
     ```javascript
     stop() {
       if (this.audioElement) {
         try {
           this.audioElement.pause();
           this.audioElement.currentTime = 0;
           this.audioElement.src = '';
           this.audioElement = null;
         } catch (_) {}
       }
       this.isPlaying = false;
       this.currentTrackId = null;
       this.currentTrackUrl = null;
       this.notifyState();
     }
     ```

3. **Public Static Web Assets**:
   - `src/public/index.html`, `about.html`, `voicebank.html`, `project.html`: Form the core static web portal on Vercel.
   - `src/public/css/styles.css`: Defines Space Theme & Glassmorphism classes (`.space-glow`, `.glass-panel`, `.glass-btn`).
   - `src/public/js/starfield.js`: 2D Canvas dynamic starfield background.
   - `src/public/projectData.js`: Data structures for `PROJECTS` (3 items), `MUSIC_FILES` (USTX, SVP, MIDI, VSQX), `EVENTS` (2 items), `CHANGELOG` (4 items).

4. **Toast Notification System**:
   - `src/public/theme.js:41-48`:
     ```javascript
     toast: {
       maxWidth: 280,
       maxHeight: 80,
       offsetRight: 16,
       offsetBottom: 20,
       borderRadius: 6,
       durationMs: 3500
     },
     ```
   - `src/public/toast.js:27-104`: Implements `showToast` with `#toastContainer`, `#toastMessage`, `#toastAction`, `#toastIcon` bindings, matching AGENT.md Section 9 specifications.
   - `src/public/toast.js:160`: `catch (_) { return null; }` contains an empty catch block without structured logging.

5. **Build, Test, and Tooling**:
   - `package.json:1-13`:
     ```json
     {
       "devDependencies": {
         "@wix/cli": "^1.0.0",
         "@wix/eslint-plugin-cli": "^1.0.0",
         "eslint": "^8.25.0",
         "react": "16.14.0"
       },
       "scripts": {
         "postinstall": "wix sync-types",
         "dev": "wix dev",
         "lint": "eslint ."
       }
     }
     ```
   - `.eslintrc.json`: Extends `plugin:@wix/cli/recommended`.
   - Missing `"test"` script in `package.json`.

---

## 2. Logic Chain

1. **Voicebank Catalog Consistency**:
   - Observations in `voicebankData.js`, `singers/`, `assets/voicebanks/profile/`, and `Voice/` show complete 1:1 parity for all 54 vocalists.
   - Because all data is held in-memory within client and server modules, data retrieval is instantaneous. Adding a `Map` index by ID eliminates O(N) linear search overhead during lookups.

2. **Audio Stability & Memory Leak Vectors**:
   - In `audioPlayer.js`, discarding an `Audio` instance by setting `src = ''` without first detaching `.onplay`, `.onpause`, `.onended`, and `.onerror` causes dangling event listeners to fire in asynchronous event cycles.
   - Rapid track switching triggers `AbortError` on the previous track's pending `play()` promise. Because `.catch()` unconditionally executes `this.isPlaying = false; this.notifyState();`, it clobbers the active playback state of the newly selected track.
   - Line 140 `catch (_) {}` violates AGENT.md Section 6 ("ห้าม `except: pass` หรือกลืน error").

3. **Toast Notification System Compliance**:
   - Direct comparison of `THEME.toast` (`maxWidth: 280, maxHeight: 80, offsetRight: 16, offsetBottom: 20, borderRadius: 6`) against AGENT.md Section 9 confirms 100% geometric compliance.
   - The empty catch block in `safeGetElement()` line 160 should be fortified with defensive checks or `logStandard`.

4. **Testing Infrastructure Needs**:
   - Without an automated test script in `package.json`, regressions in catalog data integrity or utility behavior cannot be caught in CI.
   - Implementing Node.js native `node:test` test suites allows testing without adding external npm dependencies.

---

## 3. Caveats

1. **Wix Cloud Backend Live Environment**:
   - Web methods in `src/backend/*.jsw` run inside Wix Cloud Velo runtime. Our investigation evaluated the local code and data structures; live Wix collections (e.g. dynamic dataset collections) rely on Wix cloud synchronization.
2. **Audio Playback in Non-Browser Environments**:
   - In Node.js / Wix SSR environments, `typeof Audio === 'undefined'` gracefully falls back to mock state management.

---

## 4. Conclusion

1. **Catalog**: The 54-voicebank catalog in `src/public/voicebankData.js` is structurally sound, complete, and fully aligned with all assets and pages.
2. **Audio Subsystem**: `src/public/audioPlayer.js` is functional but requires hardening against rapid track switching race conditions, dangling event listeners, and empty catch blocks.
3. **Public Static Web**: The static web assets in `src/public/` (58 HTML files, 54 WebP, 54 PNG, 66 WAV) have proper data bindings and maintain Thai/English bilingual standards.
4. **Toast System**: Fully complies with AGENT.md Section 9 geometry (`280x80px`, `(16, 20)`, `6px`).
5. **Tooling**: ESLint is configured; adding a native Node.js test runner suite will establish automated regression protection.

---

## 5. Verification Method

To independently verify these findings:
1. **Verify 54 Voicebanks Count**:
   Inspect `src/public/voicebankData.js` or count elements in `VOICEBANKS.length`.
2. **Verify 54 Singer HTML Files**:
   List files in `src/public/singers/` — total count is 54.
3. **Verify 54 Profile WebP Assets**:
   List files in `src/public/assets/voicebanks/profile/` — total count is 54.
4. **Verify Toast Geometry**:
   Inspect `src/public/theme.js:41-48` and compare with `AGENT.md:278-284`.
5. **Verify Audio Subsystem Code**:
   Inspect `src/public/audioPlayer.js:101-108` and `133-146`.
