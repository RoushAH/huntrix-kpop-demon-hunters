export class AudioManager {
  constructor() {
    this.musicEnabled = true;
    this.sfxEnabled = true;
    this.musicVolume = 0.5;
    this.sfxVolume = 0.7;

    // MIDI tracks - MIDI.js will handle playback
    this.tracks = {
      title: 'assets/audio/music/Level1.mid',    // Title plays Level 1 music
      level1: 'assets/audio/music/Level1.mid',
      level2: 'assets/audio/music/Level2.mid',
      level3: 'assets/audio/music/Level3.mid',
      boss: 'assets/audio/music/Boss.mid',
      victory: 'assets/audio/music/Level1.mid',
      gameover: 'assets/audio/music/Level1.mid'
    };

    this.audioElement = null; // HTML5 Audio element for music
    this.midiReady = false;
    this.pendingTrack = null;

    this.currentTrack = null;
    this.midiLoaded = false;
    this.isPlayingMusic = false;
    this.currentMelody = null;
    this.currentMelodyIndex = 0;

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

    // Initialize MIDI.js
    if (typeof MIDI !== 'undefined') {
      console.log('AudioManager: Initializing MIDI.js...');
      MIDI.loadPlugin({
        soundfontUrl: "https://cdn.jsdelivr.net/npm/midi-js-soundfonts@1.0.0/FluidR3_GM/",
        instrument: "acoustic_grand_piano",
        onsuccess: () => {
          console.log('AudioManager: MIDI.js ready');
          this.midiReady = true;
          // Play pending track if any
          if (this.pendingTrack) {
            this.playMusic(this.pendingTrack);
            this.pendingTrack = null;
          }
        },
        onerror: (err) => {
          console.warn('AudioManager: MIDI.js initialization failed', err);
        }
      });
    } else {
      console.warn('AudioManager: MIDI.js not loaded, using synthesized music');
    }

    console.log('AudioManager: MIDI tracks available:', Object.keys(this.tracks));
  }

  // Music control
  playMusic(trackName) {
    if (!this.musicEnabled) return;

    if (this.currentTrack === trackName) return; // Already playing

    this.stopMusic();
    this.currentTrack = trackName;

    const trackPath = this.tracks[trackName];
    console.log('AudioManager: Playing music track:', trackName, trackPath);

    // Try to load audio file
    this.tryLoadAudioFile(trackPath, trackName);
  }

  tryLoadAudioFile(path, trackName) {
    // Try MIDI.js first
    if (this.midiReady && typeof MIDI !== 'undefined') {
      console.log('AudioManager: Loading MIDI file:', path);
      MIDI.Player.loadFile(path, () => {
        console.log('AudioManager: MIDI file loaded, starting playback');
        MIDI.Player.loop = true;
        MIDI.Player.start();
        // Adjust volume
        MIDI.setVolume(0, this.musicVolume * 127);
      }, (err) => {
        console.warn('AudioManager: MIDI load failed, using synthesized music', err);
        this.playChiptuneLoop(trackName);
      });
    } else if (!this.midiReady && typeof MIDI !== 'undefined') {
      // MIDI.js not ready yet, queue for later
      console.log('AudioManager: MIDI.js not ready yet, queuing track');
      this.pendingTrack = trackName;
    } else {
      // MIDI.js not available, fall back
      console.log('AudioManager: MIDI.js not available, using synthesized music');
      this.playChiptuneLoop(trackName);
    }
  }

  playChiptuneLoop(trackName) {
    if (!this.audioContext) return;

    // Simple chiptune melodies for each track
    const melodies = {
      title: [
        { freq: 523, duration: 0.3 }, // C
        { freq: 659, duration: 0.3 }, // E
        { freq: 784, duration: 0.3 }, // G
        { freq: 1047, duration: 0.6 }, // C
        { freq: 784, duration: 0.3 }, // G
        { freq: 659, duration: 0.3 }, // E
        { freq: 523, duration: 0.6 }, // C
      ],
      level1: [
        { freq: 440, duration: 0.2 }, // A
        { freq: 554, duration: 0.2 }, // C#
        { freq: 659, duration: 0.2 }, // E
        { freq: 440, duration: 0.2 },
        { freq: 554, duration: 0.2 },
        { freq: 659, duration: 0.2 },
        { freq: 880, duration: 0.4 },
      ],
      level2: [
        { freq: 494, duration: 0.2 }, // B
        { freq: 622, duration: 0.2 }, // D#
        { freq: 740, duration: 0.2 }, // F#
        { freq: 494, duration: 0.2 },
        { freq: 622, duration: 0.2 },
        { freq: 740, duration: 0.2 },
        { freq: 988, duration: 0.4 },
      ],
      level3: [
        { freq: 330, duration: 0.2 }, // E
        { freq: 415, duration: 0.2 }, // G#
        { freq: 494, duration: 0.2 }, // B
        { freq: 330, duration: 0.2 },
        { freq: 415, duration: 0.2 },
        { freq: 494, duration: 0.2 },
        { freq: 660, duration: 0.4 },
      ]
    };

    const melody = melodies[trackName] || melodies.level1;
    this.currentMelodyIndex = 0;
    this.currentMelody = melody;
    this.isPlayingMusic = true;

    this.playNextNote();
  }

  playNextNote() {
    if (!this.isPlayingMusic || !this.currentMelody) return;

    const note = this.currentMelody[this.currentMelodyIndex];

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.type = 'square'; // Chiptune sound
      oscillator.frequency.setValueAtTime(note.freq, this.audioContext.currentTime);

      gainNode.gain.setValueAtTime(this.musicVolume * 0.15, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + note.duration);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + note.duration);

      // Schedule next note
      this.currentMelodyIndex = (this.currentMelodyIndex + 1) % this.currentMelody.length;
      setTimeout(() => this.playNextNote(), note.duration * 1000);
    } catch (e) {
      console.warn('AudioManager: Error playing note', e);
    }
  }

  stopMusic() {
    if (!this.currentTrack) return;

    console.log('AudioManager: Stopping music');

    // Stop MIDI.js if playing
    if (typeof MIDI !== 'undefined' && MIDI.Player) {
      MIDI.Player.stop();
    }

    // Stop HTML5 audio if playing
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement = null;
    }

    // Stop synthesized music
    this.isPlayingMusic = false;
    this.currentTrack = null;
    this.currentMelody = null;
  }

  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.audioElement) {
      this.audioElement.volume = this.musicVolume;
    }
    // Update MIDI volume (0-127 range)
    if (typeof MIDI !== 'undefined' && MIDI.setVolume) {
      MIDI.setVolume(0, this.musicVolume * 127);
    }
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
