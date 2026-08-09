import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, statSync } from "node:fs";
import { basename, dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repositoryRoot = resolve(siteRoot, "..");
const voicebankAssets = join(repositoryRoot, "src", "pages", "assets", "images", "voicebanks");
const audioSource = join(repositoryRoot, "src", "public", "Voice");

const outputProfile = join(siteRoot, "public", "assets", "voicebanks", "profile");
const outputFull = join(siteRoot, "public", "assets", "voicebanks", "full");
const outputAudio = join(siteRoot, "public", "assets", "audio");

for (const directory of [outputProfile, outputFull, outputAudio]) mkdirSync(directory, { recursive: true });

const imageAliases = new Map([
  ["achtan", "ahctan"],
  ["arun-kamonlanetr", "arun-kamonlanert"],
  ["chansamorn", "charnsamorn"],
  ["kikakowa-usagi", "kikokawa-usagi"],
  ["quint-new", "quint"],
  ["tenshio-saburo", "tenshi-saburo"]
]);

function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/\.[^.]+$/, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function imageSlug(filename) {
  const slug = slugify(filename);
  return imageAliases.get(slug) ?? slug;
}

function runFfmpeg(args) {
  execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit" });
}

function convertImages(sourceDirectory, outputDirectory, maxWidth) {
  for (const filename of readdirSync(sourceDirectory).filter((name) => extname(name).toLowerCase() === ".png")) {
    const source = join(sourceDirectory, filename);
    const target = join(outputDirectory, `${imageSlug(filename)}.webp`);
    if (statSync(source).mtimeMs <= (statSync(target, { throwIfNoEntry: false })?.mtimeMs ?? 0)) continue;
    runFfmpeg(["-i", source, "-vf", `scale=min(${maxWidth}\\,iw):-2`, "-c:v", "libwebp", "-quality", "78", "-compression_level", "2", "-threads", "0", target]);
  }
}

function audioSlug(filename) {
  const stem = basename(filename, extname(filename)).replace(/(\d+)$/, "-$1");
  return slugify(stem);
}

function convertAudio() {
  for (const filename of readdirSync(audioSource).filter((name) => extname(name).toLowerCase() === ".wav")) {
    const source = join(audioSource, filename);
    const target = join(outputAudio, `${audioSlug(filename)}.mp3`);
    if (statSync(source).mtimeMs <= (statSync(target, { throwIfNoEntry: false })?.mtimeMs ?? 0)) continue;
    runFfmpeg(["-i", source, "-map_metadata", "-1", "-vn", "-codec:a", "libmp3lame", "-b:a", "96k", "-ar", "44100", target]);
  }
}

convertImages(join(voicebankAssets, "profile"), outputProfile, 600);
convertImages(join(voicebankAssets, "full"), outputFull, 900);
convertAudio();

console.log(`Prepared ${readdirSync(outputProfile).length} profile images, ${readdirSync(outputFull).length} full-body images, and ${readdirSync(outputAudio).length} audio demos.`);
