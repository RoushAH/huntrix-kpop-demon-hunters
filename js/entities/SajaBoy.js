import { Entity } from './Entity.js';

export class SajaBoy extends Entity {
  constructor(x, y, boyType, difficultyConfig, difficulty = 'easy') {
    // Saja Boys are 1.5× larger than normal enemies (48×72 vs 32×48)
    super(x, y, 48, 72);

    this.boyType = boyType; // freeze, tank, dodger, summoner, berserker
    this.difficultyConfig = difficultyConfig;
    this.difficulty = difficulty;

    // Base stats for all Saja Boys
    const baseHP = difficulty === 'easy' ? 400 : 600;
    const baseSpeed = 80;

    // Type-specific modifications
    // Art spec: Boy 1 = Red Tank, Boy 2 = Blue Freeze
    switch (boyType) {
      case 'tank':
        this.maxHealth = baseHP * 3; // Triple HP
        this.speed = baseSpeed * 0.5; // Half speed
        this.damage = 20;
        this.color = '#cc0000'; // Red - Leader
        this.damageReduction = 0.5; // Takes half damage
        break;

      case 'freeze':
        this.maxHealth = baseHP;
        this.speed = baseSpeed;
        this.damage = 15;
        this.color = '#0066ff'; // Blue - Ice man
        this.freezeProjectileCooldown = 0;
        this.freezeProjectileInterval = 3000; // Shoot every 3 seconds
        break;

      case 'dodger':
        this.maxHealth = baseHP;
        this.speed = baseSpeed * 1.5; // 1.5× speed
        this.damage = 12;
        this.color = '#00cc00'; // Green
        this.dodgeChance = 0.5; // 50% dodge chance for projectiles
        break;

      case 'summoner':
        this.maxHealth = baseHP * 0.6; // Lower HP
        this.speed = baseSpeed * 0.7; // Slower
        this.damage = 10;
        this.color = '#9933ff'; // Purple
        this.summonCooldown = 0;
        this.summonInterval = 5000; // Summon every 5 seconds
        break;

      case 'berserker':
        this.maxHealth = baseHP;
        this.speed = baseSpeed;
        this.damage = 18;
        this.color = '#ff6600'; // Orange
        this.baseSpeed = baseSpeed;
        this.baseDamage = 18;
        break;

      default:
        this.maxHealth = baseHP;
        this.speed = baseSpeed;
        this.damage = 15;
        this.color = '#cc00cc';
    }

    this.health = this.maxHealth;
    this.attackCooldown = 0;
    this.attackRange = 50;

    // Turn-taking for easy mode
    this.isMyTurn = false;
    this.turnDuration = 0;

    // Always drop health pill
    this.healthPillDropChance = 1.0;

    // For sprite rendering (artIndex set by BossState, 1-5)
    this.artIndex = 0; // Will be set to 1-5 by BossState
    this.spriteKey = null; // Will be set based on artIndex
    this.useSprites = false; // Enable when sprites available
  }

  shouldDropHealthPill() {
    return true; // Always drop
  }

  takeDamage(amount) {
    // Tank boy takes reduced damage
    if (this.boyType === 'tank') {
      amount *= this.damageReduction;
    }

    this.health -= amount;
    console.log(`SajaBoy ${this.boyType}: took ${amount} damage, HP: ${this.health}/${this.maxHealth}`);

    // Berserker gets stronger as HP drops
    if (this.boyType === 'berserker') {
      const healthPercent = this.health / this.maxHealth;
      if (healthPercent < 0.25) {
        this.speed = this.baseSpeed * 2;
        this.damage = this.baseDamage * 2;
      } else if (healthPercent < 0.5) {
        this.speed = this.baseSpeed * 1.5;
        this.damage = this.baseDamage * 1.5;
      } else {
        this.speed = this.baseSpeed;
        this.damage = this.baseDamage;
      }
    }

    if (this.health <= 0) {
      this.health = 0;
      this.active = false;
      console.log(`SajaBoy ${this.boyType}: DEFEATED! Setting active = false`);
    }
  }

