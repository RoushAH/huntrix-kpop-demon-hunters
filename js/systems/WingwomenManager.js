import { Player } from '../entities/Player.js';
import { AIController } from './AIController.js';
import { CONFIG } from '../config.js';
import { CHARACTERS } from '../data/characters.js';

export class WingwomenManager {
  constructor(playerCharacter, allCharacters) {
    this.playerCharacter = playerCharacter;
    this.companions = this.createCompanions(playerCharacter, allCharacters);
    this.active = false;
    this.onDuration = CONFIG.WINGWOMEN_ACTIVE_DURATION;
    this.offDuration = CONFIG.WINGWOMEN_INACTIVE_DURATION;
    this.timer = 20000;
    this.initialized = false;
  }

  createCompanions(playerChar, allCharacters) {
    console.log('Creating companions for player:', playerChar.name);
    console.log('All characters:', allCharacters.map(c => c.name));

    const companions = allCharacters
      .filter(c => c.name !== playerChar.name)
      .map(c => {
        const companion = new Player(c, 50, 200);
        companion.isAI = true;

        // Make companions much weaker
        companion.baseSpeed = companion.baseSpeed * 0.5;
        companion.attackDamage = companion.attackDamage * 0.25; // Was 0.4, now 0.25 (even weaker)
        companion.attackCooldown = 0; // Start ready to attack immediately

        console.log('Created companion:', companion.name,
          'STR:', c.str,
          'base damage:', 10 + (c.str * 5),
          'companion damage:', companion.attackDamage);
        return companion;
      });

    // Initialize AI controllers after all companions are created
    companions.forEach(companion => {
      companion.aiController = new AIController(companion, this.playerCharacter, companions);
    });

    console.log('Total companions created:', companions.length);
    return companions;
  }

  update(dt, enemies) {
    if (!this.initialized) {
      this.initialized = true;
      console.log('WingwomenManager initialized. Starting timer:', this.timer, 'ms');
      return null;
    }

    this.timer -= dt;

    if (this.timer % 10000 < 100) {
      console.log('Wingwomen timer:', Math.floor(this.timer / 1000), 's, Active:', this.active);
    }

    if (this.active && this.timer <= 0) {
      console.log('WINGWOMEN LEAVING!');
      this.active = false;
      this.timer = this.offDuration;
      return { event: 'companions_leave', newSpawnRate: CONFIG.SPAWN_RATE_LOW };
    } else if (!this.active && this.timer <= 0) {
      console.log('WINGWOMEN JOINING! Companions:', this.companions.length);
      this.active = true;
      this.timer = this.onDuration;
      this.resetCompanionPositions();
      return { event: 'companions_join', newSpawnRate: CONFIG.SPAWN_RATE_HIGH };
    }

    if (this.active) {
      this.companions.forEach(companion => {
        companion.aiController.update(dt, enemies);
        companion.update(dt);
      });
    }

    return null;
  }

  resetCompanionPositions() {
    const baseY = this.playerCharacter.position.y;
    // Spawn on left side of screen
    this.companions[0].position.set(80, baseY - 40);
    this.companions[0].velocity.x = 0;
    this.companions[0].velocity.y = 0;

    if (this.companions[1]) {
      this.companions[1].position.set(80, baseY + 40);
      this.companions[1].velocity.x = 0;
      this.companions[1].velocity.y = 0;
    }
  }

  getActiveCompanions() {
    return this.active ? this.companions : [];
  }

  forceActivate() {
    this.active = true;
    this.timer = this.onDuration;
    this.resetCompanionPositions();
  }

  forceDeactivate() {
    this.active = false;
    this.timer = this.offDuration;
  }
}
