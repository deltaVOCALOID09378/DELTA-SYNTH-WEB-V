/**
 * DELTA SYNTH — Wix HTTP REST Endpoints
 * 
 * Endpoints:
 * - GET /_functions/voicebanks
 * - OPTIONS /_functions/voicebanks
 * - GET /_functions/singer/:id
 * - OPTIONS /_functions/singer/:id
 * - GET /_functions/files
 * - OPTIONS /_functions/files
 * - POST /_functions/contact
 * - OPTIONS /_functions/contact
 * - POST /_functions/register
 * - OPTIONS /_functions/register
 * 
 * Standards from AGENT.md:
 * - CORS preflight handlers for all endpoints
 * - Accurate HTTP status codes (400 on malformed payload)
 * - Structured error logging: [Component] Action failed: <cause>. Suggested action: <next step>.
 * 
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

import { VOICEBANKS, getVoicebankById, queryVoicebanks } from 'public/voicebankData';
import { MUSIC_FILES } from 'public/projectData';
import { registerForEvent } from 'backend/registrationService.jsw';
import { submitContactMessage } from 'backend/contactService.jsw';

/**
 * Standard JSON Response with full CORS support
 * @param {object|Array} data
 * @param {number} [status=200]
 * @returns {object}
 */
const ALLOWED_ORIGINS = new Set([
  'https://deltasynthth.co.th',
  'https://www.deltasynthth.co.th',
  'https://delta-synth-official-studio.vercel.app'
]);

