import { BaseState } from './BaseState.js';
import { CharacterSelectState } from './CharacterSelectState.js';
import { Player } from '../entities/Player.js';
import { EnemySpawner } from '../entities/EnemySpawner.js';
import { Projectile } from '../entities/Projectile.js';
import { HealthPill } from '../entities/HealthPill.js';
import { WingwomenManager } from '../systems/WingwomenManager.js';
import { CollisionDetector } from '../core/CollisionDetector.js';
import { Renderer } from '../core/Renderer.js';
import { CHARACTERS } from '../data/characters.js';
import { CONFIG } from '../config.js';

export class PlayState extends BaseState {
  constructor(game, characterData, difficulty, mode = 'story', currentLevel = 1, allCharacters = null) {
    super(game);
    this.mode = mode;
    this.currentLevel = currentLevel;
    this.allCharacters = allCharacters;

    this.characterData = characterData;
    this.difficulty = difficulty;
    this.difficultyConfig = CONFIG.DIFFICULTY[difficulty.toUpperCase()];

    this.player = null;
    this.enemies = [];
    this.projectiles = [];
    this.healthPills = [];
    this.enemySpawner = null;
    this.wingwomenManager = null;

    this.score = 0;
    this.combo = 0;
    this.comboTimer = 0;
    this.comboTimeout = 3000;

    this.gameOver = false;
    this.levelComplete = false;
    this.levelCompleteTimer = 0;
    this.levelCompleteDelay = 1500;
    this.inputBlocked = false;
    this.enemiesDefeated = 0;
    this.enemiesNeededForLevel = 50;
  }

  enter() {
    this.player = new Player(this.characterData);
    this.player.health = this.difficultyConfig.playerHealth;
    this.player.maxHealth = this.difficultyConfig.playerHealth;

    this.enemySpawner = new EnemySpawner(this.difficulty, CONFIG.SPAWN_RATE_LOW);

    const charactersForWingwomen = this.allCharacters && this.allCharacters.length > 1
      ? this.allCharacters
      : CHARACTERS;

    this.wingwomenManager = new WingwomenManager(this.player, charactersForWingwomen);

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

    if (this.levelComplete) {
      this.levelCompleteTimer += dt;
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

    const wingwomenEvent = this.wingwomenManager.update(dt, this.enemies);
    if (wingwomenEvent) {
      console.log('Wingwomen event:', wingwomenEvent);
      this.enemySpawner.setSpawnRate(wingwomenEvent.newSpawnRate);
    }

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

    if (this.mode === 'story' && this.enemiesDefeated >= this.enemiesNeededForLevel && !this.levelComplete) {
      this.levelComplete = true;
      this.levelCompleteTimer = 0;
      this.inputBlocked = true;
    }
  }

  checkCollisions() {
    const leeway = this.difficultyConfig.hitboxLeeway;
    const allPlayers = [this.player, ...this.wingwomenManager.getActiveCompanions()];

    allPlayers.forEach(player => {
      if (!player.active || !player.isAttacking) return;

      const attackResult = player.getAttackBox();
      if (attackResult && attackResult.type === 'projectile') {
        const projectile = new Projectile(
          player.position.x + player.size.x,
          player.position.y + player.size.y / 2 - 8,
          player.attackDamage * this.difficultyConfig.playerDamageMultiplier
        );
        this.projectiles.push(projectile);
      } else if (attackResult) {
        this.enemies.forEach(enemy => {
          if (enemy.active && CollisionDetector.checkAABB(attackResult, enemy, leeway)) {
            const damage = player.attackDamage * this.difficultyConfig.playerDamageMultiplier;
            enemy.takeDamage(damage);

            if (!enemy.active) {
              this.onEnemyDefeated(enemy);
            }
          }
        });
      }
    });

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

    allPlayers.forEach(player => {
      this.enemies.forEach(enemy => {
        if (enemy.active && CollisionDetector.checkAABB(player, enemy, leeway)) {
          CollisionDetector.resolveCollision(player, enemy);
        }
      });
    });
  }

  onEnemyDefeated(enemy) {
    this.addScore(100);
    this.combo++;
    this.comboTimer = this.comboTimeout;
    this.enemiesDefeated++;

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

    this.wingwomenManager.getActiveCompanions().forEach(companion => {
      companion.render(ctx);
    });

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

    if (this.mode === 'story') {
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`LEVEL ${this.currentLevel}/3`, 780, 50);
      ctx.fillText(`ENEMIES: ${this.enemiesDefeated}/${this.enemiesNeededForLevel}`, 780, 70);
    }

    const companions = this.wingwomenManager.getActiveCompanions();
    if (companions.length > 0) {
      ctx.fillStyle = '#00ff00';
      ctx.font = '14px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('WINGWOMEN ACTIVE!', 20, 90);
    } else {
      const secondsLeft = Math.ceil(this.wingwomenManager.timer / 1000);
      ctx.fillStyle = '#ffff00';
      ctx.font = '14px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`Backup in ${secondsLeft}s`, 20, 90);
    }

    if (this.levelComplete) {
      this.renderLevelComplete(ctx);
    }

    if (this.gameOver) {
      Renderer.renderGameOver(ctx);
    }
  }

