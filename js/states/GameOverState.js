import { BaseState } from './BaseState.js';
import { CharacterSelectState } from './CharacterSelectState.js';
import { ScoreManager } from '../systems/ScoreManager.js';

export class GameOverState extends BaseState {
  constructor(game, score, character, difficulty, mode = 'story', initials = null) {
    super(game);
    this.score = score;
    this.character = character;
    this.difficulty = difficulty;
    this.mode = mode;
    this.initials = initials;
    this.scoreManager = new ScoreManager();
    this.inputBlocked = true;
    this.inputBlockTimer = 1000; // Block input for 1 second
    this.blinkTimer = 0;
    this.showContinue = false;

    // Save high score with initials
    this.scoreResult = this.scoreManager.saveHighScore(
      mode,
      difficulty,
      character.name,
      score,
      initials
    );

    this.highScores = this.scoreManager.getHighScores(`${mode}_${difficulty}`);
  }

  enter() {
    console.log('Game Over! Score:', this.score);
    console.log('Score result:', this.scoreResult);
  }

  update(dt) {
    // Input blocking timer
    if (this.inputBlockTimer > 0) {
      this.inputBlockTimer -= dt;
      if (this.inputBlockTimer <= 0) {
        this.inputBlocked = false;
      }
    }

    // Blink timer for "continue" text
    this.blinkTimer += dt;
    if (this.blinkTimer >= 500) {
      this.showContinue = !this.showContinue;
      this.blinkTimer = 0;
    }
  }

  render(ctx) {
    // Dark overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const centerX = ctx.canvas.width / 2;

    // Game Over title
    ctx.fillStyle = '#ff0000';
    ctx.font = 'bold 48px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', centerX, 60);

    // Character name
    ctx.fillStyle = this.character.color;
    ctx.font = 'bold 24px monospace';
    ctx.fillText(this.character.name.toUpperCase(), centerX, 100);

    // Final score
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px monospace';
    ctx.fillText('FINAL SCORE', centerX, 140);

    ctx.fillStyle = '#ffff00';
    ctx.font = 'bold 40px monospace';
    ctx.fillText(this.scoreManager.formatScore(this.score), centerX, 180);

    // High score notification
    if (this.scoreResult.isNewRecord) {
      const pulse = Math.sin(Date.now() * 0.005) * 0.3 + 0.7;
      ctx.save();
      ctx.globalAlpha = pulse;
      ctx.fillStyle = '#ff00ff';
      ctx.font = 'bold 28px monospace';
      ctx.fillText('★ NEW RECORD! ★', centerX, 220);
      ctx.restore();
    } else if (this.scoreResult.isHighScore) {
      ctx.fillStyle = '#00ff00';
      ctx.font = 'bold 24px monospace';
      ctx.fillText(`★ TOP ${this.scoreResult.rank}! ★`, centerX, 220);
    }

    // High scores table
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px monospace';
    ctx.fillText(`TOP SCORES - ${this.mode.toUpperCase()} ${this.difficulty.toUpperCase()}`, centerX, 260);

    ctx.font = '14px monospace';
    const startY = 285;
    const lineHeight = 20;

    this.highScores.slice(0, 5).forEach((entry, index) => {
      const y = startY + (index * lineHeight);
      const isCurrentScore = this.scoreResult.rank === index + 1 &&
                             entry.score === this.score;

      if (isCurrentScore) {
        ctx.fillStyle = '#ffff00';
      } else {
        ctx.fillStyle = '#cccccc';
      }

      const rank = `${index + 1}.`.padEnd(3, ' ');
      const initials = entry.initials ? entry.initials : '---';
      const name = entry.character.substring(0, 4).padEnd(4, ' ');
      const score = this.scoreManager.formatScore(entry.score);

      ctx.textAlign = 'left';
      ctx.fillText(`${rank} ${initials} ${name} ${score}`, centerX - 150, y);
    });

    // Continue prompt
    if (!this.inputBlocked && this.showContinue) {
      ctx.fillStyle = '#ffffff';
      ctx.font = '20px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Press SPACE or TAP to continue', centerX, 420);
    }
  }

  handleInput(inputState) {
    if (!inputState.attack) {
      this.inputBlocked = false;
    }

    if (inputState.attack && !this.inputBlocked) {
      const characterSelectState = new CharacterSelectState(this.game);
      this.game.changeState(characterSelectState);
    }
  }
}
