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
  }

  update(dt) {
    if (!this.active) return;

    this.position.x += this.velocity.x * dt / 1000;
    this.position.y += this.velocity.y * dt / 1000;

    this.clampPosition();
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
      this.active = false;
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

  render(ctx, color) {
    if (!this.active) return;

    ctx.fillStyle = color;
    ctx.fillRect(
      Math.floor(this.position.x),
      Math.floor(this.position.y),
      this.size.x,
      this.size.y
    );

    this.renderHealthBar(ctx);
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
