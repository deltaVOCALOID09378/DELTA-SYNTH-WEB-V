const port = Number(process.env.PORT || 3000);
const baseUrl = process.env.HEALTH_URL || `http://127.0.0.1:${port}`;
const response = await fetch(`${baseUrl}/healthz`, { signal: AbortSignal.timeout(5000) });
if (!response.ok) throw new Error(`Health check failed with HTTP ${response.status}`);
const body = await response.json();
if (body.status !== "ok") throw new Error("Health check returned a non-ok status");
console.log(`[delta-synth] Health check passed: ${baseUrl}/healthz`);
