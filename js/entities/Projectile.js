import { Entity } from './Entity.js';
import { CONFIG } from '../config.js';

export class Projectile extends Entity {
  constructor(x, y, damage, direction = 1) {
    super(x, y, 16, 16);
    this.damage = damage;
    this.speed = CONFIG.PROJECTILE_SPEED;
    this.velocity.x = this.speed * direction;
    this.hasHit = false;

    // Enable sprite rendering
    this.spriteKey = 'knife';
    this.useSprites = true;
    this.currentAnimation = 'spin';
    this.animationFrame = 0;
    this.animationTimer = 0;
    this.animationSpeed = 100;
    this.frameCount = { spin: 2 };
  }

  update(dt) {
    // Update animation
    this.animationTimer += dt;
    const currentFrameCount = this.frameCount[this.currentAnimation] || 1;
    if (this.animationTimer >= this.animationSpeed) {
      this.animationFrame = (this.animationFrame + 1) % currentFrameCount;
      this.animationTimer = 0;
    }

    // Update position
    this.position.x += this.velocity.x * dt / 1000;
    this.position.y += this.velocity.y * dt / 1000;

    if (this.position.x > 850 || this.position.x < -50) {
      this.active = false;
    }
  }

  clampPosition() {
    if (this.position.x > 850 || this.position.x < -50) {
      this.active = false;
    }
  }

  onHit() {
    this.hasHit = true;
    this.active = false;
  }

  render(ctx, images) {
    if (!this.active) return;

    // Try to render sprite if available
    if (this.useSprites && images && this.spriteKey) {
      const spriteKey = this.spriteKey;
      const sprite = images[spriteKey];

      if (sprite && sprite.complete) {
        const frameWidth = sprite.width / (this.frameCount[this.currentAnimation] || 1);
        const frameHeight = sprite.height;
        const frameX = this.animationFrame * frameWidth;

        ctx.save();
        ctx.drawImage(
          sprite,
          frameX, 0, frameWidth, frameHeight,
          this.position.x, this.position.y, this.size.x, this.size.y
        );
        ctx.restore();
        return;
      }
    }

    // Fallback to pink diamond
    ctx.fillStyle = '#ff1493';
    ctx.save();
    ctx.translate(this.position.x + 8, this.position.y + 8);
    ctx.rotate(Math.PI / 4);
    ctx.fillRect(-6, -2, 12, 4);
    ctx.restore();
  }
}
