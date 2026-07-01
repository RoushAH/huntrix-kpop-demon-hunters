export class Renderer {
  static renderBackground(ctx, images, level = 1, parallaxOffset = 0) {
    const levelKey = level > 3 ? 'boss' : `level${level}`;

    // Clear canvas first with solid background color
    ctx.fillStyle = '#1a0033';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Parallax speeds: layer 1 (far) slowest, layer 3 (near) fastest
    const parallaxSpeeds = [0.2, 0.5, 1.0];

    // Render all 3 parallax layers with proper transparency!
    for (let i = 1; i <= 3; i++) {
      const bgKey = `bg_${levelKey}_layer${i}`;
      const bg = images[bgKey];

      if (bg && bg.complete) {
        // Scale background to be 1.5x canvas width for scrolling room
        const bgWidth = ctx.canvas.width * 1.5;
        const scale = bgWidth / bg.width;
        const scaledHeight = bg.height * scale;
        const yOffset = (ctx.canvas.height - scaledHeight) / 2;

        // Calculate parallax offset for this layer
        const layerSpeed = parallaxSpeeds[i - 1];
        const xOffset = -(parallaxOffset * layerSpeed) % bgWidth;

        // Draw the background twice for seamless wrapping
        ctx.drawImage(bg, xOffset, yOffset, bgWidth, scaledHeight);
        ctx.drawImage(bg, xOffset + bgWidth, yOffset, bgWidth, scaledHeight);
      }
    }

    // Fallback solid color if no backgrounds loaded
    if (!images[`bg_${levelKey}_layer1`]) {
      ctx.fillStyle = '#1a0033';
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
  }

  static renderUI(ctx, player, score, combo, images) {
    // Score
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`SCORE`, 20, 25);
    ctx.font = '16px monospace';
    ctx.fillText(score.toString().padStart(8, '0'), 20, 45);

    // Health hearts
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px monospace';
    ctx.fillText(`HEALTH`, 20, 75);
    this.renderHealthHearts(ctx, player, 20, 90, images);

    // Combo meter
    if (combo > 0) {
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px monospace';
      ctx.fillText(`COMBO`, 20, 125);
      this.renderComboMeter(ctx, combo, 20, 140);
    }

    // Character name
    ctx.textAlign = 'right';
    ctx.fillStyle = player.color;
    ctx.font = 'bold 20px monospace';
    ctx.fillText(player.name.toUpperCase(), 780, 30);
  }

  static renderHealthHearts(ctx, player, x, y, images) {
    const maxHearts = Math.ceil(player.maxHealth / 20); // 1 heart = 20 HP
    const fullHearts = Math.floor(player.health / 20);
    const partialHeart = (player.health % 20) / 20;

    // Get heart sprites
    const heartFull = images && images['heart_full'];
    const heartEmpty = images && images['heart_empty'];
    const useSprites = heartFull && heartFull.complete && heartEmpty && heartEmpty.complete;

    if (useSprites) {
      // Render with sprites
      const heartWidth = 20;
      const heartHeight = 20;
      const heartSpacing = 24;

      for (let i = 0; i < maxHearts; i++) {
        const heartX = x + (i * heartSpacing);

        if (i < fullHearts) {
          // Full heart
          ctx.drawImage(heartFull, heartX, y - heartHeight, heartWidth, heartHeight);
        } else if (i === fullHearts && partialHeart > 0) {
          // Partial heart - draw empty first, then clip full heart
          ctx.drawImage(heartEmpty, heartX, y - heartHeight, heartWidth, heartHeight);

          ctx.save();
          ctx.beginPath();
          ctx.rect(heartX, y - heartHeight, heartWidth * partialHeart, heartHeight);
          ctx.clip();
          ctx.drawImage(heartFull, heartX, y - heartHeight, heartWidth, heartHeight);
          ctx.restore();
        } else {
          // Empty heart
          ctx.drawImage(heartEmpty, heartX, y - heartHeight, heartWidth, heartHeight);
        }
      }
    } else {
      // Fallback to text hearts
      const heartSize = 16;
      const heartSpacing = 20;

      for (let i = 0; i < maxHearts; i++) {
        const heartX = x + (i * heartSpacing);

        if (i < fullHearts) {
          // Full heart
          ctx.fillStyle = '#ff0000';
          ctx.font = `${heartSize}px monospace`;
          ctx.textAlign = 'left';
          ctx.fillText('♥', heartX, y);
        } else if (i === fullHearts && partialHeart > 0) {
          // Partial heart (draw both and clip)
          ctx.fillStyle = '#333333';
          ctx.fillText('♥', heartX, y);

          ctx.save();
          ctx.beginPath();
          ctx.rect(heartX, y - heartSize, heartSize * partialHeart, heartSize);
          ctx.clip();
          ctx.fillStyle = '#ff0000';
          ctx.fillText('♥', heartX, y);
          ctx.restore();
        } else {
          // Empty heart
          ctx.fillStyle = '#333333';
          ctx.fillText('♥', heartX, y);
        }
      }
    }
  }

  static renderComboMeter(ctx, combo, x, y) {
    const meterWidth = 150;
    const meterHeight = 20;
    const comboMax = 20; // Max combo for full meter
    const comboPercent = Math.min(combo / comboMax, 1);

    // Background
    ctx.fillStyle = '#333333';
    ctx.fillRect(x, y, meterWidth, meterHeight);

    // Fill
    const fillColor = combo >= 15 ? '#ff0000' : combo >= 10 ? '#ff1493' : '#ffff00';
    ctx.fillStyle = fillColor;
    ctx.fillRect(x, y, meterWidth * comboPercent, meterHeight);

    // Border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, meterWidth, meterHeight);

    // Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${combo}x`, x + meterWidth / 2, y + meterHeight / 2);
    ctx.textBaseline = 'alphabetic';
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
