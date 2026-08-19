# DELTA SYNTH — Audio, Assets, Voicebanks & Test Infrastructure Survey Report

> **Target Workspace**: `e:\Program Developing\DELTA_SYNTH-main`  
> **Standard Reference**: `AGENT.md` (Preserve → Strengthen → Optimize → Verify)  
> **Investigator**: Explorer 3 (Audio, Assets, Voicebanks & Test Infra)  
> **Date**: 2026-08-16

---

## 1. Executive Summary

This survey conducts an exhaustive, read-only architectural investigation into DELTA SYNTH's audio subsystem, the complete 54-voicebank catalog, static web assets, toast notification geometry, and development tooling.

### Key Discoveries:
1. **Voicebank Catalog (54 Singers)**: `src/public/voicebankData.js` defines an authoritative, in-memory catalog of 54 virtual vocalists. It is backed by `src/backend/voicebankService.jsw` for paginated queries and consumed by Velo pages (`All DELTA's Voicebank.acsro.js`, `All Callaboraion Voicebank_.aj73j.js`, `Main.ggt15.js`) and static HTML pages (`voicebank.html`, `singers/*.html`).
2. **Audio Subsystem (`src/public/audioPlayer.js`)**: Employs an event-driven singleton `AudioPlayerManager` with a `Set`-based publish-subscribe model. While lightweight and functional, we identified **three stability vectors**: (a) uncleaned event handlers on recycled `Audio` instances, (b) an empty `catch` block in `stop()` violating AGENT.md, and (c) an asynchronous promise race condition during rapid track switching where an aborted prior track can erroneously mute active playback.
3. **Public Assets & Static Architecture (`src/public/`)**: Contains 58 HTML files (4 main portal pages + 54 dedicated singer profile pages), 54 WebP profile thumbnails (~15–50 KB), 54 full-body PNG artworks, and 66 WAV audio demo files (~75 MB total). Bilingual English/Thai content is strictly preserved.
4. **Toast Notification System (`src/public/toast.js` & `theme.js`)**: Strictly complies with AGENT.md Section 9 geometry: maximum dimensions **280x80px**, bottom-right offset **(16, 20)**, corner radius **6px**, auto-dismiss duration 3500ms, and brand palette (`#CC2200`, `#1A1A1A`, `#F0F0F0`).
5. **Testing & Tooling (`package.json`, `.eslintrc.json`)**: Configured with ESLint 8.25.0 and Wix CLI plugins (`@wix/cli`, `@wix/eslint-plugin-cli`). Currently **lacks an automated unit/integration test runner** (`npm test` script is undefined in `package.json`).

---

## 2. Voicebank Catalog & State Management

### 2.1 Catalog Data Schema (`src/public/voicebankData.js`)
The voicebank database contains 54 distinct vocalist records structured with the following schema:

| Property | Type | Description | Example |
|---|---|---|---|
| `id` | `string` | Unique lowercase identifier | `'ayanami_hikaru'`, `'sun'`, `'kochujang'` |
| `name` | `string` | Primary English display name | `'Ayanami Hikaru'` |
| `nameTh` | `string` | Thai localized name | `'อายานามิ ฮิคารุ'` |
| `gender` | `string` | Vocal gender | `'Male'`, `'Female'` |
| `age` | `number` | Character age | `20`, `19`, `18` |
| `voicer` | `string` | Voicer / Creator credit | `'DELTA SYNTH'`, `'TangmoThipawan'` |
| `engine` | `string` | Vocal engine & method | `'UTAU / DiffSinger'`, `'UTAU CVVC / DiffSinger'` |
| `type` | `string` | Catalog classification | `'Official DELTA'`, `'Collaboration'` |
| `genre` | `string` | Primary musical genres | `'Pop / Rock / Anisong'` |
| `language` | `string` | Supported singing languages | `'Thai, Japanese, English'` |
| `status` | `string` | Availability status | `'Ready for Download'` |
| `image` | `string` | Relative path to WebP thumbnail | `'assets/voicebanks/profile/ayanami-hikaru.webp'` |
| `imageFull` | `string` | Relative path to PNG artwork | `'assets/images/voicebanks/Ayanami Hikaru.png'` |
| `audioSample` | `string` | Relative path to WAV preview | `'Voice/Ayanami Hikaru.wav'` |
| `detailUrl` | `string` | Relative path to static HTML profile | `'singers/ayanami_hikaru.html'` |
| `downloadUrl` | `string` | Google Drive / YouTube distribution URL | `'https://drive.google.com/drive/folders/...'` |
| `description` | `string` | Thai character biography & tone profile | Detailed narrative |
| `tags` | `Array<string>` | Search and classification tags | `['UTAU', 'DiffSinger', 'Official', 'Male', 'Pop']` |