  tryDodge() {
    // Only dodger boy can dodge
    if (this.boyType === 'dodger') {
      return Math.random() < this.dodgeChance;
    }
    return false;
  }

  update(dt, target, turnBasedMode = false) {
    super.update(dt);

    if (!this.active || !target || !target.active) return;

    // Update timers
    if (this.attackCooldown > 0) {
      this.attackCooldown -= dt;
    }

    if (this.boyType === 'freeze' && this.freezeProjectileCooldown > 0) {
      this.freezeProjectileCooldown -= dt;
    }

    if (this.boyType === 'summoner' && this.summonCooldown > 0) {
      this.summonCooldown -= dt;
    }

    // Turn-based behavior for easy mode
    if (turnBasedMode) {
      if (this.isMyTurn) {
        this.turnDuration -= dt;
        if (this.turnDuration <= 0) {
          this.isMyTurn = false;
          console.log(`SajaBoy ${this.boyType}: turn ended`);
        }
      } else {
        // Not my turn - stay idle, don't move
        this.velocity.x = 0;
        this.velocity.y = 0;
        return;
      }
    }

    // Move toward target
    const dx = target.position.x - this.position.x;
    const dy = target.position.y - this.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > this.attackRange) {
      // Move toward target
      this.velocity.x = (dx / distance) * this.speed;
      this.velocity.y = (dy / distance) * this.speed;

      // Summoner stays in back
      if (this.boyType === 'summoner' && this.position.x < 600) {
        this.velocity.x = Math.max(0, this.velocity.x); // Don't move left
      }
    } else {
      this.velocity.x = 0;
      this.velocity.y = 0;
    }
  }

  canShootFreezeProjectile() {
    return this.boyType === 'freeze' && this.freezeProjectileCooldown <= 0;
  }

  shootFreezeProjectile() {
    this.freezeProjectileCooldown = this.freezeProjectileInterval;
  }

  canSummon() {
    return this.boyType === 'summoner' && this.summonCooldown <= 0;
  }

  summon() {
    this.summonCooldown = this.summonInterval;
  }

  activateTurn(duration = 4000) {
    this.isMyTurn = true;
    this.turnDuration = duration;
  }

  render(ctx, images) {
    if (!this.active) return;

    // Try to render sprite if available
    if (images && this.artIndex > 0) {
      const spriteKey = `saja_boy_${this.artIndex}_idle`;
      const sprite = images[spriteKey];

      if (sprite && sprite.complete) {
        // For now just render idle, will add animations later
        ctx.drawImage(sprite, this.position.x, this.position.y, this.size.x, this.size.y);
        this.renderHealthBar(ctx);
        this.renderTypeLabel(ctx);
        this.renderEffects(ctx);
        return;
      }
    }

    // Fallback to colored rectangle
    ctx.fillStyle = this.color;
    ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);

    // Draw border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.strokeRect(this.position.x, this.position.y, this.size.x, this.size.y);

    this.renderHealthBar(ctx);
    this.renderTypeLabel(ctx);
    this.renderEffects(ctx);
  }

  renderHealthBar(ctx) {
    const barWidth = this.size.x;
    const barHeight = 6;
    const barX = this.position.x;
    const barY = this.position.y - 12;

    ctx.fillStyle = '#330000';
    ctx.fillRect(barX, barY, barWidth, barHeight);

    const healthPercent = this.health / this.maxHealth;
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
  }

  renderTypeLabel(ctx) {
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(this.boyType.toUpperCase(), this.position.x + this.size.x / 2, this.position.y + this.size.y / 2);
  }

  renderEffects(ctx) {
    if (this.boyType === 'berserker' && this.health / this.maxHealth < 0.5) {
      // Red glow when berserking
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 2;
      ctx.strokeRect(this.position.x - 2, this.position.y - 2, this.size.x + 4, this.size.y + 4);
    }

    if (this.boyType === 'dodger') {
      // Blur effect indicator
      ctx.fillStyle = 'rgba(0, 204, 0, 0.3)';
      ctx.fillRect(this.position.x - 4, this.position.y, 4, this.size.y);
    }
  }
}
