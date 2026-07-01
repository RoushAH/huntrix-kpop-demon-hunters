import { BaseState } from './BaseState.js';
import { GameOverState } from './GameOverState.js';

export class InitialsEntryState extends BaseState {
  constructor(game, score, character, difficulty, mode) {
    super(game);
    this.score = score;
    this.character = character;
    this.difficulty = difficulty;
    this.mode = mode;

    this.initials = ['A', 'A', 'A'];
    this.currentPosition = 0; // 0, 1, or 2
    this.inputBlocked = true;
    this.inputBlockTimer = 300;
    this.blinkTimer = 0;
    this.showCursor = true;

    this.alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  }

  enter() {
    console.log('Enter your initials! Score:', this.score);
  }

  update(dt) {
    if (this.inputBlockTimer > 0) {
      this.inputBlockTimer -= dt;
      if (this.inputBlockTimer <= 0) {
        this.inputBlocked = false;
      }
    }

    this.blinkTimer += dt;
    if (this.blinkTimer >= 300) {
      this.showCursor = !this.showCursor;
      this.blinkTimer = 0;
    }
  }

  render(ctx) {
    // Dark background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.95)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const centerX = ctx.canvas.width / 2;

    // Title with pulsing effect
    const pulse = Math.sin(Date.now() * 0.005) * 0.3 + 0.7;
    ctx.save();
    ctx.globalAlpha = pulse;
    ctx.fillStyle = '#ffff00';
    ctx.font = 'bold 48px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('NEW HIGH SCORE!', centerX, 80);
    ctx.restore();

    // Score
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px monospace';
    ctx.fillText(this.formatScore(this.score), centerX, 130);

    // Character name
    ctx.fillStyle = this.character.color;
    ctx.font = 'bold 24px monospace';
    ctx.fillText(this.character.name.toUpperCase(), centerX, 165);

    // Instructions
    ctx.fillStyle = '#cccccc';
    ctx.font = '18px monospace';
    ctx.fillText('ENTER YOUR INITIALS', centerX, 210);

    // Initials display
    const letterSpacing = 80;
    const startX = centerX - letterSpacing;
    const letterY = 280;

    for (let i = 0; i < 3; i++) {
      const x = startX + (i * letterSpacing);

      // Box around current letter
      if (i === this.currentPosition) {
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 3;
        ctx.strokeRect(x - 35, letterY - 50, 70, 70);
      } else {
        ctx.strokeStyle = '#666666';
        ctx.lineWidth = 2;
        ctx.strokeRect(x - 35, letterY - 50, 70, 70);
      }

      // Letter
      ctx.fillStyle = i === this.currentPosition ? '#ffff00' : '#ffffff';
      ctx.font = 'bold 48px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(this.initials[i], x, letterY);

      // Blinking cursor under current letter
      if (i === this.currentPosition && this.showCursor) {
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(x - 30, letterY + 10, 60, 4);
      }
    }

    // Controls
    ctx.fillStyle = '#aaaaaa';
    ctx.font = '16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('↑/↓ or SWIPE: Change Letter', centerX, 360);
    ctx.fillText('←/→ or TAP: Move Position', centerX, 385);
    ctx.fillText('SPACE or DOUBLE-TAP: Confirm', centerX, 410);
  }

  handleInput(inputState) {
    if (this.inputBlocked) return;

    // Navigate between positions
    if (inputState.left && !this.wasLeft) {
      this.currentPosition = (this.currentPosition - 1 + 3) % 3;
      this.inputBlocked = true;
      this.inputBlockTimer = 150;
    }
    this.wasLeft = inputState.left;

    if (inputState.right && !this.wasRight) {
      this.currentPosition = (this.currentPosition + 1) % 3;
      this.inputBlocked = true;
      this.inputBlockTimer = 150;
    }
    this.wasRight = inputState.right;

    // Change letter
    if (inputState.up && !this.wasUp) {
      const currentIndex = this.alphabet.indexOf(this.initials[this.currentPosition]);
      const nextIndex = (currentIndex + 1) % this.alphabet.length;
      this.initials[this.currentPosition] = this.alphabet[nextIndex];
      this.inputBlocked = true;
      this.inputBlockTimer = 100;
    }
    this.wasUp = inputState.up;

    if (inputState.down && !this.wasDown) {
      const currentIndex = this.alphabet.indexOf(this.initials[this.currentPosition]);
      const prevIndex = (currentIndex - 1 + this.alphabet.length) % this.alphabet.length;
      this.initials[this.currentPosition] = this.alphabet[prevIndex];
      this.inputBlocked = true;
      this.inputBlockTimer = 100;
    }
    this.wasDown = inputState.down;

    // Confirm
    if (inputState.attack && !this.wasAttack) {
      const initialsString = this.initials.join('');
      console.log('Initials entered:', initialsString);

      const gameOverState = new GameOverState(
        this.game,
        this.score,
        this.character,
        this.difficulty,
        this.mode,
        initialsString
      );
      this.game.changeState(gameOverState);
    }
    this.wasAttack = inputState.attack;
  }

  formatScore(score) {
    return score.toString().padStart(8, '0');
  }
}
