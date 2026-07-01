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
    this.timer = this.offDuration;
    this.initialized = false;
  }

  createCompanions(playerChar, allCharacters) {
    return allCharacters
      .filter(c => c.name !== playerChar.name)
      .map(c => {
        const companion = new Player(c, 50, 200);
        companion.isAI = true;
        companion.aiController = new AIController(companion);
        return companion;
      });
  }

  update(dt, enemies) {
    if (!this.initialized) {
      this.initialized = true;
      return null;
    }

    this.timer -= dt;

    if (this.active && this.timer <= 0) {
      this.active = false;
      this.timer = this.offDuration;
      return { event: 'companions_leave', newSpawnRate: CONFIG.SPAWN_RATE_LOW };
    } else if (!this.active && this.timer <= 0) {
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
    this.companions[0].position.set(
      this.playerCharacter.position.x - 60,
      baseY - 30
    );
    if (this.companions[1]) {
      this.companions[1].position.set(
        this.playerCharacter.position.x - 60,
        baseY + 30
      );
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