  renderLevelComplete(ctx) {
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const pulse = Math.sin(this.levelCompleteTimer * 0.005) * 0.3 + 0.7;
    ctx.save();
    ctx.globalAlpha = pulse;

    ctx.fillStyle = '#ffff00';
    ctx.font = 'bold 64px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`LEVEL ${this.currentLevel} CLEAR!!!`, centerX, centerY - 60);

    ctx.restore();

    ctx.fillStyle = '#00ff00';
    ctx.font = 'bold 32px monospace';
    ctx.fillText(`SCORE: ${this.score}`, centerX, centerY);

    if (this.currentLevel < 3) {
      const nextCharacter = this.allCharacters[this.currentLevel];
      ctx.fillStyle = nextCharacter.color;
      ctx.font = 'bold 28px monospace';
      ctx.fillText(`NEXT: ${nextCharacter.name.toUpperCase()}`, centerX, centerY + 50);

      ctx.fillStyle = '#ffffff';
      ctx.font = '16px monospace';
      ctx.fillText(`STR ${this.renderHearts(nextCharacter.str)} SPD ${this.renderHearts(nextCharacter.spd)}`, centerX, centerY + 75);
    } else {
      ctx.fillStyle = '#ff0000';
      ctx.font = 'bold 32px monospace';
      ctx.fillText('BOSS FIGHT NEXT!', centerX, centerY + 50);
    }

    if (this.levelCompleteTimer >= this.levelCompleteDelay) {
      const blinkRate = Math.floor(this.levelCompleteTimer / 300) % 2;
      if (blinkRate === 0) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px monospace';
        ctx.fillText('Press SPACE or TAP to continue', centerX, centerY + 110);
      }
    }
  }

  renderHearts(count) {
    return '♥'.repeat(count);
  }

  handleInput(inputState) {
    if (!inputState.attack) {
      this.inputBlocked = false;
    }

    if (this.gameOver && inputState.attack && !this.inputBlocked) {
      const characterSelectState = new CharacterSelectState(this.game);
      this.game.changeState(characterSelectState);
    } else if (this.levelComplete && inputState.attack && !this.inputBlocked && this.levelCompleteTimer >= this.levelCompleteDelay) {
      if (this.currentLevel < 3) {
        const nextCharacter = this.allCharacters[this.currentLevel];
        const nextLevel = this.currentLevel + 1;
        const nextPlayState = new PlayState(
          this.game,
          nextCharacter,
          this.difficulty,
          this.mode,
          nextLevel,
          this.allCharacters
        );
        this.game.changeState(nextPlayState);
      } else {
        const characterSelectState = new CharacterSelectState(this.game);
        this.game.changeState(characterSelectState);
      }
    }
  }
}
