import { BaseState } from './BaseState.js';
import { GameOverState } from './GameOverState.js';
import { InitialsEntryState } from './InitialsEntryState.js';
import { CharacterSelectState } from './CharacterSelectState.js';
import { PauseState } from './PauseState.js';
import { Player } from '../entities/Player.js';
import { SajaBoy } from '../entities/SajaBoy.js';
import { FinalBoss } from '../entities/FinalBoss.js';
import { FreezeProjectile } from '../entities/FreezeProjectile.js';
import { Enemy } from '../entities/Enemy.js';
import { Projectile } from '../entities/Projectile.js';
import { HealthPill } from '../entities/HealthPill.js';
import { WingwomenManager } from '../systems/WingwomenManager.js';
import { ScoreManager } from '../systems/ScoreManager.js';
import { CollisionDetector } from '../core/CollisionDetector.js';
import { CHARACTERS } from '../data/characters.js';
import { CONFIG } from '../config.js';

export class BossState extends BaseState {
  constructor(game, characterData, difficulty, scoreManager, allCharacters = null) {
    super(game);
    this.characterData = characterData;
    this.difficulty = difficulty;
    this.difficultyConfig = CONFIG.DIFFICULTY[difficulty.toUpperCase()];
    this.scoreManager = scoreManager;
    this.allCharacters = allCharacters;

    // Phase tracking
    this.phase = 1; // 1 = Saja Boys, 2 = Gwi-Ma
    this.phaseTransitioning = false;
    this.phaseTransitionTimer = 0;
    this.phaseTransitionDuration = 2000;
    this.gwimaSlideIn = false;
    this.gwimaSlideTimer = 0;
    this.gwimaSlideStartX = 800; // Start off-screen
    this.heroesBeingPushed = false;
    this.heroPushTargets = {};

    // Entities
    this.player = null;
    this.sajaBoys = [];
    this.finalBoss = null;
    this.projectiles = [];
    this.freezeProjectiles = [];
    this.summonedEnemies = [];
    this.healthPills = [];

    this.wingwomenManager = null;
    this.gameOver = false;
    this.victory = false;
    this.victoryTimer = 0;
    this.victoryDelay = 3000;
    this.victoryInputBlocked = true; // Block input initially to prevent instant advance

    // Turn-based for easy mode
    this.turnBasedMode = difficulty === 'easy';
    this.currentTurnIndex = 0;
    this.turnTimer = 0;
    this.turnDuration = 4000; // Each boy gets 4 seconds
    this.maxActiveBoys = 2; // Only 2 active at once in easy mode

    this.healthPacksSkipped = 0;
  }

  enter() {
    console.log('BossState: Entering boss fight, phase', this.phase);
    console.log('BossState: Character data:', this.characterData);

    // Create player at starting position
    this.player = new Player(this.characterData, 100, 250);
    this.player.health = this.difficultyConfig.playerHealth;
    this.player.maxHealth = this.difficultyConfig.playerHealth;
    console.log('BossState: Player created at', this.player.position, 'HP:', this.player.health);

    // Wingwomen stay active throughout boss fight
    const companionCharacters = this.allCharacters || CHARACTERS;
    this.wingwomenManager = new WingwomenManager(
      this.characterData,
      companionCharacters
    );

    // Set player reference for AI
    this.wingwomenManager.playerCharacter = this.player;
    this.wingwomenManager.companions.forEach(companion => {
      if (companion.aiController) {
        companion.aiController.player = this.player;
      }
    });

    this.wingwomenManager.active = true;
    this.wingwomenManager.forceActive(); // Keep them on permanently

    if (this.phase === 1) {
      this.initSajaBoys();
    } else if (this.phase === 2) {
      this.initFinalBoss();
    }

    // Play boss music
    this.game.audioManager.playMusic('boss');
  }

