import { BaseState } from './BaseState.js';
import { TitleState } from './TitleState.js';
import { AssetLoader } from '../core/AssetLoader.js';

export class LoadingState extends BaseState {
  constructor(game) {
    super(game);
    this.progress = 0;
    this.assetLoader = new AssetLoader();
  }

  enter() {
    console.log('LoadingState: Starting asset loading...');

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

    // Title
    ctx.fillStyle = '#ff1493';
    ctx.font = 'bold 48px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('HUNTRIX', centerX, centerY - 80);

    ctx.fillStyle = '#9966ff';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('K-POP DEMON HUNTERS', centerX, centerY - 40);

    // Loading text
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px monospace';
    ctx.fillText('LOADING...', centerX, centerY + 20);

    // Progress bar
    const barWidth = 400;
    const barHeight = 30;
    const barX = centerX - barWidth / 2;
    const barY = centerY + 50;

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
