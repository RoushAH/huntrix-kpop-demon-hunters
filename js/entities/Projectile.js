import { Entity } from './Entity.js';
import { CONFIG } from '../config.js';

export class Projectile extends Entity {
  constructor(x, y, damage, direction = 1) {
    super(x, y, 16, 16);
    this.damage = damage;
    this.speed = CONFIG.PROJECTILE_SPEED;
    this.velocity.x = this.speed * direction;
    this.hasHit = false;
  }

  update(dt) {
    super.update(dt);

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

  render(ctx) {
    if (!this.active) return;

    ctx.fillStyle = '#ff1493';
    ctx.save();
    ctx.translate(this.position.x + 8, this.position.y + 8);
    ctx.rotate(Math.PI / 4);
    ctx.fillRect(-6, -2, 12, 4);
    ctx.restore();
  }
}
