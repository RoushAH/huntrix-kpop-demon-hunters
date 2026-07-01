import { Entity } from './Entity.js';

export class FreezeProjectile extends Entity {
  constructor(x, y) {
    super(x, y, 24, 24);

    this.velocity.x = -150; // Move left toward player
    this.damage = 0; // Doesn't do damage, just freezes
    this.freezeDuration = 500; // 500ms freeze
    this.color = '#00ddff';
    this.lifetime = 5000; // Despawn after 5 seconds
    this.age = 0;
  }

  update(dt) {
    super.update(dt);

    this.age += dt;
    if (this.age >= this.lifetime || this.position.x < -50) {
      this.active = false;
    }
  }

  render(ctx) {
    if (!this.active) return;

    // Draw freeze ball with glow effect
    ctx.save();

    // Outer glow
    ctx.fillStyle = 'rgba(0, 221, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(
      this.position.x + this.size.x / 2,
      this.position.y + this.size.y / 2,
      this.size.x / 2 + 4,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Core
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(
      this.position.x + this.size.x / 2,
      this.position.y + this.size.y / 2,
      this.size.x / 2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Highlight
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(
      this.position.x + this.size.x / 2 - 4,
      this.position.y + this.size.y / 2 - 4,
      4,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.restore();
  }
}
