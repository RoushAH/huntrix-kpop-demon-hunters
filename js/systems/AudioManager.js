export class AudioManager {
  constructor() {
    this.musicEnabled = true;
    this.sfxEnabled = true;
    this.musicVolume = 0.5;
    this.sfxVolume = 0.7;

    // MIDI/Music tracks
    this.tracks = {
      title: 'assets/audio/music/Takedown (from the Netflix Film KPop Demon Hunters) - HUNTR_X, EJAE, AUDREY NUNA, REI AMI, KPop Demo.mid',
      level1: 'assets/audio/music/KPop Demon Hunters - Your Idol.mid',
      level2: 'assets/audio/music/KPop Demon Hunters - Your Idol.mid', // Reuse for now
      level3: 'assets/audio/music/KPop Demon Hunters - Your Idol.mid', // Reuse for now
      boss: 'assets/audio/music/Takedown (from the Netflix Film KPop Demon Hunters) - HUNTR_X, EJAE, AUDREY NUNA, REI AMI, KPop Demo.mid',
      victory: 'assets/audio/music/KPop Demon Hunters - Your Idol.mid',
      gameover: 'assets/audio/music/KPop Demon Hunters - Your Idol.mid'
    };

    this.currentTrack = null;
    this.midiLoaded = false;

    // Sound effects (we'll use Web Audio API to generate simple beeps for now)
    this.audioContext = null;
    this.sfxNodes = {};

    this.initAudio();
  }

  initAudio() {
    // Initialize Web Audio API for sound effects
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContext();
      console.log('AudioManager: Web Audio API initialized');
    } catch (e) {
      console.warn('AudioManager: Web Audio API not supported', e);
    }

    // Note: MIDI playback would require MIDI.js or similar library
    // For now, we'll use placeholder implementation
    console.log('AudioManager: MIDI tracks available:', Object.keys(this.tracks));
  }

  // Music control
  playMusic(trackName) {
    if (!this.musicEnabled) return;

    if (this.currentTrack === trackName) return; // Already playing

    this.stopMusic();
    this.currentTrack = trackName;

    // Placeholder: In full implementation, would use MIDI.js here
    console.log('AudioManager: Playing music track:', trackName);

    // TODO: Implement actual MIDI playback with MIDI.js
    // MIDI.Player.loadFile(this.tracks[trackName], () => {
    //   MIDI.Player.start();
    // });
  }

  stopMusic() {
    if (!this.currentTrack) return;

    console.log('AudioManager: Stopping music');
    this.currentTrack = null;

    // TODO: MIDI.Player.stop();
  }

  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    // TODO: Update MIDI volume
  }

  toggleMusic() {
    this.musicEnabled = !this.musicEnabled;
    if (!this.musicEnabled) {
      this.stopMusic();
    }
    return this.musicEnabled;
  }

  // Sound effects using Web Audio API
  playSFX(type, frequency = 440, duration = 0.1) {
    if (!this.sfxEnabled || !this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Different waveforms for different sounds
      const waveforms = {
        attack: 'square',
        hit: 'sawtooth',
        death: 'triangle',
        pickup: 'sine',
        combo: 'sine',
        spawn: 'square'
      };

      oscillator.type = waveforms[type] || 'sine';
      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

      gainNode.gain.setValueAtTime(this.sfxVolume * 0.3, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (e) {
      console.warn('AudioManager: Error playing SFX', e);
    }
  }

  // Specific sound effect methods
  playAttackSound(characterType) {
    if (characterType === 'mira') {
      this.playSFX('attack', 880, 0.05); // High pitch for knife throw
    } else if (characterType === 'zoey') {
      this.playSFX('attack', 660, 0.08); // Fast attack
    } else {
      this.playSFX('attack', 440, 0.1); // Normal attack
    }
  }

  playHitSound() {
    this.playSFX('hit', 220, 0.15);
  }

  playEnemyDeathSound() {
    // Descending pitch
    if (!this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(110, this.audioContext.currentTime + 0.3);

      gainNode.gain.setValueAtTime(this.sfxVolume * 0.3, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.3);
    } catch (e) {
      console.warn('AudioManager: Error playing death sound', e);
    }
  }

  playHealthPickupSound() {
    // Ascending arpeggio
    if (!this.audioContext) return;

    const notes = [440, 554, 659]; // A, C#, E
    notes.forEach((freq, index) => {
      setTimeout(() => {
        this.playSFX('pickup', freq, 0.1);
      }, index * 50);
    });
  }

  playWingwomenArriveSound() {
    // Triumphant chord
    if (!this.audioContext) return;

    const chord = [523, 659, 784]; // C, E, G
    chord.forEach(freq => {
      this.playSFX('spawn', freq, 0.4);
    });
  }

  playWingwomenLeaveSound() {
    // Quick swoosh
    this.playSFX('spawn', 880, 0.2);
  }

  playComboSound(comboLevel) {
    // Higher pitch for higher combo
    const basePitch = 440;
    const pitch = basePitch + (comboLevel * 20);
    this.playSFX('combo', Math.min(pitch, 1760), 0.15);
  }

  playUISound() {
    this.playSFX('pickup', 660, 0.08);
  }

  playSelectSound() {
    this.playSFX('pickup', 880, 0.1);
  }

  setSFXVolume(volume) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  }

  toggleSFX() {
    this.sfxEnabled = !this.sfxEnabled;
    return this.sfxEnabled;
  }

  // Resume audio context (needed for some browsers)
  resumeAudioContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }
}
