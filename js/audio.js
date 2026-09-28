/**
 * MacBook Neo Audio Engine
 * Uses HTML5 <audio> with real WAV files — 100% reliable, no Web Audio API.
 */
class NeoAudioEngine {
  constructor() {
    this.isMuted = false;
    this.bgmAudio = null;
    this.bgmPlaying = false;

    // Preload short SFX
    this._click = new Audio('assets/sfx_click.wav');
    this._click.volume = 0.6;
    this._chime = new Audio('assets/sfx_chime.wav');
    this._chime.volume = 0.7;
    this._chirp = new Audio('assets/sfx_chirp.wav');
    this._chirp.volume = 0.55;
  }

  _play(audioEl) {
    if (this.isMuted) return;
    // Clone so multiple rapid plays don't cut each other off
    const clone = audioEl.cloneNode();
    clone.volume = audioEl.volume;
    clone.play().catch(() => {});
  }

  playStartupChime() {
    if (this.isMuted) return;
    this._chime.currentTime = 0;
    this._chime.play().catch(() => {});
  }

  playPop() {
    this._play(this._click);
  }

  playLilGuyTalk() {
    this._play(this._chirp);
  }

  playHover() {
    // Intentionally silent — too frequent for a sound effect
  }

  // Returns true if now playing, false if stopped
  toggleBgm() {
    if (!this.bgmAudio) {
      this.bgmAudio = new Audio('assets/bgm_lofi.wav');
      this.bgmAudio.loop = true;
      this.bgmAudio.volume = 0.55;
    }

    if (this.bgmPlaying) {
      this.bgmAudio.pause();
      this.bgmPlaying = false;
      return false;
    } else {
      this.bgmAudio.play().catch((e) => {
        console.warn('BGM play failed:', e);
      });
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
