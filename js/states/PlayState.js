import { BaseState } from './BaseState.js';
import { Player } from '../entities/Player.js';
import { EnemySpawner } from '../entities/EnemySpawner.js';
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

    this.checkCollisions();

    this.enemies = this.enemies.filter(e => e.active);

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
      const attackBox = this.player.getAttackBox();
      if (attackBox) {
        this.enemies.forEach(enemy => {
          if (enemy.active && CollisionDetector.checkAABB(attackBox, enemy, leeway)) {
            const damage = this.player.attackDamage * this.difficultyConfig.playerDamageMultiplier;
            enemy.takeDamage(damage);

            if (!enemy.active) {
              this.addScore(100);
              this.combo++;
              this.comboTimer = this.comboTimeout;
            }
          }
        });
      }
    }

    this.enemies.forEach(enemy => {
      if (enemy.active && CollisionDetector.checkAABB(this.player, enemy, leeway)) {
        CollisionDetector.resolveCollision(this.player, enemy);
      }
    });
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
