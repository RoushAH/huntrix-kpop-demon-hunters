import { BaseState } from './BaseState.js';
import { TitleState } from './TitleState.js';

export class OptionsState extends BaseState {
  constructor(game) {
    super(game);
    this.selectedOption = 0; // 0 = music volume, 1 = sfx volume, 2 = back
    this.lastInputTime = 0;
    this.inputBlocked = true;

    // Get current settings from AudioManager
    this.musicVolume = Math.round(this.game.audioManager.musicVolume * 100);
    this.sfxVolume = Math.round(this.game.audioManager.sfxVolume * 100);
    this.musicEnabled = this.game.audioManager.musicEnabled;
    this.sfxEnabled = this.game.audioManager.sfxEnabled;
  }

  enter() {
    this.selectedOption = 0;
    this.lastInputTime = 0;
    this.inputBlocked = true;
    // Keep current music playing
  }

  update(dt) {
    if (this.lastInputTime > 0) {
      this.lastInputTime -= dt;
    }
  }

  render(ctx) {
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;

    // Background
    ctx.fillStyle = '#1a0033';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Title
    ctx.fillStyle = '#ff1493';
    ctx.font = 'bold 48px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('OPTIONS', centerX, 80);

    // Music Volume
    const musicY = centerY - 80;
    this.renderVolumeSlider(ctx, 'MUSIC VOLUME', this.musicVolume, this.musicEnabled, musicY, this.selectedOption === 0);

    // SFX Volume
    const sfxY = centerY;
    this.renderVolumeSlider(ctx, 'SFX VOLUME', this.sfxVolume, this.sfxEnabled, sfxY, this.selectedOption === 1);

    // Back button
    const backY = centerY + 100;
    const isBackSelected = this.selectedOption === 2;

    if (isBackSelected) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.strokeRect(centerX - 100, backY - 30, 200, 50);
    }

    ctx.fillStyle = isBackSelected ? '#ffffff' : '#9966ff';
    ctx.font = 'bold 24px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('BACK', centerX, backY);

