import { BaseState } from './BaseState.js';
import { BossState } from './BossState.js';
import { CHARACTERS } from '../data/characters.js';

export class BossCharacterSelectState extends BaseState {
  constructor(game, difficulty, scoreManager, allCharacters) {
    super(game);
    this.difficulty = difficulty;
    this.scoreManager = scoreManager;
    this.allCharacters = allCharacters;

    this.selectedIndex = 0;
    this.characters = CHARACTERS;
    this.inputBlocked = false;
  }

  enter() {
    this.inputBlocked = false;
    // Continue same music or play title music
    if (!this.game.audioManager.currentTrack) {
      this.game.audioManager.playMusic('title');
    }
  }

  update(dt) {
    // Nothing to update
  }

  render(ctx) {
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;

    // Background
    ctx.fillStyle = '#1a0033';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Title
    ctx.fillStyle = '#ff00ff';
    ctx.font = 'bold 48px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('FINAL BATTLE', centerX, 80);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('Choose Your Fighter', centerX, 120);

    // Character options
    const startX = 150;
    const spacing = 200;

    this.characters.forEach((char, index) => {
      const x = startX + (index * spacing);
      const y = centerY;
      const isSelected = index === this.selectedIndex;

      // Character box
      if (isSelected) {
        ctx.fillStyle = char.color;
        ctx.fillRect(x - 5, y - 5, 110, 150);

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x, y, 100, 140);
      } else {
        ctx.fillStyle = '#333333';
        ctx.fillRect(x, y, 100, 140);
      }

      // Character placeholder
      ctx.fillStyle = char.color;
      ctx.fillRect(x + 10, y + 10, 80, 80);

      // Name
      ctx.fillStyle = isSelected ? char.color : '#ffffff';
      ctx.font = 'bold 16px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(char.name, x + 50, y + 110);

      // Stats
      ctx.font = '12px monospace';
      ctx.fillStyle = isSelected ? '#000000' : '#aaaaaa';
      ctx.fillText(`STR: ${char.str}`, x + 50, y + 128);
    });

    // Instructions
    ctx.fillStyle = '#ffff00';
    ctx.font = '16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('← → to select     ENTER to confirm', centerX, ctx.canvas.height - 40);

    // Current score
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`SCORE: ${this.scoreManager.currentScore}`, ctx.canvas.width - 20, 30);
    ctx.fillText(`DIFFICULTY: ${this.difficulty.toUpperCase()}`, ctx.canvas.width - 20, 50);
  }

  handleInput(inputState) {
    if (!inputState.confirm && !inputState.left && !inputState.right) {
      this.inputBlocked = false;
    }

    if (this.inputBlocked) return;

    if (inputState.left) {
      this.selectedIndex = (this.selectedIndex - 1 + this.characters.length) % this.characters.length;
      this.game.audioManager.playUISound();
      this.inputBlocked = true;
    } else if (inputState.right) {
      this.selectedIndex = (this.selectedIndex + 1) % this.characters.length;
      this.game.audioManager.playUISound();
      this.inputBlocked = true;
    } else if (inputState.confirm) {
      const selectedCharacter = this.characters[this.selectedIndex];
      this.game.audioManager.playSelectSound();

      const bossState = new BossState(
        this.game,
        selectedCharacter,
        this.difficulty,
        this.scoreManager,
        this.allCharacters
      );
      this.game.changeState(bossState);
      this.inputBlocked = true;
    }
  }
}
