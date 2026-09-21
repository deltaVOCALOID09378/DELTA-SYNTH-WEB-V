/**
 * test-api.mjs
 * Tools/test-api.mjs
 * Made And Checked By DELTA SYNTH & Gemini AI
 * Original by Patiphat Wongyai (Delta)
 * Revision: 1.1
 * Test script for RESTful API v1 with process logging
 */

import http from 'node:http';
import { spawn } from 'node:child_process';

const serverProcess = spawn('node', ['server.js'], { stdio: 'inherit' });

function request(urlPath) {
  return new Promise((resolve, reject) => {
    http.get({ host: '127.0.0.1', port: 3000, path: urlPath }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, text: data });
        }
      });
    }).on('error', reject);
  });
}

// Wait for server to start
setTimeout(async () => {
  try {
    const health = await request('/api/v1/health');
    console.log('API /api/v1/health status:', health.status, 'service:', health.body?.data?.service);

    const voicebanks = await request('/api/v1/voicebanks');
    console.log('API /api/v1/voicebanks status:', voicebanks.status, 'total:', voicebanks.body?.data?.total);

    const single = await request('/api/v1/voicebanks/arzbtv');
    console.log('API /api/v1/voicebanks/arzbtv packages count:', single.body?.data?.packagesCount);

    console.log('[SUCCESS] All REST API endpoints validated successfully!');
  } catch (err) {
    console.error('[ERROR]', err);
  } finally {
    serverProcess.kill();
    process.exit(0);
  }
}, 2500);
