import { Entity } from './Entity.js';

export class FinalBoss extends Entity {
  constructor(difficulty = 'easy') {
    // Gwi-Ma is HUGE - covers entire right side
    // 192px wide, full height of play area (360px from y=90 to y=450)
    const x = 608; // 800 - 192 = 608
    const y = 90; // Top of play area
    const height = 360; // Full play area height

    super(x, y, 192, height);

    this.difficulty = difficulty;
    this.maxHealth = difficulty === 'easy' ? 2000 : 3000;
    this.health = this.maxHealth;

    this.color = '#1a0033'; // Dark purple/black
    this.eyeColor = '#ff0000'; // Red eyes

    this.damage = 0; // Doesn't attack
    this.breathing = 0; // For idle animation
  }

  takeDamage(amount) {
    this.health -= amount;

    if (this.health <= 0) {
      this.health = 0;
      this.active = false;
    }
  }

  update(dt) {
    super.update(dt);

    // Idle breathing animation
    this.breathing += dt;
  }

  render(ctx) {
    if (!this.active) return;

    // Breathing effect (slight scale)
    const breathScale = 1 + Math.sin(this.breathing * 0.002) * 0.02;
    const scaledWidth = this.size.x * breathScale;
    const scaledHeight = this.size.y * breathScale;
    const offsetX = (this.size.x - scaledWidth) / 2;
    const offsetY = (this.size.y - scaledHeight) / 2;

    ctx.save();

    // Main body (dark silhouette)
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.position.x + offsetX,
      this.position.y + offsetY,
      scaledWidth,
      scaledHeight
    );

    // Border
    ctx.strokeStyle = '#9933ff';
    ctx.lineWidth = 4;
    ctx.strokeRect(
      this.position.x + offsetX,
      this.position.y + offsetY,
      scaledWidth,
      scaledHeight
    );

    // Eyes (glowing red)
    const eyeY = this.position.y + 60;
    const eyeSize = 20;

    // Left eye glow
    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
    ctx.beginPath();
    ctx.arc(this.position.x + 50, eyeY, eyeSize + 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = this.eyeColor;
    ctx.beginPath();
    ctx.arc(this.position.x + 50, eyeY, eyeSize, 0, Math.PI * 2);
    ctx.fill();

    // Right eye glow
    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
    ctx.beginPath();
    ctx.arc(this.position.x + 142, eyeY, eyeSize + 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = this.eyeColor;
    ctx.beginPath();
    ctx.arc(this.position.x + 142, eyeY, eyeSize, 0, Math.PI * 2);
    ctx.fill();

    // Eye highlights
    ctx.fillStyle = '#ff6666';
    ctx.beginPath();
    ctx.arc(this.position.x + 45, eyeY - 5, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(this.position.x + 137, eyeY - 5, 6, 0, Math.PI * 2);
    ctx.fill();

    // Name label
    ctx.fillStyle = '#ff00ff';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GWI-MA', this.position.x + this.size.x / 2, this.position.y - 20);

    ctx.restore();

    // Draw massive health bar at top of screen
    this.renderHealthBar(ctx);
  }

  renderHealthBar(ctx) {
    const barWidth = 600;
    const barHeight = 20;
    const barX = (800 - barWidth) / 2;
    const barY = 20;

    // Background
    ctx.fillStyle = '#330000';
    ctx.fillRect(barX, barY, barWidth, barHeight);

    // Health fill
    const healthPercent = this.health / this.maxHealth;
    ctx.fillStyle = healthPercent > 0.5 ? '#00ff00' : healthPercent > 0.25 ? '#ffaa00' : '#ff0000';
    ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);

    // Border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(barX, barY, barWidth, barHeight);

    // Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`GWI-MA: ${Math.ceil(this.health)} / ${this.maxHealth}`, barX + barWidth / 2, barY + 14);
  }
}
