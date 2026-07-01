export class AudioManager {
  constructor() {
    this.musicEnabled = true;
    this.sfxEnabled = true;
    this.musicVolume = 0.3; // Lower default - MIDI can be loud
    this.sfxVolume = 0.5; // Moderate default for beeps

    // MIDI tracks - MIDI.js will handle playback
    this.tracks = {
      title: 'assets/audio/music/Level1.mid',    // Title plays Level 1 music
      level1: 'assets/audio/music/Level1.mid',
      level2: 'assets/audio/music/Level2.mid',
      level3: 'assets/audio/music/Level3.mid',
      boss: 'assets/audio/music/KPop Demon Hunters - Your Idol.mid',
      victory: 'assets/audio/music/Level1.mid',
      gameover: 'assets/audio/music/Level1.mid'
    };

    this.audioElement = null; // HTML5 Audio element for music
    this.midiPlayer = null;
    this.midiInstrument = null;
    this.midiReady = false;
    this.pendingTrack = null;

    this.currentTrack = null;
    this.currentTrackPath = null; // Track the actual file path, not just the track name
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

    // Initialize midi-player-js and soundfont-player
    if (typeof MidiPlayer !== 'undefined' && typeof Soundfont !== 'undefined') {
      console.log('AudioManager: Initializing MIDI player...');

      this.midiPlayer = new MidiPlayer.Player((event) => {
        if (this.midiInstrument && event.name === 'Note on') {
          this.midiInstrument.play(event.noteName, this.audioContext.currentTime, {
            gain: this.musicVolume * (event.velocity / 100)
          });
        }
      });

      // Load soundfont
      Soundfont.instrument(this.audioContext, 'acoustic_grand_piano').then((instrument) => {
        console.log('AudioManager: Soundfont loaded');
        this.midiInstrument = instrument;
        this.midiReady = true;

        // Play pending track if any
        if (this.pendingTrack) {
          this.playMusic(this.pendingTrack);
          this.pendingTrack = null;
        }
      }).catch((err) => {
        console.warn('AudioManager: Soundfont load failed', err);
      });
    } else {
      console.warn('AudioManager: MIDI player libraries not loaded. MidiPlayer:', typeof MidiPlayer, 'Soundfont:', typeof Soundfont);
    }

    console.log('AudioManager: MIDI tracks available:', Object.keys(this.tracks));
  }

  // Music control
  playMusic(trackName) {
    if (!this.musicEnabled) return;

    const trackPath = this.tracks[trackName];

    // Check if already playing the same FILE (not just same track name)
    if (this.currentTrackPath === trackPath && this.midiPlayer && this.midiPlayer.isPlaying()) {
      console.log('AudioManager: Already playing this file, continuing:', trackPath);
      return;
    }

    this.stopMusic();
    this.currentTrack = trackName;
    this.currentTrackPath = trackPath;

    console.log('AudioManager: Playing music track:', trackName, trackPath);

    // Try to load audio file
    this.tryLoadAudioFile(trackPath, trackName);
  }

  tryLoadAudioFile(path, trackName) {
    // Try MIDI player
    if (this.midiReady && this.midiPlayer) {
      console.log('AudioManager: Loading MIDI file:', path);

      // Fetch and load the MIDI file
      fetch(path)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          return response.arrayBuffer();
        })
        .then(arrayBuffer => {
          console.log('AudioManager: ✓ MIDI file fetched, loading...');
          this.midiPlayer.loadArrayBuffer(arrayBuffer);

          // Set tempo to 130% (1.3x speed)
          this.midiPlayer.tempo = 130;

          this.midiPlayer.on('endOfFile', () => {
            // Loop the music
            this.midiPlayer.play();
          });
          this.midiPlayer.play();
          console.log('AudioManager: ✓ MIDI playback started at 140% tempo');
        })
        .catch(err => {
          console.error('AudioManager: ✗ MIDI load failed:', err);
          console.log('AudioManager: Tried to load:', path);
        });
    } else if (!this.midiReady && this.midiPlayer) {
      // MIDI player not ready yet, queue for later
      console.log('AudioManager: MIDI player not ready yet, queuing track:', trackName);
      this.pendingTrack = trackName;
    } else {
      // MIDI player not available, no music
      console.error('AudioManager: MIDI player not available! MidiPlayer:', typeof MidiPlayer);
      console.log('AudioManager: No music will play');
    }
  }


  stopMusic() {
    if (!this.currentTrack) return;

    console.log('AudioManager: Stopping music');

    // Stop MIDI player if playing
    if (this.midiPlayer) {
      this.midiPlayer.stop();
    }

    // Stop HTML5 audio if playing
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement = null;
    }

    this.currentTrack = null;
    this.currentTrackPath = null;
  }

  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    console.log('AudioManager: Music volume set to', this.musicVolume);
    if (this.audioElement) {
      this.audioElement.volume = this.musicVolume;
    }
    // Volume is handled per-note in midi-player callback
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

      gainNode.gain.setValueAtTime(this.sfxVolume * 0.2, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (e) {
      console.warn('AudioManager: Error playing SFX', e);
    }
  }

  // Specific sound effect methods
  playAttackSound(characterType) {
    if (characterType === 'zoey') {
      this.playSFX('attack', 880, 0.05); // High pitch for knife throw
    } else if (characterType === 'mira') {
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

      gainNode.gain.setValueAtTime(this.sfxVolume * 0.2, this.audioContext.currentTime);
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
    console.log('AudioManager: SFX volume set to', this.sfxVolume);
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