function jsonResponse(data, status = 200, request) {
  const origin = request && request.headers && request.headers.origin;
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  if (ALLOWED_ORIGINS.has(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers.Vary = 'Origin';
  }
  return {
    headers,
    status,
    body: JSON.stringify(data)
  };
}

// ============================================================================
// CORS PREFLIGHT (OPTIONS) HANDLERS
// ============================================================================

export function options_voicebanks(request) {
  return jsonResponse({}, 200);
}

export function options_singer(request) {
  return jsonResponse({}, 200);
}

export function options_files(request) {
  return jsonResponse({}, 200);
}

export function options_contact(request) {
  return jsonResponse({}, 200);
}

export function options_register(request) {
  return jsonResponse({}, 200);
}

// ============================================================================
// REST API ENDPOINTS
// ============================================================================

/**
 * GET /_functions/voicebanks
 * Query voicebank catalog with filtering
 */
export function get_voicebanks(request) {
  try {
    const query = (request && request.query && typeof request.query === 'object') ? request.query : {};
    const gender = typeof query.gender === 'string' ? query.gender : 'All';
    const engine = typeof query.engine === 'string' ? query.engine : 'All';
    const type = typeof query.type === 'string' ? query.type : 'All';
    const search = typeof query.search === 'string' ? query.search : '';

    const results = queryVoicebanks({ gender, engine, type, query: search });
    return jsonResponse({
      success: true,
      count: results.length,
      total: Array.isArray(VOICEBANKS) ? VOICEBANKS.length : 0,
      data: results
    }, 200);
  } catch (err) {
    const errorMsg = (err && err.message) ? err.message : String(err);
    console.error(`[HttpFunctions] get_voicebanks failed: ${errorMsg}. Suggested action: Verify query parameters.`);
    return jsonResponse({ success: false, error: 'ไม่สามารถดำเนินการได้ในขณะนี้' }, 500, request);
  }
}

/**
 * GET /_functions/singer/:id
 * Retrieve details for a single voicebank singer
 */
export function get_singer(request) {
  try {
    if (!request || !request.path || !Array.isArray(request.path) || !request.path[0]) {
      return jsonResponse({ success: false, error: 'Singer ID required in path' }, 400);
    }
    const singerId = typeof request.path[0] === 'string' ? request.path[0].trim() : '';
    if (!singerId) {
      return jsonResponse({ success: false, error: 'Singer ID required in path' }, 400);
    }
    const singer = getVoicebankById(singerId);
    if (!singer) {
      return jsonResponse({ success: false, error: `Singer '${singerId}' not found` }, 404);
    }
    return jsonResponse({ success: true, data: singer }, 200);
  } catch (err) {
    const errorMsg = (err && err.message) ? err.message : String(err);
    console.error(`[HttpFunctions] get_singer failed: ${errorMsg}. Suggested action: Check singerId parameter format.`);
    return jsonResponse({ success: false, error: 'ไม่สามารถดำเนินการได้ในขณะนี้' }, 500, request);
  }
}

/**
 * GET /_functions/files
 * Retrieve music resources list filtered by format
 */
export function get_files(request) {
  try {
    const query = (request && request.query && typeof request.query === 'object') ? request.query : {};
    const format = typeof query.format === 'string' ? query.format.trim() : 'All';
    let files = Array.isArray(MUSIC_FILES) ? [...MUSIC_FILES] : [];
    if (format && format.toUpperCase() !== 'ALL') {
      const targetFormat = format.toUpperCase();
      files = files.filter(f => f && typeof f.format === 'string' && f.format.toUpperCase() === targetFormat);
    }
    return jsonResponse({ success: true, count: files.length, data: files }, 200);
  } catch (err) {
    const errorMsg = (err && err.message) ? err.message : String(err);
    console.error(`[HttpFunctions] get_files failed: ${errorMsg}. Suggested action: Check format parameter query.`);
    return jsonResponse({ success: false, error: 'ไม่สามารถดำเนินการได้ในขณะนี้' }, 500, request);
  }
}

/**
 * POST /_functions/contact
 * Submit contact inquiry via REST
 */
export async function post_contact(request) {
  let body;
  try {
    if (!request || !request.body || typeof request.body.json !== 'function') {
      return jsonResponse({ success: false, error: 'Malformed request: body.json() parser unavailable' }, 400);
    }
    body = await request.body.json();
  } catch (parseErr) {
    const parseMsg = (parseErr && parseErr.message) ? parseErr.message : String(parseErr);
    console.error(`[HttpFunctions] post_contact failed: Stream error or invalid payload (${parseMsg}). Suggested action: Verify JSON request body.`);
    return jsonResponse({ success: false, error: 'Invalid JSON payload' }, 400, request);
  }

  try {
    const result = await submitContactMessage(body);
    return jsonResponse(result, result && result.success ? 200 : 400, request);
  } catch (err) {
    const errorMsg = (err && err.message) ? err.message : String(err);
    console.error(`[HttpFunctions] post_contact failed: ${errorMsg}. Suggested action: Verify contact service.`);
    return jsonResponse({ success: false, error: 'ไม่สามารถดำเนินการได้ในขณะนี้' }, 500, request);
  }
}

/**
 * POST /_functions/register
 * Register for event via REST
 */
export async function post_register(request) {
  let body;
  try {
    if (!request || !request.body || typeof request.body.json !== 'function') {
      return jsonResponse({ success: false, error: 'Malformed request: body.json() parser unavailable' }, 400);
    }
    body = await request.body.json();
  } catch (parseErr) {
    const parseMsg = (parseErr && parseErr.message) ? parseErr.message : String(parseErr);
    console.error(`[HttpFunctions] post_register failed: Stream error or invalid payload (${parseMsg}). Suggested action: Verify JSON request body.`);
    return jsonResponse({ success: false, error: 'Invalid JSON payload' }, 400, request);
  }

  try {
    const result = await registerForEvent(body);
    return jsonResponse(result, result && result.success ? 200 : 400, request);
  } catch (err) {
    const errorMsg = (err && err.message) ? err.message : String(err);
    console.error(`[HttpFunctions] post_register failed: ${errorMsg}. Suggested action: Verify registration service.`);
    return jsonResponse({ success: false, error: 'ไม่สามารถดำเนินการได้ในขณะนี้' }, 500, request);
  }
}

export default {
  options_voicebanks,
  options_singer,
  options_files,
  options_contact,
  options_register,
  get_voicebanks,
  get_singer,
  get_files,
  post_contact,
  post_register
};
