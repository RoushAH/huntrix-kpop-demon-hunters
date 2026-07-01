export class Renderer {
  static renderUI(ctx, player, score, combo) {
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'left';

    ctx.fillText(`SCORE: ${score}`, 20, 30);
    ctx.fillText(`HEALTH: ${Math.floor(player.health)}`, 20, 50);

    if (combo > 0) {
      ctx.fillStyle = combo >= 10 ? '#ff1493' : '#ffff00';
      ctx.fillText(`COMBO: ${combo}x`, 20, 70);
    }

    ctx.textAlign = 'right';
    ctx.fillStyle = player.color;
    ctx.fillText(player.name.toUpperCase(), 780, 30);
  }

  static renderGameOver(ctx) {
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = '#ff0000';
    ctx.font = 'bold 48px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', centerX, centerY - 20);

    ctx.fillStyle = '#ffffff';
    ctx.font = '20px monospace';
    ctx.fillText('Press SPACE or TAP to restart', centerX, centerY + 40);
  }
}
