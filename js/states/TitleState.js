import { BaseState } from './BaseState.js';
import { PlayState } from './PlayState.js';
import { CHARACTERS } from '../data/characters.js';

export class TitleState extends BaseState {
  constructor(game) {
    super(game);
    this.blinkTimer = 0;
    this.showText = true;
    this.inputDetected = false;
  }

  enter() {
    this.blinkTimer = 0;
    this.showText = true;
    this.inputDetected = false;
  }

  update(dt) {
    this.blinkTimer += dt;
    if (this.blinkTimer >= 500) {
      this.showText = !this.showText;
      this.blinkTimer = 0;
    }
  }

  render(ctx) {
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;

    ctx.fillStyle = '#ff1493';
    ctx.font = 'bold 64px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('HUNTRIX', centerX, centerY - 80);

    ctx.fillStyle = '#9966ff';
    ctx.font = 'bold 24px monospace';
    ctx.fillText('K-POP DEMON HUNTERS', centerX, centerY - 20);

    if (this.showText) {
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px monospace';
      ctx.fillText('INSERT COIN', centerX, centerY + 60);
      ctx.font = '16px monospace';
      ctx.fillText('PRESS SPACE OR TAP TO START', centerX, centerY + 100);
    }

    ctx.fillStyle = '#666666';
    ctx.font = '12px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('1P RANK S', 20, 40);
    ctx.fillText('SCORE 002025', 20, 60);
  }

  handleInput(inputState) {
    if (inputState.attack && !this.inputDetected) {
      this.inputDetected = true;

      const playState = new PlayState(this.game, CHARACTERS[0], 'easy');
      this.game.changeState(playState);
    }
  }
}
