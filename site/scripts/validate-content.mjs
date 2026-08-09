import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = readFileSync(join(root, "content", "voicebanks.ts"), "utf8");
const slugs = [...source.matchAll(/\bslug:\s*"([a-z0-9-]+)"/g)].map((match) => match[1]);
const unique = new Set(slugs);
const errors = [];

if (slugs.length !== 54) errors.push(`Expected 54 voicebanks; found ${slugs.length}.`);
if (unique.size !== slugs.length) errors.push("Duplicate voicebank slugs detected.");

for (const slug of unique) {
  for (const kind of ["profile", "full"]) {
    const asset = join(root, "public", "assets", "voicebanks", kind, `${slug}.webp`);
    if (!existsSync(asset)) errors.push(`Missing ${kind} image for ${slug}.`);
  }
}

const audioPaths = [...source.matchAll(/src:\s*`\/assets\/audio\/\$\{file\}\.mp3`/g)];
if (!audioPaths.length) errors.push("Audio mapping template is missing.");

if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Validated ${slugs.length} unique voicebanks and canonical image pairs.`);
}