### 2.2 Complete 54-Voicebank Verification Matrix

| # | ID | Name | Thai Name | Gender | Engine | Type | Audio Sample (WAV) | Profile Image (WebP) |
|---|---|---|---|---|---|---|---|---|
| 1 | `ayanami_hikaru` | Ayanami Hikaru | อายานามิ ฮิคารุ | Male | UTAU / DiffSinger | Official DELTA | `Voice/Ayanami Hikaru.wav` | `ayanami-hikaru.webp` |
| 2 | `sun` | SUN | ซัน | Male | UTAU CVVC / DiffSinger | Official DELTA | `Voice/SUN.wav` | `sun.webp` |
| 3 | `guren_kani` | Guren Kani | กุเร็น คานิ | Male | UTAU VCV / DiffSinger | Official DELTA | `Voice/Guren Kani.wav` | `guren-kani.webp` |
| 4 | `kochujang` | Kochujang | โคชูจัง | Female | UTAU CVVC / DiffSinger | Official DELTA | `Voice/Kochujang.wav` | `kochujang.webp` |
| 5 | `thitiya_anantanetr` | Thitiya Anantanetr | ธิติยา อนันตเนตร | Female | UTAU VCCV / DiffSinger | Official DELTA | `Voice/Thitiya.wav` | `thitiya-anantanetr.webp` |
| 6 | `arun_kamonlanetr` | Arun Kamonlanert | อรุณ กมลเนตร | Male | UTAU / DiffSinger | Official DELTA | `Voice/Arun Kamonlanetr.wav` | `arun-kamonlanert.webp` |
| 7 | `bew__powerine` | Bew Powerine | บิว พาวเวอร์ไรน์ | Female | UTAU CVVC / DiffSinger | Official DELTA | `Voice/Bew  Powerine.wav` | `bew-powerine.webp` |
| 8 | `ball_powerine` | Ball Powerine | บอล พาวเวอร์ไรน์ | Male | UTAU / DiffSinger | Official DELTA | `Voice/Ball Powerine.wav` | `ball-powerine.webp` |
| 9 | `beem_powerine` | Beem Powerine | บีม พาวเวอร์ไรน์ | Female | UTAU / DiffSinger | Official DELTA | `Voice/Beem Powerine.wav` | `beem-powerine.webp` |
| 10 | `chansamorn` | Chansamorn | จันทร์สมร | Female | UTAU VCV / DiffSinger | Official DELTA | `Voice/Chansamorn.wav` | `charnsamorn.webp` |
| 11 | `kikakowa_usagi` | Kikokawa Usagi | คิโคคาวะ อุซางิ | Female | UTAU CV / DiffSinger | Official DELTA | `Voice/Kikakowa Usagi.wav` | `kikokawa-usagi.webp` |
| 12 | `ahctan` | Ahctan | แอคตัน | Male | UTAU / DiffSinger | Collaboration | `Voice/Ahctan.wav` | `ahctan.webp` |
| 13 | `arzbtv` | ARZBTV | เออาร์แซดบีทีวี | Male | UTAU / DiffSinger | Collaboration | `Voice/ARZBTV.wav` | `arzbtv.webp` |
| 14 | `azaya_aika` | Azaya Aika | อาซายะ ไอกะ | Female | UTAU / DiffSinger | Collaboration | `Voice/Azaya Aika.wav` | `azaya-aika.webp` |
| 15 | `diwachi` | Diwachi | ดิวาชิ | Male | UTAU / DiffSinger | Collaboration | `Voice/Diwachi.wav` | `diwachi.webp` |
| 16 | `dokya` | Dokya | ดอกหญ้า | Female | UTAU / DiffSinger | Collaboration | `Voice/Dokya.wav` | `dokya.webp` |
| 17 | `fangyu` | FangYu | ฟางหยู | Male | UTAU / DiffSinger | Collaboration | `Voice/Fangyu.wav` | `fangyu.webp` |
| 18 | `felix` | Felix | ฟีลิกซ์ | Male | UTAU / DiffSinger | Collaboration | `Voice/Felix.wav` | `felix.webp` |
| 19 | `fellowwhite` | FellowWhite | เฟลโลว์ไวท์ | Male | UTAU / DiffSinger | Collaboration | `Voice/FellowWhite.wav` | `fellowwhite.webp` |
| 20 | `fuwari_bento` | Fuwari Bento | ฟุวาริ เบ็นโตะ | Female | UTAU / DiffSinger | Collaboration | `Voice/Fuwari Bento.wav` | `fuwari-bento.webp` |
| 21 | `haruhiko` | Haruhiko | ฮารุฮิโกะ | Male | UTAU / DiffSinger | Collaboration | `Voice/Haruhiko.wav` | `haruhiko.webp` |
| 22 | `helen` | Helen | เฮเลน | Female | UTAU / DiffSinger | Collaboration | `Voice/Helen.wav` | `helen.webp` |
| 23 | `ibara_kouya` | Ibara Kouya | อิบาระ โคยะ | Male | UTAU / DiffSinger | Collaboration | `Voice/Ibara Kouya.wav` | `ibara-kouya.webp` |
| 24 | `jonu` | Jonu | โจนุ | Male | UTAU / DiffSinger | Collaboration | `Voice/Jonu.wav` | `jonu.webp` |
| 25 | `kangfu` | KangFu | กังฟู | Male | UTAU / DiffSinger | Collaboration | `Voice/KangFu.wav` | `kangfu.webp` |
| 26 | `kira` | Kira | คิระ | Female | UTAU / DiffSinger | Collaboration | `Voice/Kira.wav` | `kira.webp` |
| 27 | `koizumi_satoru` | Koizumi Satoru | โคอิซูมิ ซาโตรุ | Male | UTAU / DiffSinger | Collaboration | `Voice/Koizumi Satoru.wav` | `koizumi-satoru.webp` |
| 28 | `mairu_maishi` | Mairu Maishi | ไมรุ ไมชิ | Female | UTAU / DiffSinger | Collaboration | `Voice/Mairu Maishi.wav` | `mairu-maishi.webp` |
| 29 | `mayuree` | Mayuree | มยุรี | Female | UTAU / DiffSinger | Collaboration | `Voice/Mayuree.wav` | `mayuree.webp` |
| 30 | `miro` | Miro | มิโร่ | Male | UTAU / DiffSinger | Collaboration | `Voice/Miro.wav` | `miro.webp` |
| 31 | `mochiai` | Mochiai | โมจิไอ | Female | UTAU / DiffSinger | Collaboration | `Voice/Shiroino Mochi.wav` | `mochiai.webp` |
| 32 | `mojine_sora` | Mojine Sora | โมจิเนะ โซระ | Female | UTAU / DiffSinger | Collaboration | `Voice/Mojine Sora.wav` | `mojine-sora.webp` |
| 33 | `namphueng` | Namphueng | น้ำผึ้ง | Female | UTAU / DiffSinger | Collaboration | `Voice/Namphueng.wav` | `namphueng.webp` |
| 34 | `narisa` | Narisa | นริศา | Female | UTAU / DiffSinger | Collaboration | `Voice/Narisa.wav` | `narisa.webp` |
| 35 | `okaminari_tanda` | Okaminari Tanda | โอกามินาริ ทันดะ | Male | UTAU / DiffSinger | Collaboration | `Voice/Natsune Tanda.wav` | `okaminari-tanda.webp` |
| 36 | `onika` | Onika | โอนิกะ | Female | UTAU / DiffSinger | Private DELTA | `Voice/Onika.wav` | `onika.webp` |
| 37 | `quint` | Quint | ควินท์ | Male | UTAU / DiffSinger | Collaboration | `Voice/Quint.wav` | `quint.webp` |
| 38 | `relven` | RelVeN | เรลเวน | Male | UTAU / DiffSinger | Collaboration | `Voice/Relven.wav` | `relven.webp` |
| 39 | `root` | Root | รูท | Male | UTAU / DiffSinger | Collaboration | `Voice/Root.wav` | `root.webp` |
| 40 | `sakultala` | Sakultala | ศกุนตลา | Female | UTAU / DiffSinger | Collaboration | `Voice/Sakultala1.wav` | `sakultala.webp` |
| 41 | `saphire_blue` | Saphire Blue | แซฟไฟร์ บลู | Female | UTAU / DiffSinger | Collaboration | `Voice/Saphire Blue.wav` | `saphire-blue.webp` |
| 42 | `savanna` | Savanna | ซาวันนา | Female | UTAU / DiffSinger | Collaboration | `Voice/Savanna.wav` | `savanna.webp` |
| 43 | `shiroino_mochi` | Shiroino Mochi | ชิโรอิโนะ โมจิ | Female | UTAU / DiffSinger | Collaboration | `Voice/Shiroino Mochi.wav` | `shiroino-mochi.webp` |
| 44 | `sriphan` | Sriphan | ศรีพรรณ | Female | UTAU / DiffSinger | Collaboration | `Voice/SRIPHAN.wav` | `sriphan.webp` |
| 45 | `tackpee` | Tackpee | แท็คพี | Male | UTAU / DiffSinger | Collaboration | `Voice/Tackpee.wav` | `tackpee.webp` |
| 46 | `tenshi_saburo` | Tenshi Saburo | เทนชิ ซาบุโร่ | Male | UTAU / DiffSinger | Collaboration | `Voice/Tenshi Saburo.wav` | `tenshi-saburo.webp` |
| 47 | `tom` | Tom | ทอม | Male | UTAU / DiffSinger | Collaboration | `Voice/Tom.wav` | `tom.webp` |
| 48 | `uchu_sutori` | Uchu Sutori | อูชู สุโทริ | Female | UTAU / DiffSinger | Collaboration | `Voice/Uchu Sutori.wav` | `uchu-sutori.webp` |
| 49 | `utashi_nara` | Utashi Nara | อุตะชิ นารา | Female | UTAU / DiffSinger | Private DELTA | `Voice/Utashi Nara.wav` | `utashi-nara.webp` |
| 50 | `yamada_kimada` | Yamada Kimada | ยามาดะ คิมาดะ | Male | UTAU / DiffSinger | Collaboration | `Voice/Yamada Kimada1.wav` | `yamada-kimada.webp` |
| 51 | `yamada_satoru` | Yamada Satoru | ยามาดะ ซาโตรุ | Male | UTAU / DiffSinger | Collaboration | `Voice/Yamada Satoru.wav` | `yamada-satoru.webp` |
| 52 | `yamada_takeshi` | Yamada Takeshi | ยามาดะ ทาเคชิ | Male | UTAU / DiffSinger | Collaboration | `Voice/Yamada Takeshi.wav` | `yamada-takeshi.webp` |
| 53 | `yokuatsu_takuto` | Yokuatsu Takuto | โยคุอัตสึ ทาคุโตะ | Male | UTAU / DiffSinger | Official DELTA | `Voice/Yokuatsu Takuto.wav` | `yokuatsu-takuto.webp` |
| 54 | `yuuya_sato` | Yuuya Sato | ยูยะ ซาโต้ | Male | UTAU / DiffSinger | Official DELTA | `Voice/Yuuya Sato.wav` | `yuuya-sato.webp` |

