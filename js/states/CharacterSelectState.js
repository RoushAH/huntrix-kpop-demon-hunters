import { BaseState } from './BaseState.js';
import { DifficultySelectState } from './DifficultySelectState.js';
import { CHARACTERS } from '../data/characters.js';

export class CharacterSelectState extends BaseState {
  constructor(game) {
    super(game);
    this.selectedIndex = 0;
    this.confirmTimer = 0;
    this.lastInputTime = 0;
  }

  enter() {
    this.selectedIndex = 0;
    this.confirmTimer = 0;
    this.lastInputTime = 0;
  }

  update(dt) {
    if (this.confirmTimer > 0) {
      this.confirmTimer -= dt;
    }
    if (this.lastInputTime > 0) {
      this.lastInputTime -= dt;
    }
  }

  render(ctx) {
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;

    ctx.fillStyle = '#1a0033';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = '#ff1493';
    ctx.font = 'bold 32px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SELECT YOUR HUNTER', centerX, 60);

    const startX = 150;
    const spacing = 200;

    CHARACTERS.forEach((char, index) => {
      const x = startX + (index * spacing);
      const y = centerY;
      const isSelected = index === this.selectedIndex;

      if (isSelected) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.strokeRect(x - 65, y - 85, 130, 180);
      }

      ctx.fillStyle = char.color;
      ctx.fillRect(x - 16, y - 24, 32, 48);

      ctx.fillStyle = isSelected ? '#ffffff' : '#9966ff';
      ctx.font = 'bold 20px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(char.name.toUpperCase(), x, y + 50);

      ctx.font = '14px monospace';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`STR ${this.renderHearts(char.str)}`, x, y + 75);
      ctx.fillText(`SPD ${this.renderHearts(char.spd)}`, x, y + 92);
      ctx.fillText(`VOX ${this.renderHearts(char.vocalRange)}`, x, y + 109);
    });

    ctx.fillStyle = '#666666';
    ctx.font = '16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('← → to select | SPACE/TAP to confirm', centerX, ctx.canvas.height - 40);
  }

  renderHearts(count) {
    return '♥'.repeat(count);
  }

  handleInput(inputState) {
    if (this.lastInputTime > 0) return;

    if (inputState.left && this.selectedIndex > 0) {
      this.selectedIndex--;
      this.lastInputTime = 200;
    } else if (inputState.right && this.selectedIndex < CHARACTERS.length - 1) {
      this.selectedIndex++;
      this.lastInputTime = 200;
    } else if (inputState.attack && this.confirmTimer <= 0) {
      this.confirmTimer = 300;
      const selectedCharacter = CHARACTERS[this.selectedIndex];
      const difficultyState = new DifficultySelectState(this.game, selectedCharacter);
      this.game.changeState(difficultyState);
    }
  }
}
