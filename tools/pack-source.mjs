/**
 * pack-source.mjs
 * Tools/pack-source.mjs
 * Made And Checked By DELTA SYNTH & Gemini AI
 * Original by Patiphat Wongyai (Delta)
 * Revision: 1.0
 * Build Source Code Package Archive
 */

import { spawnSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

const rootDir = 'E:\\Program Developing\\DELTA_SYNTH-main';
const sevenZip = 'C:\\Program Files\\7-Zip\\7z.exe';
const exportDir = path.join(rootDir, 'Export The Project', '16.09.2026-18.46');
const sourceArchive = path.join(exportDir, 'DELTA_SYNTH-Source-Code-Version-1.01.01-Source Code.zip');

if (fs.existsSync(sourceArchive)) {
  fs.unlinkSync(sourceArchive);
}

console.log('Creating Source Code Archive (zip):', sourceArchive);

const srcArgs = [
  'a',
  '-tzip',
  '-mx=1', // Fast compression for source code to ensure quick, stable completion
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

const res = spawnSync(sevenZip, srcArgs, { stdio: 'inherit', cwd: rootDir });
console.log('Exit Code:', res.status);

if (res.status === 0) {
  console.log('[SUCCESS] Source code package created successfully!');
  const stats = fs.statSync(sourceArchive);
  console.log(`Size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
} else {
  console.error('[ERROR] Failed to create source code package.');
  process.exit(1);
}