  initSajaBoys() {
    // Create 5 Saja Boys spread across the right side
    // Art spec: Boy 1 = Red Tank (leader), Boy 2 = Blue Freeze (ice), etc.
    const boyTypes = ['tank', 'freeze', 'dodger', 'summoner', 'berserker'];
    const spacing = 100;
    const startX = 650;
    const startY = 150;

    boyTypes.forEach((type, index) => {
      const x = startX + (index % 2) * 80;
      const y = startY + Math.floor(index / 2) * spacing;

      const boy = new SajaBoy(x, y, type, this.difficultyConfig, this.difficulty);
      boy.artIndex = index + 1; // Art package uses 1-based indexing (1-5)
      this.sajaBoys.push(boy);
    });

    console.log('BossState: Created', this.sajaBoys.length, 'Saja Boys, turn-based mode:', this.turnBasedMode);

    // Start first turn in easy mode
    if (this.turnBasedMode) {
      console.log('BossState: Activating initial turns for easy mode');
      this.activateNextTurns();
    }
  }

  activateNextTurns() {
    // Deactivate all turns
    this.sajaBoys.forEach(boy => boy.isMyTurn = false);

    // Activate next 2 boys
    const aliveBoys = this.sajaBoys.filter(boy => boy.active);
    if (aliveBoys.length === 0) return;

    for (let i = 0; i < Math.min(this.maxActiveBoys, aliveBoys.length); i++) {
      const boyIndex = (this.currentTurnIndex + i) % aliveBoys.length;
      aliveBoys[boyIndex].activateTurn(this.turnDuration);
      console.log('BossState: Activated', aliveBoys[boyIndex].boyType, 'turn');
    }

    this.currentTurnIndex = (this.currentTurnIndex + this.maxActiveBoys) % aliveBoys.length;
    this.turnTimer = this.turnDuration;
  }

  initFinalBoss() {
    this.finalBoss = new FinalBoss(this.difficulty);
    // Start Gwi-Ma off-screen to the right
    this.finalBoss.position.x = 800;
    console.log('BossState: Created Gwi-Ma with', this.finalBoss.health, 'HP at x=800 (off-screen)');
  }

