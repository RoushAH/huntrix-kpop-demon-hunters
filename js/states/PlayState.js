import { BaseState } from './BaseState.js';
import { Player } from '../entities/Player.js';
import { EnemySpawner } from '../entities/EnemySpawner.js';
import { Projectile } from '../entities/Projectile.js';
import { HealthPill } from '../entities/HealthPill.js';
import { CollisionDetector } from '../core/CollisionDetector.js';
import { Renderer } from '../core/Renderer.js';
import { CONFIG } from '../config.js';

export class PlayState extends BaseState {
  constructor(game, characterData, difficulty) {
    super(game);
    this.characterData = characterData;
    this.difficulty = difficulty;
    this.difficultyConfig = CONFIG.DIFFICULTY[difficulty.toUpperCase()];

    this.player = null;
    this.enemies = [];
    this.projectiles = [];
    this.healthPills = [];
    this.enemySpawner = null;

    this.score = 0;
    this.combo = 0;
    this.comboTimer = 0;
    this.comboTimeout = 3000;

    this.gameOver = false;
  }

  enter() {
    this.player = new Player(this.characterData);
    this.player.health = this.difficultyConfig.playerHealth;
    this.player.maxHealth = this.difficultyConfig.playerHealth;

    this.enemySpawner = new EnemySpawner(this.difficulty, CONFIG.SPAWN_RATE_LOW);

    this.enemies = [];
    this.projectiles = [];
    this.healthPills = [];
    this.score = 0;
    this.combo = 0;
    this.gameOver = false;
  }

  update(dt) {
    if (this.gameOver) {
      return;
    }

    this.player.handleInput(this.game.inputManager.getInput(), dt);
    this.player.update(dt);

    const newEnemy = this.enemySpawner.update(dt);
    if (newEnemy) {
      this.enemies.push(newEnemy);
    }

    this.enemies.forEach(enemy => {
      enemy.update(dt, this.player);
    });

    this.projectiles.forEach(projectile => {
      projectile.update(dt);
    });

    this.healthPills.forEach(pill => {
      pill.update(dt);
    });

    this.checkCollisions();

    this.enemies = this.enemies.filter(e => e.active);
    this.projectiles = this.projectiles.filter(p => p.active);
    this.healthPills = this.healthPills.filter(p => p.active);

    if (this.comboTimer > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) {
        this.combo = 0;
      }
    }

    if (this.player.health <= 0) {
      this.gameOver = true;
    }
  }

  checkCollisions() {
    const leeway = this.difficultyConfig.hitboxLeeway;

    if (this.player.isAttacking) {
      const attackResult = this.player.getAttackBox();
      if (attackResult && attackResult.type === 'projectile') {
        const projectile = new Projectile(
          this.player.position.x + this.player.size.x,
          this.player.position.y + this.player.size.y / 2 - 8,
          this.player.attackDamage * this.difficultyConfig.playerDamageMultiplier
        );
        this.projectiles.push(projectile);
      } else if (attackResult) {
        this.enemies.forEach(enemy => {
          if (enemy.active && CollisionDetector.checkAABB(attackResult, enemy, leeway)) {
            const damage = this.player.attackDamage * this.difficultyConfig.playerDamageMultiplier;
            enemy.takeDamage(damage);

            if (!enemy.active) {
              this.onEnemyDefeated(enemy);
            }
          }
        });
      }
    }

    this.projectiles.forEach(projectile => {
      if (!projectile.active) return;

      this.enemies.forEach(enemy => {
        if (enemy.active && CollisionDetector.checkAABB(projectile, enemy, leeway)) {
          enemy.takeDamage(projectile.damage);
          projectile.onHit();

          if (!enemy.active) {
            this.onEnemyDefeated(enemy);
          }
        }
      });
    });

    this.healthPills.forEach(pill => {
      if (pill.active && CollisionDetector.checkAABB(this.player, pill)) {
        const healAmount = this.difficulty === 'easy'
          ? this.player.maxHealth * 0.3
          : this.player.maxHealth * 0.2;
        this.player.heal(healAmount);
        pill.active = false;
      }
    });

    this.enemies.forEach(enemy => {
      if (enemy.active && CollisionDetector.checkAABB(this.player, enemy, leeway)) {
        CollisionDetector.resolveCollision(this.player, enemy);
      }
    });
  }

  onEnemyDefeated(enemy) {
    this.addScore(100);
    this.combo++;
    this.comboTimer = this.comboTimeout;

    if (enemy.shouldDropHealthPill()) {
      const pill = new HealthPill(
        enemy.position.x + enemy.size.x / 2 - 8,
        enemy.position.y + enemy.size.y / 2 - 8,
        0
      );
      this.healthPills.push(pill);
    }
  }

  addScore(points) {
    let multiplier = 1;
    if (this.combo >= CONFIG.COMBO_MULTIPLIER_THRESHOLD_2) {
      multiplier = CONFIG.COMBO_MULTIPLIER_2;
    } else if (this.combo >= CONFIG.COMBO_MULTIPLIER_THRESHOLD_1) {
      multiplier = CONFIG.COMBO_MULTIPLIER_1;
    }

    this.score += Math.floor(points * multiplier);
  }

  render(ctx) {
    ctx.fillStyle = '#2a1a4a';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.strokeStyle = '#9966ff';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 90, ctx.canvas.width, ctx.canvas.height - 100);

    this.player.render(ctx);

    this.enemies.forEach(enemy => {
      enemy.render(ctx);
    });

    this.projectiles.forEach(projectile => {
      projectile.render(ctx);
    });

    this.healthPills.forEach(pill => {
      pill.render(ctx);
    });

    Renderer.renderUI(ctx, this.player, this.score, this.combo);

    if (this.gameOver) {
      Renderer.renderGameOver(ctx);
    }
  }

  handleInput(inputState) {
    if (this.gameOver && inputState.attack) {
      this.enter();
    }
  }
}
