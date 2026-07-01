import { BaseState } from './BaseState.js';
import { PlayState } from './PlayState.js';
import { CHARACTERS } from '../data/characters.js';

export class DifficultySelectState extends BaseState {
  constructor(game, characterData) {
    super(game);
    this.characterData = characterData;
    this.selectedIndex = 0;
    this.confirmTimer = 0;
    this.lastInputTime = 0;
    this.difficulties = ['easy', 'hard'];
  }

  enter() {
    this.selectedIndex = 0;
    this.confirmTimer = 0;
    this.lastInputTime = 0;
    this.inputBlocked = true;
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
    ctx.fillText('SELECT DIFFICULTY', centerX, 80);

    ctx.fillStyle = this.characterData.color;
    ctx.font = 'bold 20px monospace';
    ctx.fillText(`${this.characterData.name.toUpperCase()} READY`, centerX, 130);

    const startY = 200;
    const spacing = 100;

    const difficultyInfo = [
      {
        name: 'EASY',
        color: '#00ff00',
        description: 'Perfect for young hunters',
        details: ['Slower enemies', 'More health', 'Forgiving hitboxes', '20% health pill drops']
      },
      {
        name: 'HARD',
        color: '#ff0000',
        description: 'For experienced demon slayers',
        details: ['Faster enemies', 'Less health', 'Precise combat', '10% health pill drops']
      }
    ];

    difficultyInfo.forEach((diff, index) => {
      const y = startY + (index * spacing);
      const isSelected = index === this.selectedIndex;

      if (isSelected) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.strokeRect(centerX - 250, y - 30, 500, 80);
      }

      ctx.fillStyle = isSelected ? diff.color : '#666666';
      ctx.font = 'bold 24px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(diff.name, centerX - 230, y);

      ctx.font = '14px monospace';
      ctx.fillStyle = isSelected ? '#ffffff' : '#999999';
      ctx.fillText(diff.description, centerX - 230, y + 20);

      diff.details.forEach((detail, i) => {
        ctx.font = '12px monospace';
        ctx.fillStyle = isSelected ? '#cccccc' : '#666666';
        ctx.fillText(`• ${detail}`, centerX - 220, y + 38 + (i * 14));
      });
    });

    ctx.fillStyle = '#666666';
    ctx.font = '16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('↑ ↓ to select | SPACE/TAP to confirm', centerX, ctx.canvas.height - 40);
  }

  handleInput(inputState) {
    if (!inputState.attack) {
      this.inputBlocked = false;
    }

    if (this.lastInputTime > 0 || this.inputBlocked) return;

    if (inputState.up && this.selectedIndex > 0) {
      this.selectedIndex--;
      this.lastInputTime = 200;
    } else if (inputState.down && this.selectedIndex < this.difficulties.length - 1) {
      this.selectedIndex++;
      this.lastInputTime = 200;
    } else if (inputState.attack && this.confirmTimer <= 0) {
      this.confirmTimer = 300;
      const selectedDifficulty = this.difficulties[this.selectedIndex];

      const characterOrder = [this.characterData];
      CHARACTERS.forEach(char => {
        if (char.name !== this.characterData.name) {
          characterOrder.push(char);
        }
      });

      const playState = new PlayState(
        this.game,
        this.characterData,
        selectedDifficulty,
        'story',
        1,
        characterOrder
      );
      this.game.changeState(playState);
    }
  }
}