  update(dt) {
    if (this.gameOver) {
      // Transition to game over
      if (this.scoreManager.isNewHighScore(this.difficulty, 'story')) {
        const initialsState = new InitialsEntryState(
          this.game,
          this.scoreManager.currentScore,
          this.characterData,
          this.difficulty,
          'story'
        );
        this.game.changeState(initialsState);
      } else {
        const gameOverState = new GameOverState(
          this.game,
          this.scoreManager.currentScore,
          this.characterData,
          this.difficulty,
          'story'
        );
        this.game.changeState(gameOverState);
      }
      return;
    }

    if (this.victory) {
      this.victoryTimer += dt;
      // Don't auto-advance, wait for user to press Enter
      return;
    }

    if (this.phaseTransitioning) {
      this.phaseTransitionTimer += dt;
      if (this.phaseTransitionTimer >= this.phaseTransitionDuration) {
        this.phaseTransitioning = false;
        this.phase = 2;
        this.initFinalBoss();

        // Start Gwi-Ma slide-in
        this.gwimaSlideIn = true;
        this.gwimaSlideTimer = 0;
        this.heroesBeingPushed = true;

        // Set push targets for all heroes (80% to the left from current position)
        const allHeroes = [this.player, ...this.wingwomenManager.getActiveCompanions()];
        allHeroes.forEach(hero => {
          const pushDistance = hero.position.x * 0.8;
          this.heroPushTargets[hero] = hero.position.x - pushDistance;
        });
      }
      return;
    }

    // Handle Gwi-Ma slide-in animation
    if (this.gwimaSlideIn) {
      this.gwimaSlideTimer += dt;
      const slideDuration = 1500; // 1.5 seconds to slide in

      if (this.gwimaSlideTimer >= slideDuration) {
        this.gwimaSlideIn = false;
        this.heroesBeingPushed = false;
      } else {
        // Slide Gwi-Ma in from right
        const progress = this.gwimaSlideTimer / slideDuration;
        const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        this.finalBoss.position.x = this.gwimaSlideStartX - (this.gwimaSlideStartX - 608) * easeProgress;

        // Push heroes back
        const allHeroes = [this.player, ...this.wingwomenManager.getActiveCompanions()];
        allHeroes.forEach(hero => {
          const targetX = this.heroPushTargets[hero];
          if (hero.position.x > targetX) {
            hero.position.x -= (hero.position.x - targetX) * 0.1; // Smooth slide
          }
          hero.velocity.x = 0;
          hero.velocity.y = 0;
        });
      }
      return;
    }

    // Update player
    if (this.player.freezeTimer > 0) {
      this.player.freezeTimer -= dt;
    } else {
      this.player.update(dt);
    }

    // Update wingwomen
    const allPlayers = [this.player, ...this.wingwomenManager.getActiveCompanions()];
    const allEnemies = [...this.sajaBoys, ...this.summonedEnemies];
    if (this.finalBoss && this.finalBoss.active) {
      allEnemies.push(this.finalBoss);
    }

    this.wingwomenManager.update(dt, allEnemies);
    this.wingwomenManager.getActiveCompanions().forEach(companion => {
      if (companion.freezeTimer > 0) {
        companion.freezeTimer -= dt;
      } else {
        companion.update(dt);
      }
    });

    // Phase 1: Saja Boys
    if (this.phase === 1) {
      // Turn-based timer for easy mode
      if (this.turnBasedMode) {
        this.turnTimer -= dt;
        if (this.turnTimer <= 0) {
          this.activateNextTurns();
        }
      }

      // Update Saja Boys
      this.sajaBoys.forEach(boy => {
        if (boy.active) {
          boy.update(dt, this.player, this.turnBasedMode);

          // Freeze boy - shoot projectiles
          if (boy.canShootFreezeProjectile()) {
            const freezeProj = new FreezeProjectile(
              boy.position.x,
              boy.position.y + boy.size.y / 2 - 12
            );
            this.freezeProjectiles.push(freezeProj);
            boy.shootFreezeProjectile();
          }

          // Summoner boy - spawn enemies
          if (boy.canSummon()) {
            for (let i = 0; i < 2; i++) {
              const spawnY = 150 + Math.random() * 250;
              const enemy = new Enemy(750, spawnY, 'basic', this.difficultyConfig, this.difficulty);
              this.summonedEnemies.push(enemy);
            }
            boy.summon();
          }
        }
      });

      // Check if all Saja Boys defeated
      const aliveBoys = this.sajaBoys.filter(boy => boy.active);
      if (aliveBoys.length === 0 && this.sajaBoys.length > 0) {
        console.log('BossState: All Saja Boys defeated, transitioning to phase 2');
        this.phaseTransitioning = true;
        this.phaseTransitionTimer = 0;

        // Clear health pills for phase 2
        this.healthPills = [];
        console.log('BossState: Cleared health pills for phase 2');

        // Wingwomen stay active - no change needed
      }
    }

    // Phase 2: Gwi-Ma
    if (this.phase === 2 && this.finalBoss) {
      if (this.finalBoss.active) {
        this.finalBoss.update(dt);
      } else if (!this.victory) {
        // Gwi-Ma just died!
        console.log('BossState: Gwi-Ma defeated! VICTORY!');
        this.victory = true;
        this.victoryTimer = 0;
        this.victoryInputBlocked = true; // Block input initially
        this.scoreManager.addPoints(10000); // Huge victory bonus
      }
    }

    // Update summoned enemies
    this.summonedEnemies.forEach(enemy => {
      if (enemy.active) {
        enemy.update(dt, this.player);
      }
    });

    // Update projectiles (player and companions)
    this.projectiles.forEach(proj => proj.update(dt));
    this.projectiles = this.projectiles.filter(p => p.active);

    // Update freeze projectiles
    this.freezeProjectiles.forEach(proj => proj.update(dt));
    this.freezeProjectiles = this.freezeProjectiles.filter(p => p.active);

    // Update health pills
    this.healthPills.forEach(pill => pill.update(dt));
    this.healthPills = this.healthPills.filter(p => p.active);

    this.handleCollisions();

    // Check player death
    if (this.player.health <= 0) {
      console.log('BossState: Player died in boss fight');
      this.gameOver = true;
    }
  }

