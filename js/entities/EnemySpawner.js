import { Enemy } from './Enemy.js';
import { CONFIG } from '../config.js';

export class EnemySpawner {
  constructor(difficulty, spawnRate = 1) {
    this.difficulty = difficulty;
    this.spawnRate = spawnRate;
    this.spawnTimer = 0;
    this.waveNumber = 1;
    this.enemiesSpawned = 0;

    this.difficultyConfig = CONFIG.DIFFICULTY[difficulty.toUpperCase()];

    this.baseSpawnInterval = difficulty === 'easy' ? 2000 : 1500;
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

    if (this.waveNumber < 3) {
      return 'basic';
    } else if (this.waveNumber < 5) {
      return random < 0.7 ? 'basic' : 'fast';
    } else {
      if (random < 0.5) return 'basic';
      if (random < 0.8) return 'fast';
      return 'tank';
    }
  }

  incrementWave() {
    this.waveNumber++;
  }
}