    // Instructions
    ctx.fillStyle = '#666666';
    ctx.font = '14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('↑ ↓ to select | ← → to adjust | SPACE to toggle/confirm', centerX, ctx.canvas.height - 40);
  }

  renderVolumeSlider(ctx, label, volume, enabled, y, isSelected) {
    const centerX = ctx.canvas.width / 2;
    const sliderWidth = 300;
    const sliderHeight = 20;
    const sliderX = centerX - sliderWidth / 2;

    // Label
    ctx.fillStyle = isSelected ? '#ffffff' : '#9966ff';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(label, centerX, y - 20);

    // Selection box
    if (isSelected) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(sliderX - 10, y - 35, sliderWidth + 20, 70);
    }

    // Slider background
    ctx.fillStyle = '#333333';
    ctx.fillRect(sliderX, y, sliderWidth, sliderHeight);

    // Slider fill (only if enabled)
    if (enabled) {
      const fillWidth = (volume / 100) * sliderWidth;
      ctx.fillStyle = isSelected ? '#ff1493' : '#9966ff';
      ctx.fillRect(sliderX, y, fillWidth, sliderHeight);
    }

    // Slider border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(sliderX, y, sliderWidth, sliderHeight);

    // Volume text
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px monospace';
    ctx.textAlign = 'center';
    const statusText = enabled ? `${volume}%` : 'MUTED';
    ctx.fillText(statusText, centerX, y + sliderHeight + 20);
  }

  handleInput(inputState) {
    // Unblock input when all keys released
    if (!inputState.up && !inputState.down && !inputState.left && !inputState.right && !inputState.attack) {
      this.inputBlocked = false;
    }

    if (this.lastInputTime > 0 || this.inputBlocked) return;

    // Navigate options
    if (inputState.up && this.selectedOption > 0) {
      this.selectedOption--;
      this.lastInputTime = 200;
      this.game.audioManager.playUISound();
    } else if (inputState.down && this.selectedOption < 2) {
      this.selectedOption++;
      this.lastInputTime = 200;
      this.game.audioManager.playUISound();
    }

    // Adjust music volume
    if (this.selectedOption === 0) {
      if (inputState.left && this.musicVolume > 0) {
        this.musicVolume = Math.max(0, this.musicVolume - 5);
        this.musicEnabled = this.musicVolume > 0;
        this.applySettings();
        this.lastInputTime = 100;
      } else if (inputState.right && this.musicVolume < 100) {
        this.musicVolume = Math.min(100, this.musicVolume + 5);
        this.musicEnabled = true;
        this.applySettings();
        this.lastInputTime = 100;
      } else if (inputState.attack) {
        // Toggle mute
        this.musicEnabled = !this.musicEnabled;
        if (!this.musicEnabled) {
          this.game.audioManager.stopMusic();
        }
        this.applySettings();
        this.lastInputTime = 300;
        this.game.audioManager.playUISound();
      }
    }

    // Adjust SFX volume
    if (this.selectedOption === 1) {
      if (inputState.left && this.sfxVolume > 0) {
        this.sfxVolume = Math.max(0, this.sfxVolume - 5);
        this.sfxEnabled = this.sfxVolume > 0;
        this.applySettings();
        this.lastInputTime = 100;
        this.game.audioManager.playUISound(); // Test the new volume
      } else if (inputState.right && this.sfxVolume < 100) {
        this.sfxVolume = Math.min(100, this.sfxVolume + 5);
        this.sfxEnabled = true;
        this.applySettings();
        this.lastInputTime = 100;
        this.game.audioManager.playUISound(); // Test the new volume
      } else if (inputState.attack) {
        // Toggle mute
        this.sfxEnabled = !this.sfxEnabled;
        this.applySettings();
        this.lastInputTime = 300;
        if (this.sfxEnabled) {
          this.game.audioManager.playUISound(); // Test sound
        }
      }
    }

    // Back button
    if (this.selectedOption === 2 && inputState.attack) {
      this.saveSettings();
      this.game.audioManager.playSelectSound();
      const titleState = new TitleState(this.game);
      this.game.changeState(titleState);
    }
  }

  applySettings() {
    // Apply to AudioManager
    this.game.audioManager.musicVolume = this.musicVolume / 100;
    this.game.audioManager.sfxVolume = this.sfxVolume / 100;
    this.game.audioManager.musicEnabled = this.musicEnabled;
    this.game.audioManager.sfxEnabled = this.sfxEnabled;

    // Apply music volume if currently playing
    this.game.audioManager.setMusicVolume(this.musicVolume / 100);
  }

  saveSettings() {
    // Save to localStorage
    try {
      localStorage.setItem('huntrix_music_volume', this.musicVolume.toString());
      localStorage.setItem('huntrix_sfx_volume', this.sfxVolume.toString());
      localStorage.setItem('huntrix_music_enabled', this.musicEnabled.toString());
      localStorage.setItem('huntrix_sfx_enabled', this.sfxEnabled.toString());
      console.log('OptionsState: Settings saved');
    } catch (e) {
      console.warn('OptionsState: Failed to save settings', e);
    }
  }

  static loadSettings(audioManager) {
    // Load from localStorage on game start
    try {
      const musicVolume = localStorage.getItem('huntrix_music_volume');
      const sfxVolume = localStorage.getItem('huntrix_sfx_volume');
      const musicEnabled = localStorage.getItem('huntrix_music_enabled');
      const sfxEnabled = localStorage.getItem('huntrix_sfx_enabled');

      if (musicVolume !== null) {
        audioManager.musicVolume = parseInt(musicVolume) / 100;
      }
      if (sfxVolume !== null) {
        audioManager.sfxVolume = parseInt(sfxVolume) / 100;
      }
      if (musicEnabled !== null) {
        audioManager.musicEnabled = musicEnabled === 'true';
      }
      if (sfxEnabled !== null) {
        audioManager.sfxEnabled = sfxEnabled === 'true';
      }

      console.log('OptionsState: Settings loaded', {
        musicVolume: audioManager.musicVolume,
        sfxVolume: audioManager.sfxVolume,
        musicEnabled: audioManager.musicEnabled,
        sfxEnabled: audioManager.sfxEnabled
      });
    } catch (e) {
      console.warn('OptionsState: Failed to load settings', e);
    }
  }
}
