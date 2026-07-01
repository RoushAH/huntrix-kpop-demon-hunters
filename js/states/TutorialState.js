import { BaseState } from './BaseState.js';
import { CharacterSelectState } from './CharacterSelectState.js';

export class TutorialState extends BaseState {
  constructor(game) {
    super(game);
    this.animTimer = 0;
    this.animFrame = 0;
    this.skipTimer = 0;
  }

  enter() {
    this.animTimer = 0;
    this.animFrame = 0;
    this.skipTimer = 0;
    this.inputBlocked = true; // Block input until key is released
  }

  update(dt) {
    this.animTimer += dt;
    if (this.animTimer >= 500) {
      this.animFrame = (this.animFrame + 1) % 3;
      this.animTimer = 0;
    }

    if (this.skipTimer > 0) {
      this.skipTimer -= dt;
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
    ctx.font = 'bold 32px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('HOW TO PLAY', centerX, 60);

    // Detect input mode and show appropriate instructions
    const inputMode = this.game.inputManager.getInputMode();

    if (inputMode === 'keyboard' || !inputMode) {
      this.renderKeyboardInstructions(ctx, centerX, centerY);
    } else {
      this.renderTouchInstructions(ctx, centerX, centerY);
    }

    // Skip prompt (blink)
    if (Math.floor(this.animTimer / 250) % 2 === 0) {
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('PRESS SPACE OR TAP TO CONTINUE', centerX, ctx.canvas.height - 40);
    }
  }

  renderKeyboardInstructions(ctx, centerX, centerY) {
    const leftCol = centerX - 200;
    const rightCol = centerX + 200;
    const topRow = centerY - 60;
    const bottomRow = centerY + 60;

    // Movement section
    ctx.fillStyle = '#9966ff';
    ctx.font = 'bold 24px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('MOVE', leftCol, topRow - 40);

    // Arrow keys diagram
    this.drawArrowKeys(ctx, leftCol, topRow);

    ctx.fillStyle = '#ffffff';
    ctx.font = '16px monospace';
    ctx.fillText('or WASD', leftCol, topRow + 80);

    // Attack section
    ctx.fillStyle = '#9966ff';
    ctx.font = 'bold 24px monospace';
    ctx.fillText('ATTACK', rightCol, topRow - 40);

    // Space key
    this.drawSpaceKey(ctx, rightCol, topRow);

    ctx.fillStyle = '#ffffff';
    ctx.font = '16px monospace';
    ctx.fillText('or X key', rightCol, topRow + 80);

    // Objective
    ctx.fillStyle = '#ff1493';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('DEFEAT ALL DEMONS!', centerX, bottomRow + 40);

    // Enemy icon
    this.drawEnemyIcon(ctx, centerX, bottomRow + 80);
  }

  renderTouchInstructions(ctx, centerX, centerY) {
    const leftCol = centerX - 200;
    const rightCol = centerX + 200;
    const topRow = centerY - 40;
    const bottomRow = centerY + 80;

    // Movement section
    ctx.fillStyle = '#9966ff';
    ctx.font = 'bold 24px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('MOVE', leftCol, topRow - 40);

    // Drag gesture
    this.drawDragGesture(ctx, leftCol, topRow, this.animFrame);

    ctx.fillStyle = '#ffffff';
    ctx.font = '16px monospace';
    ctx.fillText('DRAG', leftCol, topRow + 80);

    // Attack section
    ctx.fillStyle = '#9966ff';
    ctx.font = 'bold 24px monospace';
    ctx.fillText('ATTACK', rightCol, topRow - 40);

    // Tap gesture
    this.drawTapGesture(ctx, rightCol, topRow, this.animFrame);

    ctx.fillStyle = '#ffffff';
    ctx.font = '16px monospace';
    ctx.fillText('TAP', rightCol, topRow + 80);

    // Objective
    ctx.fillStyle = '#ff1493';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('DEFEAT ALL DEMONS!', centerX, bottomRow + 40);

    // Enemy icon
    this.drawEnemyIcon(ctx, centerX, bottomRow + 80);
  }

  drawArrowKeys(ctx, x, y) {
    const keySize = 30;
    const spacing = 35;

    // Up arrow
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x - keySize/2, y - spacing - keySize/2, keySize, keySize);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('↑', x, y - spacing);

    // Down arrow
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x - keySize/2, y + spacing - keySize/2, keySize, keySize);
    ctx.fillStyle = '#000000';
    ctx.fillText('↓', x, y + spacing);

    // Left arrow
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x - spacing - keySize/2, y - keySize/2, keySize, keySize);
    ctx.fillStyle = '#000000';
    ctx.fillText('←', x - spacing, y);

    // Right arrow
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + spacing - keySize/2, y - keySize/2, keySize, keySize);
    ctx.fillStyle = '#000000';
    ctx.fillText('→', x + spacing, y);

    ctx.textBaseline = 'alphabetic';
  }

  drawSpaceKey(ctx, x, y) {
    const width = 80;
    const height = 30;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x - width/2, y - height/2, width, height);

    ctx.fillStyle = '#000000';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SPACE', x, y);

    ctx.textBaseline = 'alphabetic';
  }

  drawDragGesture(ctx, x, y, frame) {
    // Hand icon
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('☝', x, y);

    // Animated trail
    if (frame > 0) {
      const offsetX = (frame === 1) ? -10 : -20;
      const offsetY = (frame === 1) ? -5 : -10;
      ctx.globalAlpha = 0.5;
      ctx.fillText('☝', x + offsetX, y + offsetY);
      ctx.globalAlpha = 1.0;
    }

    ctx.textBaseline = 'alphabetic';
  }

  drawTapGesture(ctx, x, y, frame) {
    // Hand icon
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('☝', x, y);

    // Pulse effect
    if (frame === 1) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x, y, 35, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.textBaseline = 'alphabetic';
  }

  drawEnemyIcon(ctx, x, y) {
    // Simple demon icon
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(x - 16, y - 24, 32, 48);

    // Horns
    ctx.fillStyle = '#990000';
    ctx.beginPath();
    ctx.moveTo(x - 16, y - 24);
    ctx.lineTo(x - 20, y - 32);
    ctx.lineTo(x - 12, y - 24);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x + 16, y - 24);
    ctx.lineTo(x + 20, y - 32);
    ctx.lineTo(x + 12, y - 24);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#ffff00';
    ctx.fillRect(x - 10, y - 16, 6, 6);
    ctx.fillRect(x + 4, y - 16, 6, 6);
  }

  handleInput(inputState) {
    if (!inputState.attack) {
      this.inputBlocked = false;
    }

    if (inputState.attack && !this.inputBlocked && this.skipTimer <= 0) {
      this.skipTimer = 300;
      this.game.audioManager.playSelectSound();
      const characterSelectState = new CharacterSelectState(this.game);
      this.game.changeState(characterSelectState);
    }
  }
}
