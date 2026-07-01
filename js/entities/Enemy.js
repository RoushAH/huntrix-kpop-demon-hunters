import { Entity } from './Entity.js';
import { CONFIG } from '../config.js';

export class Enemy extends Entity {
  constructor(x, y, type = 'basic', difficultyConfig, difficulty = 'easy') {
    const sizes = {
      basic: { width: 32, height: 48 },
      fast: { width: 24, height: 40 },
      tank: { width: 48, height: 64 }
    };

    const size = sizes[type] || sizes.basic;
    super(x, y, size.width, size.height);

    this.type = type;
    this.difficultyConfig = difficultyConfig;
    this.difficulty = difficulty;

    const baseStats = {
      basic: { health: 30, speed: 100, damage: 10 },
      fast: { health: 20, speed: 180, damage: 8 },
      tank: { health: 120, speed: 60, damage: 15 } // Was 80, now 120
    };

    const stats = baseStats[type] || baseStats.basic;

    this.maxHealth = stats.health * (difficultyConfig?.enemyHealthMultiplier || 1);
    this.health = this.maxHealth;
    this.speed = stats.speed * (difficultyConfig?.enemySpeedMultiplier || 1);
    this.damage = stats.damage;

    this.attackCooldown = 0;
    this.attackRange = 40;

    this.colors = {
      basic: '#cc0000',
      fast: '#ff8800',
      tank: '#660000'
    };
    this.color = this.colors[type] || this.colors.basic;

    this.healthPillDropChance = difficulty === 'easy' ? 0.2 : 0.1;

    // Enable sprite rendering with correct frame counts
    if (type === 'basic') {
      this.spriteKey = `demon_basic`;
      this.useSprites = true;
      this.frameCount = { walk: 4, attack: 3, death: 4 };
    } else if (type === 'fast') {
      this.spriteKey = `demon_fast`;
      this.useSprites = true;
      this.frameCount = { walk: 6, attack: 3, death: 3 };
    } else if (type === 'tank') {
      this.spriteKey = `demon_tank`;
      this.useSprites = true;
      this.frameCount = { walk: 4, attack: 4, death: 5 };
    }
  }

  shouldDropHealthPill() {
    return Math.random() < this.healthPillDropChance;
  }

  update(dt, target) {
    super.update(dt);

    if (!this.active || !target) return;

    const dx = target.position.x - this.position.x;
    const dy = target.position.y - this.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > this.attackRange) {
      this.velocity.x = (dx / distance) * this.speed;
      this.velocity.y = (dy / distance) * this.speed;
      this.setAnimation('walk');

      // Flip sprite based on direction
      this.flipX = dx < 0;
    } else {
      this.velocity.x = 0;
      this.velocity.y = 0;

      if (this.attackCooldown <= 0) {
        this.attackTarget(target);
        this.attackCooldown = 1000;
        this.setAnimation('attack');
      }
    }

    if (this.attackCooldown > 0) {
      this.attackCooldown -= dt;
    }

    if (this.position.x < -100) {
      this.active = false;
    }
  }

  attackTarget(target) {
    if (target && target.active) {
      target.takeDamage(this.damage);
    }
  }

  render(ctx, images) {
    super.render(ctx, this.color, images);
  }
}
