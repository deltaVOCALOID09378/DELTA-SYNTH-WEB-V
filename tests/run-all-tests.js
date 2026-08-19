/**
 * DELTA SYNTH — Master Test Runner & Suite Orchestrator
 * 
 * Executes 4-Tier Test Suites with Native Node.js Test Runner:
 * - Tier 1: Feature Coverage (Category-Partition Testing)
 * - Tier 2: Boundary & Corner Cases (Boundary Value Analysis)
 * - Tier 3: Cross-Feature Combinations (Pairwise Interaction)
 * - Tier 4: Real-World Workloads & Concurrency Stress
 * 
 * Standards Compliance: AGENT.md (Sections 1-20), PROJECT.md
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

import { run } from 'node:test';
import { spec, tap } from 'node:test/reporters';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ANSI Terminal Colors
const C = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m'
};

const SUITES = [
  {
    tier: 1,
    name: 'Tier 1: Feature Coverage (Category-Partition)',
    file: path.join(__dirname, 'tier1-feature-coverage.test.js')
  },
  {
    tier: 2,
    name: 'Tier 2: Boundary & Corner Cases (BVA)',
    file: path.join(__dirname, 'tier2-boundary-corner.test.js')
  },
  {
    tier: 3,
    name: 'Tier 3: Cross-Feature Combinations (Pairwise)',
    file: path.join(__dirname, 'tier3-cross-feature.test.js')
  },
  {
    tier: 4,
    name: 'Tier 4: Real-World Workloads & Concurrency',
    file: path.join(__dirname, 'tier4-real-world-workloads.test.js')
  }
];

async function main() {
  const args = process.argv.slice(2);
  const tierArg = args.find(a => a.startsWith('--tier='));
  const targetTier = tierArg ? parseInt(tierArg.split('=')[1], 10) : null;
  const isTap = args.includes('--tap');
  const isBail = args.includes('--bail');

  console.log(`${C.bright}${C.cyan}╔═══════════════════════════════════════════════════════════════════════╗${C.reset}`);
  console.log(`${C.bright}${C.cyan}║                   DELTA SYNTH — E2E TEST RUNNER                       ║${C.reset}`);
  console.log(`${C.bright}${C.cyan}║       4-Tier Opaque-Box Automated Verification (AGENT.md)             ║${C.reset}`);
  console.log(`${C.bright}${C.cyan}╚═══════════════════════════════════════════════════════════════════════╝${C.reset}\n`);

  const suitesToRun = targetTier ? SUITES.filter(s => s.tier === targetTier) : SUITES;

  if (suitesToRun.length === 0) {
    console.error(`${C.red}Error: No test suite matches Tier ${targetTier}.${C.reset}`);
    process.exit(1);
  }

  const files = suitesToRun.map(s => s.file);
  const startTime = performance.now();

  const testStream = run({
    files,
    concurrency: false,
    bail: isBail
  });

  const reporter = isTap ? tap : spec;
  testStream.compose(reporter).pipe(process.stdout);

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  let skippedTests = 0;

  testStream.on('test:pass', () => { passedTests++; totalTests++; });
  testStream.on('test:fail', () => { failedTests++; totalTests++; });
  testStream.on('test:skip', () => { skippedTests++; totalTests++; });

  testStream.on('end', () => {
    const totalDuration = (performance.now() - startTime).toFixed(1);
    const mem = process.memoryUsage();
    const rssMB = (mem.rss / 1024 / 1024).toFixed(1);
    const heapUsedMB = (mem.heapUsed / 1024 / 1024).toFixed(1);

    console.log(`\n${C.bright}═════════════════════════════════════════════════════════════════════════${C.reset}`);
    console.log(`${C.bright}                     E2E SUITE EXECUTION SUMMARY                         ${C.reset}`);
    console.log(`═════════════════════════════════════════════════════════════════════════`);
    console.log(` Total Tests Executed : ${C.bright}${totalTests}${C.reset}`);
    console.log(` Passed               : ${C.green}${passedTests}${C.reset}`);
    console.log(` Failed               : ${failedTests > 0 ? C.red : C.green}${failedTests}${C.reset}`);
    console.log(` Skipped              : ${skippedTests > 0 ? C.yellow : C.dim}${skippedTests}${C.reset}`);
    console.log(` Duration             : ${C.cyan}${totalDuration} ms${C.reset}`);
    console.log(` Memory Footprint     : RSS ${rssMB} MB | Heap ${heapUsedMB} MB`);
    console.log(`═════════════════════════════════════════════════════════════════════════`);

    if (failedTests > 0) {
      console.log(`\n${C.bgRed}${C.white}${C.bright} ✖ VERIFICATION FAILED: ${failedTests} test(s) failed. ${C.reset}\n`);
      process.exit(1);
    } else {
      console.log(`\n${C.bgGreen}${C.white}${C.bright} ✔ ALL TESTS PASSED (100% Zero Defect Verification) ${C.reset}\n`);
      process.exit(0);
    }
  });
}

main().catch(err => {
  console.error(`${C.red}Fatal test runner failure:${C.reset}`, err);
  process.exit(1);
});