  handleCollisions() {
    const leeway = this.difficultyConfig.hitboxForgiveness;
    const allPlayers = [this.player, ...this.wingwomenManager.getActiveCompanions()];

    // Player/Companion attacks on Saja Boys
    allPlayers.forEach(player => {
      if (player.justAttacked) {
        // Check for throwing knife projectiles
        if (player.characterType === 'zoey') {
          const damage = player.attackDamage * this.difficultyConfig.playerDamageMultiplier;
          const projectile = new Projectile(
            player.position.x + player.size.x,
            player.position.y + player.size.y / 2 - 8,
            damage
          );
          this.projectiles.push(projectile);
          this.game.audioManager.playAttackSound(player.characterType);
        } else {
          // Melee attack
          const attackBox = player.getAttackBox();
          if (attackBox) {
            this.sajaBoys.forEach(boy => {
              if (boy.active && CollisionDetector.checkAABB(attackBox, boy)) {
                const damage = player.attackDamage * this.difficultyConfig.playerDamageMultiplier;
                boy.takeDamage(damage);
                this.game.audioManager.playHitSound();

                if (!boy.active) {
                  this.onSajaBoyDefeated(boy);
                }
              }
            });

            // Attack Gwi-Ma in phase 2
            if (this.finalBoss && this.finalBoss.active && CollisionDetector.checkAABB(attackBox, this.finalBoss)) {
              const damage = player.attackDamage * this.difficultyConfig.playerDamageMultiplier;
              this.finalBoss.takeDamage(damage);
              this.game.audioManager.playHitSound();
            }
          }
          this.game.audioManager.playAttackSound(player.characterType);
        }

        player.clearAttackFlag();
      }
    });

    // Projectiles on Saja Boys
    this.projectiles.forEach(proj => {
      this.sajaBoys.forEach(boy => {
        if (boy.active && proj.active && CollisionDetector.checkAABB(proj, boy)) {
          // Check for dodge
          if (boy.tryDodge()) {
            console.log('BossState: Dodger boy avoided projectile!');
            proj.active = false;
            return;
          }

          boy.takeDamage(proj.damage);
          proj.active = false;
          this.game.audioManager.playHitSound();

          if (!boy.active) {
            this.onSajaBoyDefeated(boy);
          }
        }
      });

      // Projectiles on Gwi-Ma
      if (this.finalBoss && this.finalBoss.active && proj.active && CollisionDetector.checkAABB(proj, this.finalBoss)) {
        this.finalBoss.takeDamage(proj.damage);
        proj.active = false;
        this.game.audioManager.playHitSound();
      }
    });

    // Freeze projectiles on players
    this.freezeProjectiles.forEach(freezeProj => {
      allPlayers.forEach(player => {
        if (player.active && freezeProj.active && CollisionDetector.checkAABB(freezeProj, player)) {
          player.freezeTimer = freezeProj.freezeDuration;
          freezeProj.active = false;
          console.log('BossState: Player frozen for', freezeProj.freezeDuration, 'ms');
        }
      });
    });

    // Saja Boys and summoned enemies damage players
    [...this.sajaBoys, ...this.summonedEnemies].forEach(enemy => {
      if (!enemy.active) return;

      allPlayers.forEach(player => {
        if (player.active && CollisionDetector.checkAABB(player, enemy, leeway)) {
          if (player.invulnerabilityTimer <= 0) {
            player.takeDamage(enemy.damage);
            this.game.audioManager.playHitSound();

            if (player === this.player) {
              this.scoreManager.resetCombo();
            }
          }
          CollisionDetector.resolveCollision(player, enemy);
        }
      });
    });

    // Players attack summoned enemies
    allPlayers.forEach(player => {
      this.summonedEnemies.forEach(enemy => {
        if (!enemy.active) return;

        const attackBox = player.getAttackBox();
        if (attackBox && player.isAttacking && CollisionDetector.checkAABB(attackBox, enemy)) {
          const damage = player.attackDamage * this.difficultyConfig.playerDamageMultiplier;
          enemy.health -= damage;

          if (enemy.health <= 0) {
            enemy.active = false;
            this.scoreManager.incrementCombo();
            this.scoreManager.addPoints(100);
            this.game.audioManager.playEnemyDeathSound();

            // Drop health pill
            if (enemy.shouldDropHealthPill()) {
              const pill = new HealthPill(
                enemy.position.x + enemy.size.x / 2 - 8,
                enemy.position.y + enemy.size.y / 2 - 8,
                0
              );
              this.healthPills.push(pill);
            }
          }
        }
      });
    });

    // Projectiles on summoned enemies
    this.projectiles.forEach(proj => {
      this.summonedEnemies.forEach(enemy => {
        if (enemy.active && proj.active && CollisionDetector.checkAABB(proj, enemy)) {
          enemy.health -= proj.damage;
          proj.active = false;
          this.game.audioManager.playHitSound();

          if (enemy.health <= 0) {
            enemy.active = false;
            this.scoreManager.incrementCombo();
            this.scoreManager.addPoints(100);
            this.game.audioManager.playEnemyDeathSound();

            if (enemy.shouldDropHealthPill()) {
              const pill = new HealthPill(
                enemy.position.x + enemy.size.x / 2 - 8,
                enemy.position.y + enemy.size.y / 2 - 8,
                0
              );
              this.healthPills.push(pill);
            }
          }
        }
      });
    });

    // Health pill pickup
    this.healthPills.forEach(pill => {
      if (pill.active && CollisionDetector.checkAABB(this.player, pill)) {
        const healAmount = this.difficulty === 'easy'
          ? this.player.maxHealth * 0.3
          : this.player.maxHealth * 0.2;

        const wasAtFullHealth = this.player.heal(healAmount);

        if (wasAtFullHealth) {
          this.healthPacksSkipped++;
          const bonusPoints = this.healthPacksSkipped * 10;
          this.scoreManager.addPoints(bonusPoints);
          console.log(`Health pack skipped bonus: ${bonusPoints} points`);
        }

        pill.active = false;
        this.game.audioManager.playHealthPickupSound();
      }
    });
  }

