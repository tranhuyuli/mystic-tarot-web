// Web Audio API procedural sound synthesizer for Tarot effects

class SoundManager {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Card slide / draw sound effect
  playCardDraw() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.15);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  // Card flip chime (Tibetan singing bowl chime)
  playCardFlip() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const frequencies = [528, 792, 1056]; // Solfeggio 528Hz Love & Transformation frequency

    frequencies.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      const amp = 0.1 / (idx + 1);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(amp, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2 + idx * 0.3);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now);
      osc.stop(now + 1.6);
    });
  }

  // Shuffle flutter sound
  playShuffle() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    for (let i = 0; i < 6; i++) {
      const delay = i * 0.06;
      setTimeout(() => {
        this.playCardDraw();
      }, delay * 1000);
    }
  }

  // Cut Deck sound (sharp thud and slide)
  playCutDeck() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.25);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);

    setTimeout(() => {
      this.playCardDraw();
    }, 150);
  }

  // Deep Tibetan Singing Bowl meditation resonance
  playTibetanBowl() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const fundamental = 216; // 432Hz / 2
    const harmonics = [fundamental, fundamental * 1.5, fundamental * 2, fundamental * 2.76, fundamental * 4.2];

    harmonics.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      const amp = 0.15 / (idx + 1);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(amp, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now);
      osc.stop(now + 5.0);
    });
  }

  // Deck Tapping (Cord Cutting: 3 crisp knocks to clear residual energies)
  playDeckTapping() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [0, 0.25, 0.5].forEach((delay) => {
      const t = now + delay;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.exponentialRampToValueAtTime(90, t + 0.12);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.18, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(t);
      osc.stop(t + 0.18);
    });
  }

  // Mystic chime when reading completes
  playWisdomChime() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [432, 648, 864, 1296]; // 432Hz harmonic series

    notes.forEach((freq, i) => {
      const start = now + i * 0.12;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(0.08, start + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 2.5);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(start);
      osc.stop(start + 2.6);
    });
  }
}

export const sound = new SoundManager();
