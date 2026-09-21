/**
 * verify-archives.mjs
 * Tools/verify-archives.mjs
 * Made And Checked By DELTA SYNTH & Gemini AI
 * Original by Patiphat Wongyai (Delta)
 * Revision: 1.2
 * Streaming Archive Integrity Verification Script
 */

import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

const rootDir = 'E:\\Program Developing\\DELTA_SYNTH-main';
const sevenZip = 'C:\\Program Files\\7-Zip\\7z.exe';
const exportDir = path.join(rootDir, 'Export The Project', '16.09.2026-18.46');

const p1 = path.join(exportDir, 'DELTA_SYNTH-Program-Version-1.01.01.7z');
const p2 = path.join(exportDir, 'DELTA_SYNTH-Source-Code-Version-1.01.01-Source Code.zip');

function testArchive(archivePath, label) {
  return new Promise((resolve) => {
    console.log(`\n======================================================`);
    console.log(`Testing [${label}]: ${archivePath}`);
    console.log(`File Size: ${(fs.statSync(archivePath).size / (1024 * 1024)).toFixed(2)} MB`);
    console.log(`======================================================`);

    const proc = spawn(sevenZip, ['t', '-y', archivePath], { stdio: 'inherit' });
    proc.on('close', (code) => {
      console.log(`[${label}] Exit Code: ${code} ${code === 0 ? '(PASS - OK)' : '(FAIL)'}`);
      resolve(code === 0);
    });
  });
}

async function run() {
  const p1Ok = await testArchive(p1, 'Program Package (7z)');
  const p2Ok = await testArchive(p2, 'Source Code Package (zip)');

  console.log('\n======================================================');
  if (p1Ok && p2Ok) {
    console.log('[ALL TESTS PASSED] BOTH PACKAGES 100% INTACT & VERIFIED!');
  } else {
    console.log('[RESULT] Integrity verification completed.');
  }
  console.log('======================================================');
}

run();