  onSajaBoyDefeated(boy) {
    console.log('BossState: Saja Boy defeated:', boy.boyType);
    this.scoreManager.incrementCombo();
    this.scoreManager.addPoints(1000); // Big points for boss defeat
    this.game.audioManager.playEnemyDeathSound();

    // Drop guaranteed health pill
    const pill = new HealthPill(
      boy.position.x + boy.size.x / 2 - 8,
      boy.position.y + boy.size.y / 2 - 8,
      0
    );
    this.healthPills.push(pill);
  }

  handleInput(inputState, dt) {
    // Handle pause (only during active gameplay)
    if (inputState.pause && !this.gameOver && !this.victory && !this.phaseTransitioning) {
      this.game.audioManager.playUISound();
      const pauseState = new PauseState(this.game, this);
      this.game.changeState(pauseState);
      return;
    }

    // Victory screen - wait for Enter to continue
    if (this.victory) {
      // Unblock input after key is released
      if (!inputState.confirm && !inputState.attack) {
        this.victoryInputBlocked = false;
      }

      if (inputState.confirm && !this.victoryInputBlocked) {
        console.log('BossState: Enter pressed, transitioning to high scores');
        // Check if current score would make top 10
        const key = `story_${this.difficulty}`;
        const highScores = this.scoreManager.getHighScores(key);
        const isNewHighScore = highScores.length < 10 || this.scoreManager.currentScore > highScores[highScores.length - 1].score;

        // Transition to high scores
        if (isNewHighScore) {
          const initialsState = new InitialsEntryState(
            this.game,
            this.scoreManager.currentScore,
            this.characterData,
            this.difficulty,
            'story'
          );
          this.game.changeState(initialsState);
        } else {
          const gameOverState = new GameOverState(
            this.game,
            this.scoreManager.currentScore,
            this.characterData,
            this.difficulty,
            'story'
          );
          this.game.changeState(gameOverState);
        }
      }
      return;
    }

    if (this.player && !this.gameOver && !this.phaseTransitioning) {
      if (this.player.freezeTimer <= 0) {
        this.player.handleInput(inputState, dt);
      }
    }
  }

  render(ctx) {
    // Background
    // Render boss arena background
    const images = this.game.images;
    for (let i = 1; i <= 3; i++) {
      const bgKey = `bg_boss_layer${i}`;
      const bg = images[bgKey];
      if (bg && bg.complete) {
        const scale = ctx.canvas.width / bg.width;
        const scaledHeight = bg.height * scale;
        const yOffset = (ctx.canvas.height - scaledHeight) / 2;
        ctx.drawImage(bg, 0, yOffset, ctx.canvas.width, scaledHeight);
      }
    }

    // Fallback
    if (!images['bg_boss_layer1']) {
      ctx.fillStyle = '#1a0033';
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    // Arena border
    ctx.strokeStyle = '#ff00ff';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 100, ctx.canvas.width - 20, ctx.canvas.height - 110);

    // Phase indicator
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'left';
    if (this.phase === 1) {
      ctx.fillText('BOSS FIGHT - PHASE 1: SAJA BOYS', 20, 40);
    } else if (this.phase === 2) {
      ctx.fillText('BOSS FIGHT - PHASE 2: GWI-MA', 20, 40);
    }

    // Phase transition
    if (this.phaseTransitioning) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      ctx.fillStyle = '#ff00ff';
      ctx.font = 'bold 48px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('PHASE 2', ctx.canvas.width / 2, ctx.canvas.height / 2 - 20);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px monospace';
      ctx.fillText('GWI-MA AWAKENS', ctx.canvas.width / 2, ctx.canvas.height / 2 + 30);
      return;
    }

