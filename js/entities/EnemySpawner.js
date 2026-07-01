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

      const enemy = new Enemy(
        CONFIG.ENEMY_SPAWN_X,
        Math.random() * 250 + 100,
        this.getEnemyType(),
        this.difficultyConfig,
        this.difficulty
      );

      return enemy;
    }

    return null;
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
