/**
 * DELTA SYNTH — Audio Preview & State Manager
 * 
 * Standards from AGENT.md:
 * - Resource-aware optimization (clean audio context disposal & listener detachment)
 * - Concurrency & Race-condition prevention via Monotonic Play Generation Tokens
 * - Section 6: Zero swallowed exceptions
 * - Section 11 Logging: [AudioPlayer] Action failed: <cause>. Suggested action: <next step>.
 * 
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

import { showToast } from 'public/toast';
import { logStandard } from 'public/utils';

export class AudioPlayerManager {
  constructor() {
    this.currentTrackId = null;
    this.currentTrackUrl = null;
    this.isPlaying = false;
    this.audioElement = null;
    this.onStateChangeCallbacks = new Set();
    this._playGeneration = 0;
    this.currentPlayToken = null;
  }

  /**
   * Get current playback state snapshot
   * @returns {{ isPlaying: boolean, currentTrackId: string|null, currentTrackUrl: string|null }}
   */
  getState() {
    return {
      isPlaying: this.isPlaying,
      currentTrackId: this.currentTrackId,
      currentTrackUrl: this.currentTrackUrl
    };
  }

  /**
   * Subscribe to playback state changes
   * @param {Function} callback - ({ isPlaying, currentTrackId, currentTrackUrl }) => void
   * @returns {Function} Unsubscribe function
   */
  subscribe(callback) {
    if (typeof callback !== 'function') {
      logStandard('AudioPlayer', 'Subscribe request', 'Callback is not a function', 'Pass a valid function', 'warn');
      return () => {};
    }
    this.onStateChangeCallbacks.add(callback);
    return () => this.onStateChangeCallbacks.delete(callback);
  }

  /**
   * Broadcast current playback state to all registered subscribers
   */
  notifyState() {
    const state = this.getState();
    this.onStateChangeCallbacks.forEach(cb => {
      try {
        cb(state);
      } catch (err) {
        logStandard('AudioPlayer', 'Notify callback execution', err?.message || String(err), 'Check subscriber implementation', 'warn');
      }
    });
  }

  /**
   * Safely detach listeners, pause, and release audio resources
   * @private
   */
  _disposeAudio() {
    if (!this.audioElement) return;

    const audio = this.audioElement;
    this.audioElement = null;

    // 1. Explicitly detach all event handlers before modifying media source
    audio.onplay = null;
    audio.onpause = null;
    audio.onended = null;
    audio.onerror = null;
    audio.ontimeupdate = null;

    // 2. Pause and release media decoding buffer
    try {
      audio.pause();
      audio.currentTime = 0;
      audio.removeAttribute('src');
      if (typeof audio.load === 'function') {
        audio.load();
      }
    } catch (err) {
      logStandard('AudioPlayer', 'Audio cleanup', err?.message || String(err), 'Verify audio element state', 'warn');
    }
  }

  /**
   * Play or toggle audio track with race condition protection
   * @param {string} trackId - Unique track identifier
   * @param {string} trackUrl - URL/path to audio file (e.g. 'Voice/SUN.wav')
   * @returns {Promise<boolean>} True if playback initiated, false otherwise
   */
  async play(trackId, trackUrl) {
    if (!trackId || typeof trackId !== 'string' || !trackUrl || typeof trackUrl !== 'string') {
      logStandard('AudioPlayer', 'Play request', 'Invalid trackId or trackUrl provided', 'Pass valid non-empty string trackId and trackUrl', 'warn');
      showToast({ message: 'ไม่พบไฟล์เสียงตัวอย่าง', actionText: 'โปรดลองเพลงอื่น', type: 'warning' });
      return false;
    }

    // Toggle pause if the same track is clicked while actively playing
    if (this.currentTrackId === trackId && this.isPlaying) {
      this.pause();
      return false;
    }

    // Invalidate any pending in-flight play requests and clean up prior audio
    const playToken = ++this._playGeneration;
    this.currentPlayToken = playToken;

    this._disposeAudio();

    this.currentTrackId = trackId;
    this.currentTrackUrl = trackUrl;

    if (typeof Audio !== 'undefined') {
      try {
        const audio = new Audio(trackUrl);
        this.audioElement = audio;
        audio.volume = 0.85;

        audio.onplay = () => {
          if (this.currentPlayToken !== playToken) return;
          this.isPlaying = true;
          this.notifyState();
        };

        audio.onpause = () => {
          if (this.currentPlayToken !== playToken) return;
          this.isPlaying = false;
          this.notifyState();
        };

        audio.onended = () => {
          if (this.currentPlayToken !== playToken) return;
          this.isPlaying = false;
          this.notifyState();
        };

        audio.onerror = () => {
          if (this.currentPlayToken !== playToken) return;
          this.isPlaying = false;
          this.notifyState();
          logStandard('AudioPlayer', 'Audio playback', `Failed to load ${trackUrl}`, 'Verify audio file exists in Voice/ directory', 'error');
          showToast({ message: 'ไม่สามารถเล่นไฟล์เสียงได้', actionText: 'ตรวจสอบการเชื่อมต่อ', type: 'error' });
        };

        const playPromise = audio.play();
        if (playPromise !== undefined && typeof playPromise.then === 'function') {
          return await playPromise
            .then(() => {
              if (this.currentPlayToken !== playToken) {
                return false;
              }
              return true;
            })
            .catch(err => {
              // Ignore stale / superseded play requests
              if (this.currentPlayToken !== playToken) {
                return false;
              }

              // Benign cancellation (interrupted by user pause/stop/new load)
              if (err && (err.name === 'AbortError' || err.code === 20)) {
                return false;
              }

              // Genuine failure (e.g. autoplay policy restriction)
              this.isPlaying = false;
              this.notifyState();
              logStandard('AudioPlayer', 'Autoplay policy restriction', err?.message || String(err), 'User interaction required before playback', 'warn');
              return false;
            });
        }
        return true;
      } catch (err) {
        logStandard('AudioPlayer', 'Audio initialization', err?.message || String(err), 'Check browser Web Audio support', 'error');
        this.isPlaying = false;
        this.notifyState();
        return false;
      }
    } else {
      // Running inside Wix SSR or non-browser / test environment
      this.isPlaying = true;
      this.notifyState();
      return true;
    }
  }

  /**
   * Pause the active track
   */
  pause() {
    if (this.audioElement && this.isPlaying) {
      try {
        this.audioElement.pause();
      } catch (err) {
        logStandard('AudioPlayer', 'Pause playback', err?.message || String(err), 'Verify audio element state', 'warn');
      }
    }
    this.isPlaying = false;
    this.notifyState();
  }

  /**
   * Stop audio, release resources, and reset state
   */
  stop() {
    this.currentPlayToken = null;
    this._playGeneration++;

    this._disposeAudio();

    const hadActiveSession = this.isPlaying || this.currentTrackId !== null;
    this.isPlaying = false;
    this.currentTrackId = null;
    this.currentTrackUrl = null;

    if (hadActiveSession) {
      this.notifyState();
    }
  }
}

export const globalAudioPlayer = new AudioPlayerManager();
export default globalAudioPlayer;
