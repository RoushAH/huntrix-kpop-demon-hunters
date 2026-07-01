import { Enemy } from './Enemy.js';
import { CONFIG } from '../config.js';

export class EnemySpawner {
  constructor(difficulty, spawnRate = 1, level = 1) {
    this.difficulty = difficulty;
    this.spawnRate = spawnRate;
    this.level = level;
    this.spawnTimer = 0;
    this.waveNumber = 1;
    this.enemiesSpawned = 0;

    this.difficultyConfig = CONFIG.DIFFICULTY[difficulty.toUpperCase()];

    // Base spawn interval decreases per level
    const baseInterval = difficulty === 'easy' ? 2000 : 1500;
    const levelMultipliers = [1.0, 0.9, 0.8]; // Level 1: 100%, Level 2: 90%, Level 3: 80%
    this.baseSpawnInterval = baseInterval * (levelMultipliers[level - 1] || 1.0);
  }

  setSpawnRate(rate) {
    console.log('Enemy spawn rate changed to:', rate, 'x');
    this.spawnRate = rate;
  }

  update(dt) {
    this.spawnTimer += dt;

    const interval = this.baseSpawnInterval / this.spawnRate;

    if (this.spawnTimer >= interval) {
      this.spawnTimer = 0;
      this.enemiesSpawned++;

      if (this.enemiesSpawned % 10 === 0) {
        console.log('Spawned', this.enemiesSpawned, 'enemies. Current interval:', interval, 'ms (rate:', this.spawnRate, 'x)');
      }

      const spawnPos = this.getRandomSpawnPosition();
      const enemy = new Enemy(
        spawnPos.x,
        spawnPos.y,
        this.getEnemyType(),
        this.difficultyConfig,
        this.difficulty
      );

      return enemy;
    }

    return null;
  }

  getRandomSpawnPosition() {
    const random = Math.random();

    // 70% chance: spawn from right edge (main side)
    // 15% chance: spawn from top-right corner area
    // 15% chance: spawn from bottom-right corner area

    if (random < 0.7) {
      // Right edge, anywhere from y=100 to y=350
      return {
        x: CONFIG.ENEMY_SPAWN_X,
        y: Math.random() * 250 + 100
      };
    } else if (random < 0.85) {
      // Top-right corner area (rightmost 10% of top edge)
      return {
        x: Math.random() * 80 + 720, // x from 720 to 800
        y: Math.random() * 60 + 40   // y from 40 to 100
      };
    } else {
      // Bottom-right corner area (rightmost 10% of bottom edge)
      return {
        x: Math.random() * 80 + 720, // x from 720 to 800
        y: Math.random() * 60 + 350  // y from 350 to 410
      };
    }
  }

  getEnemyType() {
    const random = Math.random();

    // Level-based enemy type distribution
    if (this.level === 1) {
      // Level 1: Mostly basic, some fast later
      if (this.enemiesSpawned < 15) {
        return 'basic';
      } else if (this.enemiesSpawned < 30) {
        return random < 0.8 ? 'basic' : 'fast';
      } else {
        return random < 0.6 ? 'basic' : 'fast';
      }
    } else if (this.level === 2) {
      // Level 2: Starts with fast, introduces tanks
      if (this.enemiesSpawned < 10) {
        return random < 0.7 ? 'fast' : 'basic';
      } else if (this.enemiesSpawned < 30) {
        if (random < 0.4) return 'fast';
        if (random < 0.8) return 'basic';
        return 'tank';
      } else {
        if (random < 0.5) return 'fast';
        if (random < 0.7) return 'basic';
        return 'tank';
      }
    } else {
      // Level 3: Starts with tanks, heavy mix
      if (this.enemiesSpawned < 10) {
        return random < 0.7 ? 'tank' : 'fast';
      } else if (this.enemiesSpawned < 30) {
        if (random < 0.4) return 'tank';
        if (random < 0.7) return 'fast';
        return 'basic';
      } else {
        if (random < 0.5) return 'tank';
        if (random < 0.75) return 'fast';
        return 'basic';
      }
    }
  }

  incrementWave() {
    this.waveNumber++;
  }
}
