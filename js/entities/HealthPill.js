import { Entity } from './Entity.js';

export class HealthPill extends Entity {
  constructor(x, y, healAmount) {
    super(x, y, 16, 16);
    this.healAmount = healAmount;
    this.lifetime = 10000;
    this.elapsed = 0;
    this.bobOffset = 0;
    this.bobSpeed = 0.003;
  }

  update(dt) {
    super.update(dt);

    this.elapsed += dt;
    this.bobOffset = Math.sin(this.elapsed * this.bobSpeed) * 5;

    if (this.elapsed >= this.lifetime) {
      this.active = false;
    }
  }

  render(ctx) {
    if (!this.active) return;

    const alpha = this.elapsed > this.lifetime - 2000
      ? (this.lifetime - this.elapsed) / 2000
      : 1.0;

    ctx.save();
    ctx.globalAlpha = alpha;

    const renderY = this.position.y + this.bobOffset;

    ctx.fillStyle = '#ff69b4';
    ctx.fillRect(this.position.x + 4, renderY, 8, 8);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(this.position.x + 6, renderY + 3, 4, 2);
    ctx.fillRect(this.position.x + 7, renderY + 2, 2, 4);

    ctx.restore();
  }
}
