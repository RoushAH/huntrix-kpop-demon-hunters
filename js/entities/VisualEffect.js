export class VisualEffect {
  constructor(x, y, effectType, duration = 300) {
    this.x = x;
    this.y = y;
    this.effectType = effectType; // 'slash', 'hit_spark', 'blood_splatter', etc.
    this.duration = duration;
    this.elapsed = 0;
    this.active = true;

    // Frame animation
    this.frameCount = { slash: 3, hit_spark: 4, blood_splatter: 3 };
    this.currentFrame = 0;
    this.frameTimer = 0;
    this.frameSpeed = duration / (this.frameCount[effectType] || 1);
  }

  update(dt) {
    this.elapsed += dt;
    this.frameTimer += dt;

    // Update animation frame
    const frames = this.frameCount[this.effectType] || 1;
    if (this.frameTimer >= this.frameSpeed) {
      this.currentFrame = (this.currentFrame + 1) % frames;
      this.frameTimer = 0;
    }

    if (this.elapsed >= this.duration) {
      this.active = false;
    }
  }

  render(ctx, images) {
    if (!this.active) return;

    const spriteKey = `${this.effectType}_effect`;
    const sprite = images[spriteKey];

    if (sprite && sprite.complete) {
      const frameWidth = sprite.width / (this.frameCount[this.effectType] || 1);
      const frameHeight = sprite.height;
      const frameX = this.currentFrame * frameWidth;

      const size = 48; // Effect size
      ctx.drawImage(
        sprite,
        frameX, 0, frameWidth, frameHeight,
        this.x - size / 2, this.y - size / 2, size, size
      );
    }
  }
}
