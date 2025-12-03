
export class SoundManager {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  private init() {
    // Environment check: if window is undefined (e.g. Taro Mini Program), do nothing here.
    // Initialization for Web Audio API only happens in Browser.
    if (typeof window === 'undefined') return;

    if (!this.ctx) {
      try {
        this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {
        console.warn('AudioContext not supported');
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Helper for Mini Program audio
  private playAudioFile(filename: string) {
    if (typeof window === 'undefined') {
      try {
        // Dynamic require to prevent Web build issues, though this code runs in MP
        // @ts-ignore
        const Taro = require('@tarojs/taro');
        const ctx = Taro.createInnerAudioContext();
        // Assumes files are copied to 'dist/assets/audio/' by build config
        ctx.src = `assets/audio/${filename}`; 
        ctx.play();
      } catch (e) {
        console.error("MP Audio Error:", e);
      }
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  playMove() {
    if (this.isMuted) return;
    
    if (typeof window === 'undefined') {
      this.playAudioFile('move.mp3');
      return;
    }

    this.init();
    // Sharp high tick
    this.playOscillator(600, 'square', 0.03);
  }

  playRotate() {
    if (this.isMuted) return;

    if (typeof window === 'undefined') {
      this.playAudioFile('rotate.mp3');
      return;
    }

    this.init();
    // Slightly lower tick
    this.playOscillator(500, 'square', 0.03);
  }

  playLand() {
    if (this.isMuted) return;

    if (typeof window === 'undefined') {
      this.playAudioFile('drop.mp3');
      return;
    }

    this.init();
    // Thud
    this.playOscillator(200, 'sawtooth', 0.1);
  }
  
  playClear() {
    if (this.isMuted) return;

    if (typeof window === 'undefined') {
      this.playAudioFile('clear.mp3');
      return;
    }

    this.init();
    if (!this.ctx) return;
    // Happy Arpeggio
    const now = this.ctx.currentTime;
    this.playOscillatorAt(880, 'square', 0.08, now);
    this.playOscillatorAt(1100, 'square', 0.08, now + 0.1);
    this.playOscillatorAt(1320, 'square', 0.15, now + 0.2);
  }

  playGameOver() {
    if (this.isMuted) return;

    if (typeof window === 'undefined') {
      this.playAudioFile('gameover.mp3');
      return;
    }

    this.init();
    if (!this.ctx) return;
    // Sad descending slide
    const now = this.ctx.currentTime;
    this.playOscillatorAt(800, 'sawtooth', 0.15, now);
    this.playOscillatorAt(600, 'sawtooth', 0.15, now + 0.15);
    this.playOscillatorAt(400, 'sawtooth', 0.15, now + 0.3);
    this.playOscillatorAt(200, 'sawtooth', 0.4, now + 0.45);
  }

  playStart() {
    if (this.isMuted) return;

    if (typeof window === 'undefined') {
      this.playAudioFile('start.mp3');
      return;
    }

    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    this.playOscillatorAt(660, 'square', 0.1, now);
    this.playOscillatorAt(880, 'square', 0.2, now + 0.1);
  }

  private playOscillator(freq: number, type: OscillatorType, dur: number) {
    if (!this.ctx) return;
    this.playOscillatorAt(freq, type, dur, this.ctx.currentTime);
  }

  private playOscillatorAt(freq: number, type: OscillatorType, dur: number, startTime: number) {
     if (!this.ctx) return;
     try {
       const osc = this.ctx.createOscillator();
       const gain = this.ctx.createGain();
       osc.type = type;
       osc.frequency.setValueAtTime(freq, startTime);
       
       // Retro envelope: Instant attack, slight decay
       gain.gain.setValueAtTime(0.05, startTime);
       gain.gain.exponentialRampToValueAtTime(0.001, startTime + dur);
       
       osc.connect(gain);
       gain.connect(this.ctx.destination);
       osc.start(startTime);
       osc.stop(startTime + dur);
     } catch(e) {
       console.error("Error playing sound", e);
     }
  }
}

export const sound = new SoundManager();