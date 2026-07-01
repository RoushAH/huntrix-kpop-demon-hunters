import { Vector2 } from '../utils/Vector2.js';

export class Entity {
  constructor(x, y, width, height) {
    this.position = new Vector2(x, y);
    this.velocity = new Vector2(0, 0);
    this.size = new Vector2(width, height);
    this.active = true;
    this.health = 100;
    this.maxHealth = 100;

    this.currentAnimation = 'idle';
    this.animationFrame = 0;
    this.animationTimer = 0;
    this.animationSpeed = 100; // ms per frame

    // Sprite rendering
    this.spriteKey = null; // Base key for sprites (e.g., 'rumi')
    this.useSprites = false; // Flag to enable sprite rendering
    this.frameCount = { idle: 4, walk: 6, attack: 5, hit: 3 }; // Default frame counts
    this.flipX = false; // Flip sprite horizontally
  }

  update(dt) {
    if (!this.active) return;

    this.position.x += this.velocity.x * dt / 1000;
    this.position.y += this.velocity.y * dt / 1000;

    this.clampPosition();
    this.updateAnimation(dt);
  }

  updateAnimation(dt) {
    this.animationTimer += dt;

    const currentFrameCount = this.frameCount[this.currentAnimation] || 1;

    if (this.animationTimer >= this.animationSpeed) {
      this.animationFrame = (this.animationFrame + 1) % currentFrameCount;
      this.animationTimer = 0;
    }
  }

  setAnimation(animName) {
    if (this.currentAnimation !== animName) {
      this.currentAnimation = animName;
      this.animationFrame = 0;
      this.animationTimer = 0;
    }
  }

  clampPosition() {
    const margin = 10;
    this.position.x = Math.max(margin, Math.min(800 - this.size.x - margin, this.position.x));
    this.position.y = Math.max(100, Math.min(450 - this.size.y - margin, this.position.y));
  }

  takeDamage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      this.health = 0;
      // Check if entity supports death animation
      if (this.isDying !== undefined) {
        this.isDying = true;
        this.setAnimation('death');
      } else {
        this.active = false;
      }
    }
  }

  getBounds() {
    return {
      x: this.position.x,
      y: this.position.y,
      width: this.size.x,
      height: this.size.y
    };
  }

  render(ctx, color, images = null) {
    if (!this.active) return;

    // Try to render sprite if available
    if (this.useSprites && images && this.spriteKey) {
      const spriteKey = `${this.spriteKey}_${this.currentAnimation}`;
      const sprite = images[spriteKey];

      if (sprite && sprite.complete) {
        this.renderSprite(ctx, sprite);
        this.renderHealthBar(ctx);
        return;
      }
    }

    // Fallback to colored rectangle
    ctx.fillStyle = color;
    ctx.fillRect(
      Math.floor(this.position.x),
      Math.floor(this.position.y),
      this.size.x,
      this.size.y
    );

    this.renderHealthBar(ctx);
  }

  renderSprite(ctx, sprite) {
    const frameWidth = sprite.width / (this.frameCount[this.currentAnimation] || 1);
    const frameHeight = sprite.height;
    const frameX = this.animationFrame * frameWidth;

    ctx.save();

    // Flip horizontally if needed
    if (this.flipX) {
      ctx.translate(this.position.x + this.size.x, this.position.y);
      ctx.scale(-1, 1);
      ctx.drawImage(
        sprite,
        frameX, 0, frameWidth, frameHeight,
        0, 0, this.size.x, this.size.y
      );
    } else {
      ctx.drawImage(
        sprite,
        frameX, 0, frameWidth, frameHeight,
        this.position.x, this.position.y, this.size.x, this.size.y
      );
    }

    ctx.restore();
  }

  renderHealthBar(ctx) {
    const barWidth = this.size.x;
    const barHeight = 4;
    const barY = this.position.y - 10;

    ctx.fillStyle = '#333333';
    ctx.fillRect(this.position.x, barY, barWidth, barHeight);

    const healthPercent = this.health / this.maxHealth;
    ctx.fillStyle = healthPercent > 0.5 ? '#00ff00' : healthPercent > 0.25 ? '#ffff00' : '#ff0000';
    ctx.fillRect(this.position.x, barY, barWidth * healthPercent, barHeight);
  }
}
