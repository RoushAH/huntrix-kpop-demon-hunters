import { BaseState } from './BaseState.js';
import { TitleState } from './TitleState.js';
import { AssetLoader } from '../core/AssetLoader.js';

export class LoadingState extends BaseState {
  constructor(game) {
    super(game);
    this.progress = 0;
    this.assetLoader = new AssetLoader();
    this.posterLoaded = false;
    this.poster = null;
  }

  enter() {
    console.log('LoadingState: Starting asset loading...');

    // Load poster first for loading screen display
    const posterImg = new Image();
    posterImg.onload = () => {
      this.poster = posterImg;
      this.posterLoaded = true;
    };
    posterImg.src = 'assets/POSTER.png';

    const assets = AssetLoader.getAllAssets();

    this.assetLoader.loadAssets(
      assets,
      (loaded, total) => {
        this.progress = loaded / total;
      },
      (images) => {
        // Store loaded images in game object
        this.game.images = images;
        console.log('LoadingState: Assets loaded, transitioning to title');

        // Wait a moment then transition
        setTimeout(() => {
          const titleState = new TitleState(this.game);
          this.game.changeState(titleState);
        }, 500);
      }
    );
  }

  update(dt) {
    // Nothing to update, loading happens asynchronously
  }

  render(ctx) {
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;

    // Background
    ctx.fillStyle = '#1a0033';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw logo sprite if in loaded images, otherwise use poster or fallback
    const logo = this.game.images && this.game.images['logo'];
    if (logo && logo.complete) {
      const logoScale = 1.2;
      const logoWidth = logo.width * logoScale;
      const logoHeight = logo.height * logoScale;
      const logoX = centerX - logoWidth / 2;
      const logoY = centerY - logoHeight / 2 - 50;

      // Add glow effect
      ctx.shadowColor = '#ff1493';
      ctx.shadowBlur = 30;
      ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight);
      ctx.shadowBlur = 0;
    } else if (this.posterLoaded && this.poster) {
      // Draw poster if logo not loaded yet
      const posterWidth = 600;
      const posterHeight = (this.poster.height / this.poster.width) * posterWidth;
      const posterX = centerX - posterWidth / 2;
      const posterY = centerY - posterHeight / 2 - 30;

      ctx.drawImage(this.poster, posterX, posterY, posterWidth, posterHeight);
    } else {
      // Fallback text while assets load
      ctx.fillStyle = '#ff1493';
      ctx.font = 'bold 48px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('HUNTRIX', centerX, centerY - 80);

      ctx.fillStyle = '#9966ff';
      ctx.font = 'bold 20px monospace';
      ctx.fillText('K-POP DEMON HUNTERS', centerX, centerY - 40);
    }

    // Progress bar at bottom
    const barWidth = 400;
    const barHeight = 30;
    const barX = centerX - barWidth / 2;
    const barY = ctx.canvas.height - 80;

    // Loading text
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('LOADING...', centerX, barY - 20);

    // Background
    ctx.fillStyle = '#333333';
    ctx.fillRect(barX, barY, barWidth, barHeight);

    // Fill
    const fillWidth = barWidth * this.progress;
    ctx.fillStyle = '#ff1493';
    ctx.fillRect(barX, barY, fillWidth, barHeight);

    // Border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(barX, barY, barWidth, barHeight);

    // Percentage
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px monospace';
    const percentage = Math.floor(this.progress * 100);
    ctx.fillText(`${percentage}%`, centerX, barY + barHeight + 25);
  }

  handleInput(inputState) {
    // No input during loading
  }
}