### 2.3 Backend Service Caching & Efficiency (`src/backend/voicebankService.jsw`)
- **Execution Mode**: In-memory static queries via exported JSW web methods (`getVoicebanksList`, `getSingerDetails`, `getVoicebankStats`).
- **Pagination & Bounds**: Safe pagination implemented (`Math.max(1, page)`, `Math.min(100, pageSize)`).
- **Optimization Opportunities**:
  - `queryVoicebanks` does a full linear scan over all 54 items for each filter operation. While 54 items execute in <0.2ms, pre-computing a lookup `Map<string, Voicebank>` by ID inside `voicebankData.js` improves `getVoicebankById` from O(N) to O(1).
  - Search query operations in `queryVoicebanks` lowercases strings on each iteration. In hot loops or continuous debounced input typing, memoization or token-indexed search improves throughput.

---

## 3. Audio Player Subsystem Analysis (`src/public/audioPlayer.js`)

### 3.1 Architecture Overview
The audio subsystem is encapsulated within `AudioPlayerManager`, instantiated and exported as a global singleton `globalAudioPlayer`:

```text
[Velo Page / UI Button Click]
             │
             ▼
   globalAudioPlayer.play(trackId, trackUrl)
             │
             ├─► this.stop() [Reset prior audio & state]
             ├─► new Audio(trackUrl) [Instantiate HTML5 Audio]
             ├─► Bind .onplay, .onpause, .onended, .onerror
             ├─► audioElement.play() [Returns Promise]
             │
             ▼
   notifyState({ isPlaying, currentTrackId, currentTrackUrl })
             │
             ├─► masterPage.js (Update #globalAudioDock title & play/pause icon)
             └─► Active Page (Update UI indicators & toast notifications)
```

