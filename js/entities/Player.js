import { Entity } from './Entity.js';
import { CONFIG } from '../config.js';

export class Player extends Entity {
  constructor(characterData, x = 100, y = 200) {
    super(x, y, CONFIG.PLAYER_SIZE.width, CONFIG.PLAYER_SIZE.height);

    this.name = characterData.name;
    this.stats = {
      str: characterData.str,
      spd: characterData.spd,
      vocalRange: characterData.vocalRange
    };

    this.baseSpeed = CONFIG.PLAYER_BASE_SPEED + (this.stats.spd * 20);
    this.attackDamage = 10 + (this.stats.str * 5);
    this.attackRange = characterData.attackRange || CONFIG.MELEE_RANGE;
    this.attackCooldown = 0;
    this.isAttacking = false;
    this.attackDuration = 200;
    this.attackTimer = 0;
    this.justAttacked = false; // Flag to track when attack just happened

    this.characterType = characterData.type;
    this.color = characterData.color;
  }

  update(dt) {
    super.update(dt);

    this.justAttacked = false; // Reset flag each frame

    if (this.attackCooldown > 0) {
      this.attackCooldown -= dt;
    }

    if (this.isAttacking) {
      this.attackTimer += dt;
      if (this.attackTimer >= this.attackDuration) {
        this.isAttacking = false;
        this.attackTimer = 0;
      }
    }
  }

  handleInput(inputState, dt) {
    this.velocity.x = 0;
    this.velocity.y = 0;

    if (inputState.left) this.velocity.x = -this.baseSpeed;
    if (inputState.right) this.velocity.x = this.baseSpeed;
    if (inputState.up) this.velocity.y = -this.baseSpeed;
    if (inputState.down) this.velocity.y = this.baseSpeed;

    if (this.velocity.length() > 0) {
      this.velocity.normalize().multiply(this.baseSpeed);
    }

    if (inputState.attack && this.attackCooldown <= 0 && !this.isAttacking) {
      this.attack();
    }
  }

  attack() {
    this.isAttacking = true;
    this.attackTimer = 0;
    this.attackCooldown = CONFIG.ATTACK_COOLDOWN;
    this.justAttacked = true; // Mark that attack just happened this frame
  }

  getAttackBox() {
    if (this.characterType === 'mira') {
      return null;
    }

    return {
      x: this.position.x + this.size.x,
      y: this.position.y,
      width: this.attackRange,
      height: this.size.y
    };
  }

  heal(amount) {
    this.health = Math.min(this.health + amount, this.maxHealth);
  }

  render(ctx) {
    if (!this.active) return;

    let color = this.color;
    if (this.isAttacking) {
      color = '#ffffff';
    }

    super.render(ctx, color);

    if (this.isAttacking && this.characterType !== 'mira') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      const attackBox = this.getAttackBox();
      if (attackBox) {
        ctx.fillRect(attackBox.x, attackBox.y, attackBox.width, attackBox.height);
      }
    }
  }
}
