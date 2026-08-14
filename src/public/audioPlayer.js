/**
 * DELTA SYNTH — Audio Preview & State Manager
 * 
 * Standards from AGENT.md:
 * - Resource-aware optimization (cleans up audio context and listeners)
 * - Defensive handling of playback failure / user interaction constraints
 * - Section 11 Logging: [AudioPlayer] Action failed: <cause>. Suggested action: <next step>.
 * 
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

import { showToast } from 'public/toast';
import { logStandard } from 'public/utils';

class AudioPlayerManager {
  constructor() {
    this.currentTrackId = null;
    this.currentTrackUrl = null;
    this.isPlaying = false;
    this.audioElement = null;
    this.onStateChangeCallbacks = new Set();
  }

  /**
   * Subscribe to playback state changes
   * @param {Function} callback - ({ isPlaying, currentTrackId, currentTrackUrl }) => void
   * @returns {Function} Unsubscribe function
   */
  subscribe(callback) {
    if (typeof callback === 'function') {
      this.onStateChangeCallbacks.add(callback);
    }
    return () => this.onStateChangeCallbacks.delete(callback);
  }

  notifyState() {
    const state = {
      isPlaying: this.isPlaying,
      currentTrackId: this.currentTrackId,
      currentTrackUrl: this.currentTrackUrl
    };
    this.onStateChangeCallbacks.forEach(cb => {
      try {
        cb(state);
      } catch (err) {
        logStandard('AudioPlayer', 'Notify callback execution', err.message, 'Check subscriber implementation', 'warn');
      }
    });
  }

  /**
   * Play or toggle audio track
   * @param {string} trackId - Unique track identifier
   * @param {string} trackUrl - URL/path to audio file (e.g. 'Voice/SUN.wav')
   */
  play(trackId, trackUrl) {
    if (!trackUrl) {
      logStandard('AudioPlayer', 'Play request', 'No audio URL provided', 'Pass a valid audio file path', 'warn');
      showToast({ message: 'ไม่พบไฟล์เสียงตัวอย่าง', actionText: 'โปรดลองเพลงอื่น', type: 'warning' });
      return;
    }

    // Toggle pause if the same track is clicked while playing
    if (this.currentTrackId === trackId && this.isPlaying) {
      this.pause();
      return;
    }

    this.stop();

    this.currentTrackId = trackId;
    this.currentTrackUrl = trackUrl;

    if (typeof Audio !== 'undefined') {
      try {
        this.audioElement = new Audio(trackUrl);
        this.audioElement.volume = 0.85;

        this.audioElement.onplay = () => {
          this.isPlaying = true;
          this.notifyState();
        };

        this.audioElement.onpause = () => {
          this.isPlaying = false;
          this.notifyState();
        };

        this.audioElement.onended = () => {
          this.isPlaying = false;
          this.notifyState();
        };

        this.audioElement.onerror = (e) => {
          this.isPlaying = false;
          this.notifyState();
          logStandard('AudioPlayer', 'Audio playback', `Failed to load ${trackUrl}`, 'Verify audio file exists in Voice/ directory', 'error');
          showToast({ message: 'ไม่สามารถเล่นไฟล์เสียงได้', actionText: 'ตรวจสอบการเชื่อมต่อ', type: 'error' });
        };

        const playPromise = this.audioElement.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            this.isPlaying = false;
            this.notifyState();
            logStandard('AudioPlayer', 'Autoplay policy restriction', err.message, 'User interaction required before playback', 'warn');
          });
        }
      } catch (err) {
        logStandard('AudioPlayer', 'Audio initialization', err.message, 'Check browser Web Audio support', 'error');
      }
    } else {
      // Running inside Wix SSR or non-browser environment
      this.isPlaying = true;
      this.notifyState();
    }
  }

  /**
   * Pause the active track
   */
  pause() {
    if (this.audioElement && this.isPlaying) {
      this.audioElement.pause();
    }
    this.isPlaying = false;
    this.notifyState();
  }

  /**
   * Stop audio and reset state
   */
  stop() {
    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
        this.audioElement.src = '';
        this.audioElement = null;
      } catch (_) {}
    }
    this.isPlaying = false;
    this.currentTrackId = null;
    this.currentTrackUrl = null;
    this.notifyState();
  }
}

export const globalAudioPlayer = new AudioPlayerManager();
export default globalAudioPlayer;
