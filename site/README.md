# DELTA SYNTH Digital Vocal Archive

Production Next.js App Router website for DELTA SYNTH Studio. The site consolidates the verified Wix-era editorial content, 54 singer image sets, 66 local demos, nine project families, the resource index, and honest pending states for data that cannot be verified from the static archive.

## Local development

Requirements:

- Node.js 20+
- npm
- FFmpeg on `PATH` when refreshing image/audio assets

```powershell
npm install
npm run dev
```

Open `http://localhost:3000`.

## Data and asset refresh

The checked-in runtime content is in `content/`. The production build never reads outside this `site/` folder.

To rebuild optimized assets from the preserved repository sources:

```powershell
npm run prepare:assets
npm run validate:data
```

`prepare:assets` reads:

- `../src/pages/assets/images/voicebanks/profile`
- `../src/pages/assets/images/voicebanks/full`
- `../src/public/Voice`

It emits canonical WebP images and 96 kbps MP3 previews under `public/assets/`. Original files remain untouched.

## Verification and production build

```powershell
npm run typecheck
npm run build
npm run verify
```

The 54 voicebank profile pages are statically generated. Search and filtering run client-side; audio never autoplays.
Set `NEXT_PUBLIC_SITE_URL` to the final production origin before the release build so canonical sitemap and OpenGraph URLs use the deployed domain.

## OpenNext worker package

```powershell
npm run build:worker
```

This uses `@opennextjs/cloudflare` and writes the worker bundle to `.open-next/` using `wrangler.jsonc`. The existing `.openai/hosting.json` belongs to the Sites project and must not be regenerated or edited.

## Editorial policy

Original saved Wix pages and creator/voicer attribution are the primary references. Missing biographies, events, and download targets are intentionally shown as `อยู่ระหว่างรวบรวม / To be confirmed` or `VERIFYING`; no `#` links, fake URLs, or generated biographies are published.

The public contact address is `delta.vocaloid09378@gmail.com`. The emergency/private address from the old archive is intentionally not promoted.
