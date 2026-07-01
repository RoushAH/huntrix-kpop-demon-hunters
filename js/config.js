export const CONFIG = {
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 450,

  PLAYER_BASE_SPEED: 150,
  PLAYER_SIZE: { width: 42, height: 62 }, // 30% larger (was 32x48)

  ENEMY_BASE_SPEED: 80,
  ENEMY_SPAWN_X: 850,

  ATTACK_COOLDOWN: 300,
  MELEE_RANGE: 50,
  PROJECTILE_SPEED: 300,

  DIFFICULTY: {
    EASY: {
      playerHealth: 150,
      playerDamageMultiplier: 1.2,
      enemySpeedMultiplier: 0.7,
      enemyHealthMultiplier: 0.8,
      hitboxLeeway: 10
    },
    HARD: {
      playerHealth: 100,
      playerDamageMultiplier: 1.0,
      enemySpeedMultiplier: 1.3,
      enemyHealthMultiplier: 1.2,
      hitboxLeeway: 0
    }
  },

  WINGWOMEN_ACTIVE_DURATION: 30000,
  WINGWOMEN_INACTIVE_DURATION: 60000,
  SPAWN_RATE_HIGH: 3,
  SPAWN_RATE_LOW: 1,

  COMBO_MULTIPLIER_THRESHOLD_1: 5,
  COMBO_MULTIPLIER_THRESHOLD_2: 10,
  COMBO_MULTIPLIER_1: 1.5,
  COMBO_MULTIPLIER_2: 2.0,

  FPS: 60,
  FIXED_DT: 1000 / 60
};
