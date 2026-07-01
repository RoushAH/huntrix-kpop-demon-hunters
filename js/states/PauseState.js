import { BaseState } from './BaseState.js';
import { TitleState } from './TitleState.js';

export class PauseState extends BaseState {
  constructor(game, previousState) {
    super(game);
    this.previousState = previousState;
    this.selectedOption = 0; // 0 = Resume, 1 = Quit
    this.lastInputTime = 0;
    this.inputBlocked = true;
  }

  enter() {
    this.selectedOption = 0;
    this.lastInputTime = 0;
    this.inputBlocked = true;
    // Don't change music - keep playing
  }

  update(dt) {
    if (this.lastInputTime > 0) {
      this.lastInputTime -= dt;
    }
  }

  render(ctx) {
    // First render the paused game state behind the overlay
    if (this.previousState && this.previousState.render) {
      this.previousState.render(ctx);
    }

    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;

    // Title
    ctx.fillStyle = '#ff1493';
    ctx.font = 'bold 48px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('PAUSED', centerX, centerY - 80);

    // Menu options
    const options = [
      { text: 'RESUME', y: centerY },
      { text: 'QUIT TO MENU', y: centerY + 60 }
    ];

    options.forEach((option, index) => {
      const isSelected = index === this.selectedOption;

      if (isSelected) {
        // Selection box
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.strokeRect(centerX - 150, option.y - 30, 300, 50);
      }

      ctx.fillStyle = isSelected ? '#ffffff' : '#9966ff';
      ctx.font = 'bold 24px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(option.text, centerX, option.y);
    });

    // Instructions
    ctx.fillStyle = '#666666';
    ctx.font = '16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('↑ ↓ to select | SPACE to confirm | ESC to resume', centerX, ctx.canvas.height - 40);
  }

  handleInput(inputState) {
    // Unblock input when all keys are released
    if (!inputState.up && !inputState.down && !inputState.attack) {
      this.inputBlocked = false;
    }

    if (this.lastInputTime > 0 || this.inputBlocked) return;

    // Navigate menu
    if (inputState.up && this.selectedOption > 0) {
      this.selectedOption--;
      this.lastInputTime = 200;
      this.game.audioManager.playUISound();
    } else if (inputState.down && this.selectedOption < 1) {
      this.selectedOption++;
      this.lastInputTime = 200;
      this.game.audioManager.playUISound();
    }

    // Confirm selection
    if (inputState.attack) {
      this.lastInputTime = 300;
      this.game.audioManager.playSelectSound();

      if (this.selectedOption === 0) {
        // Resume
        this.game.changeState(this.previousState);
      } else {
        // Quit to menu
        const titleState = new TitleState(this.game);
        this.game.changeState(titleState);
      }
    }
  }

  // Special method to handle Escape key from PlayState
  static pauseGame(game, currentState) {
    const pauseState = new PauseState(game, currentState);
    game.changeState(pauseState);
  }
}
