import { BaseState } from './BaseState.js';
import { CharacterSelectState } from './CharacterSelectState.js';
import { BossCharacterSelectState } from './BossCharacterSelectState.js';
import { GameOverState } from './GameOverState.js';
import { InitialsEntryState } from './InitialsEntryState.js';
import { PauseState } from './PauseState.js';
import { Player } from '../entities/Player.js';
import { EnemySpawner } from '../entities/EnemySpawner.js';
import { Projectile } from '../entities/Projectile.js';
import { HealthPill } from '../entities/HealthPill.js';
import { VisualEffect } from '../entities/VisualEffect.js';
import { WingwomenManager } from '../systems/WingwomenManager.js';
import { ScoreManager } from '../systems/ScoreManager.js';
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
    this.visualEffects = [];
    this.enemySpawner = null;
    this.wingwomenManager = null;
    this.scoreManager = new ScoreManager();

    this.gameOver = false;
    this.levelComplete = false;
    this.levelCompleteTimer = 0;
    this.levelCompleteDelay = 1500;
    this.inputBlocked = false;
    this.enemiesDefeated = 0;
    this.enemiesNeededForLevel = 50;
    this.healthPacksSkipped = 0; // Track health packs picked up at full health
  }

  enter() {
    this.player = new Player(this.characterData);
    this.player.health = this.difficultyConfig.playerHealth;
    this.player.maxHealth = this.difficultyConfig.playerHealth;

    this.enemySpawner = new EnemySpawner(this.difficulty, CONFIG.SPAWN_RATE_LOW, this.currentLevel);

    const charactersForWingwomen = this.allCharacters && this.allCharacters.length > 1
      ? this.allCharacters
      : CHARACTERS;

    this.wingwomenManager = new WingwomenManager(this.player, charactersForWingwomen);

    this.enemies = [];
    this.projectiles = [];
    this.healthPills = [];
    this.visualEffects = [];
    this.visualEffects = [];
    this.scoreManager.reset();
    this.gameOver = false;

    // Start level music
    const trackName = `level${this.currentLevel}`;
    this.game.audioManager.playMusic(trackName);
    this.game.audioManager.resumeAudioContext();
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

      // Play sound effects for wingwomen events
      if (wingwomenEvent.event === 'companions_join') {
        this.game.audioManager.playWingwomenArriveSound();
      } else if (wingwomenEvent.event === 'companions_leave') {
        this.game.audioManager.playWingwomenLeaveSound();
      }
    }

    this.checkCollisions();

    // Clear attack flags after collision checks
    this.player.clearAttackFlag();
    this.wingwomenManager.getActiveCompanions().forEach(c => c.clearAttackFlag());

    this.enemies = this.enemies.filter(e => e.active);
    this.projectiles = this.projectiles.filter(p => p.active);
    this.healthPills = this.healthPills.filter(p => p.active);
    this.visualEffects = this.visualEffects.filter(e => e.active);

    // Update visual effects
    this.visualEffects.forEach(effect => effect.update(dt));

    // Update combo timer through ScoreManager
    this.scoreManager.updateCombo(dt);

    if (this.player.health <= 0 && !this.gameOver) {
      this.gameOver = true;

      // Check if this is a high score
      const key = `${this.mode}_${this.difficulty}`;
      const topScore = this.scoreManager.getTopScore(this.mode, this.difficulty);
      const isHighScore = this.scoreManager.currentScore > topScore ||
                          this.scoreManager.getHighScores(key).length < 10;

      if (isHighScore) {
        // Go to initials entry first
        const initialsState = new InitialsEntryState(
          this.game,
          this.scoreManager.currentScore,
          this.characterData,
          this.difficulty,
          this.mode
        );
        this.game.changeState(initialsState);
      } else {
        // Not a high score, go straight to game over
        const gameOverState = new GameOverState(
          this.game,
          this.scoreManager.currentScore,
          this.characterData,
          this.difficulty,
          this.mode
        );
        this.game.changeState(gameOverState);
      }
      return;
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

    // Check for new attacks and create projectiles for ranged characters
    allPlayers.forEach(player => {
      if (!player.active) return;

      // Create projectile if character just attacked and is ranged (Mira)
      if (player.justAttacked) {
        this.game.audioManager.playAttackSound(player.characterType);

        // Create slash effect for melee attacks
        if (player.characterType !== 'zoey') {
          const effectX = player.position.x + player.size.x + 20;
          const effectY = player.position.y + player.size.y / 2;
          this.visualEffects.push(new VisualEffect(effectX, effectY, 'slash', 200));
        }

        if (player.characterType === 'zoey') { // Zoey throws knives
          const projectile = new Projectile(
            player.position.x + player.size.x,
            player.position.y + player.size.y / 2 - 8,
            player.attackDamage * this.difficultyConfig.playerDamageMultiplier
          );
          this.projectiles.push(projectile);
        }
      }
    });

    // Check melee attacks
    allPlayers.forEach(player => {
      if (!player.active || !player.isAttacking) return;
      if (player.characterType === 'zoey') return; // Zoey doesn't do melee

      const attackBox = player.getAttackBox();
      if (attackBox) {
        this.enemies.forEach(enemy => {
          if (enemy.active && CollisionDetector.checkAABB(attackBox, enemy, leeway)) {
            const damage = player.attackDamage * this.difficultyConfig.playerDamageMultiplier;
            enemy.takeDamage(damage);
            this.game.audioManager.playHitSound();

            if (!enemy.active) {
              this.onEnemyDefeated(enemy);
            }
          }
        });
      }
    });

    this.projectiles.forEach(projectile => {
      if (!projectile.active) return;

      this.enemies.forEach(enemy => {
        if (enemy.active && CollisionDetector.checkAABB(projectile, enemy, leeway)) {
          enemy.takeDamage(projectile.damage);
          projectile.onHit();
          this.game.audioManager.playHitSound();

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

        const wasAtFullHealth = this.player.heal(healAmount);

        if (wasAtFullHealth) {
          // Player didn't need healing - award bonus points
          this.healthPacksSkipped++;
          const bonusPoints = this.healthPacksSkipped * 10;
          this.scoreManager.addPoints(bonusPoints);
          console.log(`Health pack skipped bonus: ${bonusPoints} points (${this.healthPacksSkipped}nth pack)`);
        }

        pill.active = false;
        this.game.audioManager.playHealthPickupSound();
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
    this.scoreManager.incrementCombo();
    this.scoreManager.addPoints(100);
    this.enemiesDefeated++;

    this.game.audioManager.playEnemyDeathSound();

    // Play combo sound at milestones
    if (this.scoreManager.currentCombo === 5 || this.scoreManager.currentCombo === 10) {
      this.game.audioManager.playComboSound(this.scoreManager.currentCombo);
    }

    if (enemy.shouldDropHealthPill()) {
      const pill = new HealthPill(
        enemy.position.x + enemy.size.x / 2 - 8,
        enemy.position.y + enemy.size.y / 2 - 8,
        0
      );
      this.healthPills.push(pill);
    }
  }

  render(ctx) {
    ctx.fillStyle = '#2a1a4a';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.strokeStyle = '#9966ff';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 90, ctx.canvas.width, ctx.canvas.height - 100);

    const images = this.game.images;

    // Render background with parallax
    Renderer.renderBackground(ctx, images, this.currentLevel, this.parallaxOffset);

    this.player.render(ctx, images);

    this.wingwomenManager.getActiveCompanions().forEach(companion => {
      companion.render(ctx, images);
    });

    this.enemies.forEach(enemy => {
      enemy.render(ctx, images);
    });

    this.projectiles.forEach(projectile => {
      projectile.render(ctx, images);
    });

    this.healthPills.forEach(pill => {
      pill.render(ctx, images);
    });

    // Render visual effects
    this.visualEffects.forEach(effect => {
      effect.render(ctx, images);
    });

    Renderer.renderUI(ctx, this.player, this.scoreManager.currentScore, this.scoreManager.currentCombo);

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
      ctx.fillText('WINGWOMEN ACTIVE!', 20, 180);
    } else {
      const secondsLeft = Math.ceil(this.wingwomenManager.timer / 1000);
      ctx.fillStyle = '#ffff00';
      ctx.font = '14px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`Backup in ${secondsLeft}s`, 20, 180);
    }

    if (this.levelComplete) {
      this.renderLevelComplete(ctx);
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
    ctx.fillText(`SCORE: ${this.scoreManager.currentScore}`, centerX, centerY);

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
    // Handle pause
    if (inputState.pause && !this.gameOver && !this.levelComplete) {
      this.game.audioManager.playUISound();
      const pauseState = new PauseState(this.game, this);
      this.game.changeState(pauseState);
      return;
    }

    if (!inputState.attack) {
      this.inputBlocked = false;
    }

    if (this.levelComplete && inputState.attack && !this.inputBlocked && this.levelCompleteTimer >= this.levelCompleteDelay) {
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
        // Level 3 complete - go to boss character select
        const bossCharSelectState = new BossCharacterSelectState(
          this.game,
          this.difficulty,
          this.scoreManager,
          this.allCharacters
        );
        this.game.changeState(bossCharSelectState);
      }
    }
  }
}
