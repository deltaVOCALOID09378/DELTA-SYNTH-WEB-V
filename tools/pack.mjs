/**
 * pack.mjs
 * Tools/pack.mjs
 * Made And Checked By DELTA SYNTH & Gemini AI
 * Original by Patiphat Wongyai (Delta)
 * Revision: 1.0
 * Packaging and Archiving Script for Check-All-Fix-Clear-And-Pack
 */

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const timestamp = '16.09.2026-18.46';
const exportDir = path.join(rootDir, 'Export The Project', timestamp);

if (!fs.existsSync(exportDir)) {
  fs.mkdirSync(exportDir, { recursive: true });
}

const sevenZipPath = 'C:\\Program Files\\7-Zip\\7z.exe';
const programArchive = path.join(exportDir, 'DELTA_SYNTH-Program-Version-1.01.01.7z');
const sourceArchive = path.join(exportDir, 'DELTA_SYNTH-Source-Code-Version-1.01.01-Source Code.zip');

// Clean previous 0-byte or incomplete archives if any
for (const file of [programArchive, sourceArchive]) {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
  }
}

console.log('[1/2] Creating Program Package (7z)...');
const progArgs = [
  'a',
  '-t7z',
  '-mx=5',
  '-y',
  programArchive,
  path.join(rootDir, 'src', 'public'),
  path.join(rootDir, 'server.js'),
  path.join(rootDir, 'package.json'),
  path.join(rootDir, 'wrangler.toml'),
  path.join(rootDir, 'Cloudflare_Pages_Domain_Setup_Guide.md'),
  path.join(rootDir, 'tools')
];

const progRes = spawnSync(sevenZipPath, progArgs, { stdio: 'inherit' });
if (progRes.status !== 0) {
  console.error('[ERROR] 7z failed to create program archive. Exit code:', progRes.status);
  process.exit(1);
}

console.log('\n[2/2] Creating Source Code Package (zip)...');
const srcArgs = [
  'a',
  '-tzip',
  '-mx=5',
  '-y',
  sourceArchive,
  path.join(rootDir, 'src'),
  path.join(rootDir, 'tests'),
  path.join(rootDir, 'tools'),
  path.join(rootDir, 'History Editing'),
  path.join(rootDir, 'server.js'),
  path.join(rootDir, 'package.json'),
  path.join(rootDir, 'wrangler.toml'),
  path.join(rootDir, '*.md'),
  '-xr!node_modules',
  '-xr!.git',
  '-xr!.venv',
  '-xr!.tmp*',
  '-xr!Export The Project'
];

const srcRes = spawnSync(sevenZipPath, srcArgs, { stdio: 'inherit', cwd: rootDir });
if (srcRes.status !== 0) {
  console.error('[ERROR] 7z failed to create source archive. Exit code:', srcRes.status);
  process.exit(1);
}

console.log('\n======================================================');
console.log('[SUCCESS] Packaging completed successfully!');
console.log('Export Location:', exportDir);
for (const file of fs.readdirSync(exportDir)) {
  const filePath = path.join(exportDir, file);
  const stats = fs.statSync(filePath);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(` - ${file} (${sizeMB} MB, ${stats.size} bytes)`);
}
console.log('======================================================');
