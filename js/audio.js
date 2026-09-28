/**
 * MacBook Neo Audio Engine
 * High-performance, zero-allocation audio engine using object pools.
 * Prevents memory leaks by reusing a fixed set of Audio elements (no cloneNode).
 */
class NeoAudioEngine {
  constructor() {
    this.isMuted = false;
    this.bgmAudio = null;
    this.bgmPlaying = false;

    // Fixed pool of SFX elements to prevent memory leaks from cloneNode
    this._clickPool = [
      new Audio('assets/sfx_click.wav'),
      new Audio('assets/sfx_click.wav'),
      new Audio('assets/sfx_click.wav')
    ];
    this._clickIdx = 0;
    this._clickPool.forEach(a => { a.volume = 0.45; a.preload = 'auto'; });

    this._chime = new Audio('assets/sfx_chime.wav');
    this._chime.volume = 0.65;
    this._chime.preload = 'auto';

    this._chirpPool = [
      new Audio('assets/sfx_chirp.wav'),
      new Audio('assets/sfx_chirp.wav')
    ];
    this._chirpIdx = 0;
    this._chirpPool.forEach(a => { a.volume = 0.4; a.preload = 'auto'; });

    this._lastChirpTime = 0;
  }

  _playPool(pool, idxKey) {
    if (this.isMuted) return;
    try {
      const a = pool[this[idxKey]];
      this[idxKey] = (this[idxKey] + 1) % pool.length;
      a.currentTime = 0;
      a.play().catch(() => {});
    } catch(e) {}
  }

  playStartupChime() {
    if (this.isMuted) return;
    try {
      this._chime.currentTime = 0;
      this._chime.play().catch(() => {});
    } catch(e) {}
  }

  playPop() {
    this._playPool(this._clickPool, '_clickIdx');
  }

  playLilGuyTalk() {
    const now = Date.now();
    // Throttle talking chirp to 120ms so it doesn't choke the audio thread
    if (now - this._lastChirpTime < 120) return;
    this._lastChirpTime = now;
    this._playPool(this._chirpPool, '_chirpIdx');
  }

  playHover() {
    // Intentionally silent — hover sounds causes stutter on rapid mouse moves
  }

  toggleBgm() {
    if (!this.bgmAudio) {
      this.bgmAudio = new Audio('assets/bgm_lofi.wav');
      this.bgmAudio.loop = true;
      this.bgmAudio.volume = 0.5;
    }

    if (this.bgmPlaying) {
      this.bgmAudio.pause();
      this.bgmPlaying = false;
      return false;
    } else {
      this.bgmAudio.play().catch(() => {});
      this.bgmPlaying = true;
      return true;
    }
  }

  stopBgm() {
    if (this.bgmAudio) {
      this.bgmAudio.pause();
      this.bgmAudio.currentTime = 0;
    }
    this.bgmPlaying = false;
  }
}

window.neoAudio = new NeoAudioEngine();