    // Render entities
    if (this.player) {
      this.player.render(ctx, images);

      // Freeze effect
      if (this.player.freezeTimer > 0) {
        ctx.fillStyle = 'rgba(0, 221, 255, 0.4)';
        ctx.fillRect(this.player.position.x - 4, this.player.position.y - 4,
                     this.player.size.x + 8, this.player.size.y + 8);
      }
    }

    this.wingwomenManager.getActiveCompanions().forEach(companion => {
      companion.render(ctx, images);

      if (companion.freezeTimer > 0) {
        ctx.fillStyle = 'rgba(0, 221, 255, 0.4)';
        ctx.fillRect(companion.position.x - 4, companion.position.y - 4,
                     companion.size.x + 8, companion.size.y + 8);
      }
    });

    this.sajaBoys.forEach(boy => boy.render(ctx, images));
    this.summonedEnemies.forEach(enemy => enemy.render(ctx, images));

    if (this.finalBoss && this.finalBoss.active) {
      this.finalBoss.render(ctx, images);
    }

    this.projectiles.forEach(proj => proj.render(ctx, images));
    this.freezeProjectiles.forEach(proj => proj.render(ctx, images));
    this.healthPills.forEach(pill => pill.render(ctx, images));

    // UI
    this.renderUI(ctx);

    // Victory screen
    if (this.victory) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      ctx.fillStyle = '#ffff00';
      ctx.font = 'bold 72px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('VICTORY!', ctx.canvas.width / 2, ctx.canvas.height / 2 - 60);

      ctx.fillStyle = '#ff00ff';
      ctx.font = 'bold 28px monospace';
      ctx.fillText('STORY MODE COMPLETE', ctx.canvas.width / 2, ctx.canvas.height / 2 - 10);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px monospace';
      ctx.fillText('GWI-MA DEFEATED!', ctx.canvas.width / 2, ctx.canvas.height / 2 + 30);

      ctx.font = '20px monospace';
      ctx.fillText(`FINAL SCORE: ${this.scoreManager.currentScore}`, ctx.canvas.width / 2, ctx.canvas.height / 2 + 70);

      // Animate continue prompt
      const pulse = Math.sin(this.victoryTimer * 0.005) * 0.3 + 0.7;
      ctx.globalAlpha = pulse;
      ctx.fillStyle = '#00ff00';
      ctx.font = 'bold 18px monospace';
      ctx.fillText('PRESS ENTER TO CONTINUE', ctx.canvas.width / 2, ctx.canvas.height / 2 + 110);
      ctx.globalAlpha = 1.0;
    }
  }

  renderUI(ctx) {
    const uiY = 60;

    // Health
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`HP: ${Math.ceil(this.player.health)}/${this.player.maxHealth}`, 20, uiY);

    // Score
    ctx.textAlign = 'right';
    ctx.fillText(`SCORE: ${this.scoreManager.currentScore}`, ctx.canvas.width - 20, uiY);

    // Combo
    if (this.scoreManager.currentCombo > 0) {
      ctx.fillStyle = '#ffff00';
      ctx.font = 'bold 20px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`COMBO x${this.scoreManager.currentCombo}`, ctx.canvas.width / 2, uiY);
    }

    // Alive Saja Boys count
    if (this.phase === 1) {
      const aliveCount = this.sajaBoys.filter(b => b.active).length;
      ctx.fillStyle = '#ff00ff';
      ctx.font = '16px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`SAJA BOYS: ${aliveCount}/5`, ctx.canvas.width / 2, 85);
    }
  }
}