### 3.2 Stability, Error Handling & Memory Leak Vectors

#### Issue 1: Event Listener Retention on Discarded `Audio` Instances
- **Location**: `src/public/audioPlayer.js:133-146` (`stop()` method)
- **Observation**:
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
  ...
  ```
- **Risk**: Setting `this.audioElement.src = ''` triggers an asynchronous `error` or `pause` event in Blink/WebKit engines. Because `.onerror`, `.onpause`, `.onplay`, and `.onended` are not nulled out (`null`) before clearing `src`, the discarded instance's event handler executes in the background and can invoke `notifyState()` on an already destroyed audio context.
- **Remedy**: Explicitly detach all event handlers (`this.audioElement.onplay = null; this.audioElement.onpause = null; this.audioElement.onended = null; this.audioElement.onerror = null;`) prior to resetting `.src` and nulling the reference.

#### Issue 2: Empty Catch Block Violating AGENT.md
- **Location**: `src/public/audioPlayer.js:140`
- **Observation**: `catch (_) {}` swallows potential exceptions during audio teardown without logging.
- **Remedy**: Replace with structured logging: `logStandard('AudioPlayer', 'Audio cleanup', err.message, 'Verify audio element state', 'warn');`.

#### Issue 3: Asynchronous Promise Race Condition during Rapid Track Switching
- **Location**: `src/public/audioPlayer.js:101-108`
- **Observation**:
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
- **Scenario**: When a user clicks Track A and then immediately clicks Track B:
  1. Track A calls `play()`, initiating `audioA.play()`.
  2. Before `playPromiseA` resolves, Track B is triggered. `stop()` clears `audioA`.
  3. Browser aborts Track A, causing `playPromiseA` to reject with `AbortError: The play() request was interrupted by a new load request.`
  4. The rejection callback for Track A executes *after* Track B has begun.
  5. The callback sets `this.isPlaying = false` and broadcasts `notifyState()`, falsely putting the UI in a paused/stopped state while Track B is actually playing.
- **Remedy**: Track a playback generation token (e.g. `this.currentPlayToken = Symbol()`) or guard with `if (this.currentTrackId !== trackId) return;` inside the `.catch()` block.

---

## 4. Public Assets & Static Web Architecture (`src/public/`)

### 4.1 File Inventory

```text
src/public/
├── 1._Main _ DELTA SYNTH.html ... 6._Events _ deltasynthstudio.html (Legacy Scraped HTML)
├── index.html                                (Vercel Production Main Portal)
├── about.html                                (Vercel Production About Page)
├── voicebank.html                            (Vercel Production Catalog Hub)
├── project.html                              (Vercel Production Projects Hub)
├── singers/                                  (54 Vocalist Profile HTML Files)
│   ├── ayanami_hikaru.html
│   ├── sun.html
│   └── ... (54 files total)
├── Voice/                                    (66 WAV Audio Samples, ~75 MB total)
│   ├── Ayanami Hikaru.wav
│   ├── SUN.wav
│   └── ... (66 files total)
├── assets/
│   ├── data/content.json                     (Bilingual Scraped Strings & Metadata)
│   ├── voicebanks/profile/                   (54 WebP Profile Images, ~1.5 MB total)
│   └── images/voicebanks/                    (54 Full Body PNG Artworks, ~100 MB total)
├── css/
│   └── styles.css                            (Tailwind CSS + Space Theme & Glassmorphism)
├── js/
│   └── starfield.js                          (Space Theme 2D Canvas Star Animation)
├── audioPlayer.js                            (Global Audio State Manager)
├── projectData.js                            (Projects, Music Files, Events, Changelog)
├── theme.js                                  (Design System & Branding Constants)
├── toast.js                                  (Toast Notification Controller)
├── utils.js                                  (Universal Helpers & $wSafely)
├── vercel.json                               (Static Routing, Headers & Singer Rewrites)
└── wixPageTemplate.js                        (Page Script Boilerplate)
```

### 4.2 Resource Consistency & Asset Bindings
- **Bilingual Typographic Harmony**: Consistent integration of `Kanit` (Thai) and `Inter` (English) in `index.html`, `about.html`, `voicebank.html`, `project.html`, and all 54 `singers/*.html` pages.
- **Image Formats**:
  - WebP format used for card grids and thumbnails (fast load, ~25 KB average).
  - PNG format used for full-body portraits and detailed character views.
- **Audio Assets**: 66 WAV files in `src/public/Voice/`. Audio files contain alternate variations for select singers (e.g., `Ayanami Kyoko2.wav`, `Beem2.wav`, `Kochujang2.wav`, `Sakultala2.wav`, `Yamada Takeshi2.wav`, `Yokuatsu Takuto2.wav`).

---

## 5. Toast Notification System Audit (`src/public/toast.js` & `theme.js`)

### 5.1 Geometry Compliance Checklist (against AGENT.md Section 9)

| Parameter | AGENT.md Standard | Codebase Value (`THEME.toast` / `toast.js`) | Compliance |
|---|---|---|---|
| **Max Dimensions** | Max `280x80px` | `maxWidth: 280`, `maxHeight: 80` | ✅ PASS |
| **Placement Offset** | Bottom-Right `(16, 20)` | `offsetRight: 16`, `offsetBottom: 20` | ✅ PASS |
| **Corner Radius** | `6px` | `borderRadius: 6` | ✅ PASS |
| **Font Family** | `Leelawadee UI` | `THEME.fonts.primary: 'Leelawadee UI, Kanit, Inter, sans-serif'` | ✅ PASS |
| **Primary / Error Color** | `#CC2200` | `THEME.colors.primary: '#CC2200'` | ✅ PASS |
| **Hover Color** | `#FF4422` | `THEME.colors.primaryHover: '#FF4422'` | ✅ PASS |
| **Pressed Color** | `#991100` | `THEME.colors.primaryPressed: '#991100'` | ✅ PASS |
| **Background Color** | `#1A1A1A` | `THEME.colors.bgDark: '#1A1A1A'` | ✅ PASS |
| **Text Color** | `#F0F0F0` | `THEME.colors.textLight: '#F0F0F0'` | ✅ PASS |
| **Actionable Content** | Short, clear, next step | Implemented with `message` and `actionText` | ✅ PASS |

### 5.2 Toast Functional API & Implementation
- `showToast({ message, actionText, type, duration, onAction })`: Core invocation method.
- `toastSuccess(msg, actionText = 'เรียบร้อย')`
- `toastError(msg, actionText = 'ลองใหม่อีกครั้ง')`
- `toastWarning(msg, actionText = 'โปรดตรวจสอบ')`
- `toastInfo(msg, actionText = '')`
- Auto-dismiss: Clearable timeout via `activeToastTimeout = setTimeout(hideToast, duration)`.
- Defensive check in `safeGetElement`: Gracefully returns `null` if element is absent from page canvas.

---

## 6. Build, Test, and Tooling Infrastructure

### 6.1 Tooling Inventory (`package.json`)
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

### 6.2 Linter Configuration (`.eslintrc.json`)
```json
{
  "extends": ["plugin:@wix/cli/recommended"]
}
```

### 6.3 Test Harness Gap Analysis
1. **No Automated Test Script**: `package.json` contains no `"test"` entry in `"scripts"`. Running `npm test` fails with missing script error.
2. **Test Artifact Present**: `src/public/test-results/.last-run.json` indicates an earlier execution was recorded.
3. **Recommended Test Suite Architecture**:
   - Create a lightweight test runner using Node.js built-in `node:test` and `node:assert` (zero extra dependencies required) or Jest.
   - Test suites to implement:
     - `voicebankData.test.js`: Verifies catalog contains exact 54 items, all IDs unique, all image/audio paths non-empty, and `queryVoicebanks` filters accurately.
     - `audioPlayer.test.js`: Verifies subscription notifications, play/pause state transitions, and stop cleanup.
     - `toast.test.js`: Verifies geometry tokens and toast payload normalization.
     - `utils.test.js`: Verifies `$wSafely`, `debounce`, `throttle`, `formatDateThai`, `sanitizeInput`, and `logStandard`.

---

## 7. Actionable Recommendations & Prioritized Roadmap

| Priority | Component | Issue / Opportunity | Recommended Action |
|---|---|---|---|
| **High** | `src/public/audioPlayer.js` | Rapid track switching race condition & uncleaned event listeners | Add play token check in `.catch()`, explicitly null event handlers on stop, replace `catch (_) {}` with `logStandard`. |
| **High** | `src/public/toast.js` | Empty catch block in `safeGetElement()` | Ensure no swallowed exceptions per AGENT.md Section 6. |
| **Medium** | `src/public/voicebankData.js` | Linear lookup in `getVoicebankById` | Pre-build an in-memory `Map` index by ID for O(1) retrieval. |
| **Medium** | `package.json` | Missing `test` script | Add `"test": "node --test tests/**/*.test.js"` or test script covering core public data & utils. |
| **Low** | `src/public/singers/*.html` | Large uncompressed PNG images (up to 13MB) | Ensure WebP versions are used for mobile viewports and add `<link rel="preload">` for primary hero images. |

---

*Report prepared and certified according to DELTA SYNTH AGENT.md standards.*
