import { BaseState } from './BaseState.js';
import { TutorialState } from './TutorialState.js';
import { OptionsState } from './OptionsState.js';

export class TitleState extends BaseState {
  constructor(game) {
    super(game);
    this.blinkTimer = 0;
    this.showText = true;
    this.inputDetected = false;
    this.selectedOption = 0; // 0 = start, 1 = options
    this.lastInputTime = 0;
  }

  enter() {
    this.blinkTimer = 0;
    this.showText = true;
    this.inputDetected = false;
    this.inputBlocked = false;
    this.selectedOption = 0;
    this.lastInputTime = 0;

    // Load saved audio settings
    OptionsState.loadSettings(this.game.audioManager);

    // Don't start music until user interaction (browser autoplay policy)
  }

  update(dt) {
    this.blinkTimer += dt;
    if (this.blinkTimer >= 500) {
      this.showText = !this.showText;
      this.blinkTimer = 0;
    }

    if (this.lastInputTime > 0) {
      this.lastInputTime -= dt;
    }
  }

  render(ctx) {
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;

    // Draw poster as background (slightly dimmed)
    const poster = this.game.images['poster'];
    if (poster && poster.complete) {
      ctx.globalAlpha = 0.4;
      const posterWidth = ctx.canvas.width;
      const posterHeight = (poster.height / poster.width) * posterWidth;
      const posterY = (ctx.canvas.height - posterHeight) / 2;
      ctx.drawImage(poster, 0, posterY, posterWidth, posterHeight);
      ctx.globalAlpha = 1.0;

      // Dark overlay for text readability
      ctx.fillStyle = 'rgba(26, 0, 51, 0.6)';
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    } else {
      // Fallback solid background
      ctx.fillStyle = '#1a0033';
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    // Draw logo sprite
    const logo = this.game.images['logo'];
    if (logo && logo.complete) {
      const logoScale = 1.0; // Adjust as needed
      const logoWidth = logo.width * logoScale;
      const logoHeight = logo.height * logoScale;
      const logoX = centerX - logoWidth / 2;
      const logoY = centerY - 120;

      // Add glow effect
      ctx.shadowColor = '#ff1493';
      ctx.shadowBlur = 20;
      ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight);
      ctx.shadowBlur = 0;
    } else {
      // Fallback text
      ctx.shadowColor = '#ff1493';
      ctx.shadowBlur = 20;
      ctx.fillStyle = '#ff1493';
      ctx.font = 'bold 64px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('HUNTRIX', centerX, centerY - 80);
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#9966ff';
      ctx.font = 'bold 24px monospace';
      ctx.fillText('K-POP DEMON HUNTERS', centerX, centerY - 20);
    }

    // Draw INSERT COIN sprite (blinking)
    if (this.showText) {
      const insertCoin = this.game.images['insert_coin'];
      if (insertCoin && insertCoin.complete) {
        const coinScale = 0.8;
        const coinWidth = insertCoin.width * coinScale;
        const coinHeight = insertCoin.height * coinScale;
        const coinX = centerX - coinWidth / 2;
        const coinY = centerY + 20;
        ctx.drawImage(insertCoin, coinX, coinY, coinWidth, coinHeight);
      } else {
        // Fallback text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('INSERT COIN', centerX, centerY + 40);
      }
    }

    // Menu options
    const startY = centerY + 100;
    const optionsY = centerY + 140;

    // Start button - text only, no sprite
    if (this.selectedOption === 0) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.strokeRect(centerX - 100, startY - 25, 200, 40);
    }
    ctx.fillStyle = this.selectedOption === 0 ? '#ffffff' : '#9966ff';
    ctx.font = 'bold 18px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('START', centerX, startY);

    // Options button (text based)
    if (this.selectedOption === 1) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.strokeRect(centerX - 100, optionsY - 25, 200, 40);
    }
    ctx.fillStyle = this.selectedOption === 1 ? '#ffffff' : '#9966ff';
    ctx.font = 'bold 18px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('OPTIONS', centerX, optionsY);

    ctx.fillStyle = '#666666';
    ctx.font = '12px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('1P RANK S', 20, 40);
    ctx.fillText('SCORE 002025', 20, 60);
  }

  handleInput(inputState) {
    if (!inputState.attack && !inputState.up && !inputState.down) {
      this.inputBlocked = false;
    }

    // First interaction - resume audio
    if (!this.inputDetected && (inputState.attack || inputState.up || inputState.down)) {
      this.inputDetected = true;
      this.game.audioManager.resumeAudioContext();
      this.game.audioManager.playMusic('title');
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
      this.game.audioManager.playSelectSound();

      if (this.selectedOption === 0) {
        // Start game
        const tutorialState = new TutorialState(this.game);
        this.game.changeState(tutorialState);
      } else if (this.selectedOption === 1) {
        // Open options
        const optionsState = new OptionsState(this.game);
        this.game.changeState(optionsState);
      }

      this.lastInputTime = 300;
    }
  }
}
