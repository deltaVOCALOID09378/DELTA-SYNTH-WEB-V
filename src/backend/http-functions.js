/**
 * DELTA SYNTH — Wix HTTP REST Endpoints
 * 
 * Endpoints:
 * - GET /_functions/voicebanks
 * - GET /_functions/singer/:id
 * - GET /_functions/files
 * - POST /_functions/contact
 * - POST /_functions/register
 * 
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

import { VOICEBANKS, getVoicebankById, queryVoicebanks } from 'public/voicebankData';
import { MUSIC_FILES } from 'public/projectData';
import { registerForEvent } from 'backend/registrationService.jsw';
import { submitContactMessage } from 'backend/contactService.jsw';

function jsonResponse(data, status = 200) {
  return {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    },
    status,
    body: JSON.stringify(data)
  };
}

export function options_voicebanks(request) {
  return jsonResponse({}, 200);
}

export function get_voicebanks(request) {
  try {
    const query = request.query || {};
    const gender = query.gender || 'All';
    const engine = query.engine || 'All';
    const type = query.type || 'All';
    const search = query.search || '';

    const results = queryVoicebanks({ gender, engine, type, query: search });
    return jsonResponse({
      success: true,
      count: results.length,
      total: VOICEBANKS.length,
      data: results
    }, 200);
  } catch (err) {
    return jsonResponse({ success: false, error: err.message }, 500);
  }
}

export function get_singer(request) {
  try {
    const singerId = request.path[0];
    if (!singerId) {
      return jsonResponse({ success: false, error: 'Singer ID required in path' }, 400);
    }
    const singer = getVoicebankById(singerId);
    if (!singer) {
      return jsonResponse({ success: false, error: 'Singer not found' }, 404);
    }
    return jsonResponse({ success: true, data: singer }, 200);
  } catch (err) {
    return jsonResponse({ success: false, error: err.message }, 500);
  }
}

export function get_files(request) {
  try {
    const format = request.query ? request.query.format : 'All';
    let files = MUSIC_FILES;
    if (format && format !== 'All') {
      files = files.filter(f => f.format.toUpperCase() === format.toUpperCase());
    }
    return jsonResponse({ success: true, count: files.length, data: files }, 200);
  } catch (err) {
    return jsonResponse({ success: false, error: err.message }, 500);
  }
}

export async function post_contact(request) {
  try {
    const body = await request.body.json();
    const result = await submitContactMessage(body);
    return jsonResponse(result, result.success ? 200 : 400);
  } catch (err) {
    return jsonResponse({ success: false, error: err.message }, 500);
  }
}

export async function post_register(request) {
  try {
    const body = await request.body.json();
    const result = await registerForEvent(body);
    return jsonResponse(result, result.success ? 200 : 400);
  } catch (err) {
    return jsonResponse({ success: false, error: err.message }, 500);
  }
}
