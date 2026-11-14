/**
 * Proximo - Pomodoro Focus Timer Module
 * Integrated with Web Audio API for sound generation & subject study logging.
 */

class FocusTimer {
  constructor() {
    this.duration = 25 * 60; // 25 mins in seconds
    this.remaining = this.duration;
    this.mode = "focus"; // 'focus' | 'shortBreak' | 'longBreak'
    this.isRunning = false;
    this.timerId = null;
    this.selectedSubjectId = "ml";
    this.soundMode = "mute"; // 'mute' | 'binaural' | 'rain'
    
    // Web Audio Context for offline sound generation
    this.audioCtx = null;
    this.noiseNode = null;
    this.binauralOscLeft = null;
    this.binauralOscRight = null;
    this.gainNode = null;

    // Callbacks
    this.onTick = null;
    this.onComplete = null;
  }

  initAudio() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  setMode(mode, customMinutes = null) {
    this.pause();
    this.mode = mode;
    if (customMinutes) {
      this.duration = customMinutes * 60;
    } else if (mode === "focus") {
      this.duration = 25 * 60;
    } else if (mode === "shortBreak") {
      this.duration = 5 * 60;
    } else if (mode === "longBreak") {
      this.duration = 15 * 60;
    }
    this.remaining = this.duration;
    if (this.onTick) this.onTick(this.getState());
  }

  setSubject(subjectId) {
    this.selectedSubjectId = subjectId;
  }

  start() {
    if (this.isRunning) return;
    this.initAudio();
    this.isRunning = true;
    this.startAmbientSound();

    this.timerId = setInterval(() => {
      this.remaining--;
      if (this.remaining <= 0) {
        this.complete();
      } else {
        if (this.onTick) this.onTick(this.getState());
      }
    }, 1000);

    if (this.onTick) this.onTick(this.getState());
  }

  pause() {
    if (!this.isRunning) return;
    this.isRunning = false;
    clearInterval(this.timerId);
    this.timerId = null;
    this.stopAmbientSound();
    if (this.onTick) this.onTick(this.getState());
  }

  reset() {
    this.pause();
    this.remaining = this.duration;
    if (this.onTick) this.onTick(this.getState());
  }

  complete() {
    this.pause();
    this.remaining = 0;
    this.playChime();
    this.stopAmbientSound();

    const loggedMinutes = Math.round(this.duration / 60);

    if (this.onComplete) {
      this.onComplete({
        mode: this.mode,
        subjectId: this.selectedSubjectId,
        loggedMinutes: loggedMinutes
      });
    }

    // Reset for next round
    setTimeout(() => {
      this.reset();
    }, 1500);
  }

  getState() {
    const minutes = Math.floor(this.remaining / 60);
    const seconds = this.remaining % 60;
    const formatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    const progressPct = ((this.duration - this.remaining) / this.duration) * 100;

    return {
      mode: this.mode,
      remaining: this.remaining,
      duration: this.duration,
      minutes,
      seconds,
      formatted,
      progressPct,
      isRunning: this.isRunning,
      subjectId: this.selectedSubjectId,
      soundMode: this.soundMode
    };
  }

  // --- Web Audio Synthesis: Ambient Generator ---
  setSoundMode(mode) {
    this.soundMode = mode;
    if (this.isRunning) {
      this.stopAmbientSound();
      this.startAmbientSound();
    }
  }

  startAmbientSound() {
    if (this.soundMode === "mute" || !this.isRunning) return;
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      this.stopAmbientSound();

      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
      this.gainNode.connect(this.audioCtx.destination);

      if (this.soundMode === "binaural") {
        // Binaural 216Hz and 226Hz (10Hz Alpha Waves)
        this.binauralOscLeft = this.audioCtx.createOscillator();
        this.binauralOscRight = this.audioCtx.createOscillator();
        this.binauralOscLeft.type = "sine";
        this.binauralOscRight.type = "sine";
        this.binauralOscLeft.frequency.setValueAtTime(216, this.audioCtx.currentTime);
        this.binauralOscRight.frequency.setValueAtTime(226, this.audioCtx.currentTime);

        const merger = this.audioCtx.createChannelMerger(2);
        this.binauralOscLeft.connect(merger, 0, 0);
        this.binauralOscRight.connect(merger, 0, 1);
        merger.connect(this.gainNode);

        this.binauralOscLeft.start();
        this.binauralOscRight.start();
      } else if (this.soundMode === "rain") {
        // Procedural White/Pink Noise with Lowpass Filter
        const bufferSize = this.audioCtx.sampleRate * 2;
        const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = this.audioCtx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = this.audioCtx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(650, this.audioCtx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(this.gainNode);
        whiteNoise.start();
        this.noiseNode = whiteNoise;
      }
    } catch (e) {
      console.warn("Audio synthesis error:", e);
    }
  }

  stopAmbientSound() {
    try {
      if (this.binauralOscLeft) {
        this.binauralOscLeft.stop();
        this.binauralOscLeft.disconnect();
        this.binauralOscLeft = null;
      }
      if (this.binauralOscRight) {
        this.binauralOscRight.stop();
        this.binauralOscRight.disconnect();
        this.binauralOscRight = null;
      }
      if (this.noiseNode) {
        this.noiseNode.stop();
        this.noiseNode.disconnect();
        this.noiseNode = null;
      }
    } catch (e) {
      // Ignore cleanup errors
    }
  }

  playChime() {
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      // Play a 3-chord Tibetan Bell chime (C5, G5, C6)
      const freqs = [523.25, 783.99, 1046.5];
      freqs.forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0.2, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 2.0);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 2.2);
      });
    } catch (e) {
      console.warn("Chime audio failed:", e);
    }
  }
}
