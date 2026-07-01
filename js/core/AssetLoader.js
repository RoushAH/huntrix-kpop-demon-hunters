export class AssetLoader {
  constructor() {
    this.images = {};
    this.loadedCount = 0;
    this.totalCount = 0;
    this.onProgress = null;
    this.onComplete = null;
  }

  loadAssets(assetList, onProgress, onComplete) {
    this.onProgress = onProgress;
    this.onComplete = onComplete;
    this.totalCount = assetList.length;
    this.loadedCount = 0;

    if (this.totalCount === 0) {
      if (this.onComplete) this.onComplete(this.images);
      return;
    }

    assetList.forEach(asset => {
      const img = new Image();
      img.onload = () => {
        this.loadedCount++;
        console.log(`AssetLoader: Loaded ${asset.key} (${this.loadedCount}/${this.totalCount})`);

        if (this.onProgress) {
          this.onProgress(this.loadedCount, this.totalCount);
        }

        if (this.loadedCount === this.totalCount) {
          console.log('AssetLoader: All assets loaded');
          if (this.onComplete) {
            this.onComplete(this.images);
          }
        }
      };

      img.onerror = () => {
        console.warn(`AssetLoader: Failed to load ${asset.path}`);
        this.loadedCount++;

        if (this.onProgress) {
          this.onProgress(this.loadedCount, this.totalCount);
        }

        if (this.loadedCount === this.totalCount) {
          console.log('AssetLoader: Finished loading (some failed)');
          if (this.onComplete) {
            this.onComplete(this.images);
          }
        }
      };

      img.src = asset.path;
      this.images[asset.key] = img;
    });
  }

  getImage(key) {
    return this.images[key];
  }

  static getCharacterAssets() {
    const characters = ['rumi', 'mira', 'zoey'];
    const animations = ['idle', 'walk', 'attack', 'hit', 'portrait'];
    const assets = [];

    characters.forEach(char => {
      animations.forEach(anim => {
        assets.push({
          key: `${char}_${anim}`,
          path: `assets/sprites/characters/${char}/${char}_${anim}.png`
        });
      });
    });

    return assets;
  }

  static getEnemyAssets() {
    return [
      // Basic demon
      { key: 'demon_basic_walk', path: 'assets/sprites/enemies/basic/demon_basic_walk.png' },
      { key: 'demon_basic_attack', path: 'assets/sprites/enemies/basic/demon_basic_attack.png' },
      { key: 'demon_basic_death', path: 'assets/sprites/enemies/basic/demon_basic_death.png' },

      // Fast demon
      { key: 'demon_fast_walk', path: 'assets/sprites/enemies/fast/demon_fast_walk.png' },
      { key: 'demon_fast_attack', path: 'assets/sprites/enemies/fast/demon_fast_attack.png' },
      { key: 'demon_fast_death', path: 'assets/sprites/enemies/fast/demon_fast_death.png' },

      // Tank demon
      { key: 'demon_tank_walk', path: 'assets/sprites/enemies/tank/demon_tank_walk.png' },
      { key: 'demon_tank_attack', path: 'assets/sprites/enemies/tank/demon_tank_attack.png' },
      { key: 'demon_tank_death', path: 'assets/sprites/enemies/tank/demon_tank_death.png' },

      // Saja Boy 1 (Red Tank - Leader)
      { key: 'saja_boy_1_idle', path: 'assets/sprites/enemies/saja_boys/saja_boy_1_idle.png' },
      { key: 'saja_boy_1_attack', path: 'assets/sprites/enemies/saja_boys/saja_boy_1_attack.png' },
      { key: 'saja_boy_1_hit', path: 'assets/sprites/enemies/saja_boys/saja_boy_1_hit.png' },
      { key: 'saja_boy_1_death', path: 'assets/sprites/enemies/saja_boys/saja_boy_1_death.png' },

      // Saja Boy 2 (Blue Freeze - Ice man)
      { key: 'saja_boy_2_idle', path: 'assets/sprites/enemies/saja_boys/saja_boy_2_idle.png' },
      { key: 'saja_boy_2_attack', path: 'assets/sprites/enemies/saja_boys/saja_boy_2_attack.png' },
      { key: 'saja_boy_2_hit', path: 'assets/sprites/enemies/saja_boys/saja_boy_2_hit.png' },
      { key: 'saja_boy_2_death', path: 'assets/sprites/enemies/saja_boys/saja_boy_2_death.png' },

      // Saja Boy 3 (Green Dodger)
      { key: 'saja_boy_3_idle', path: 'assets/sprites/enemies/saja_boys/saja_boy_3_idle.png' },
      { key: 'saja_boy_3_attack', path: 'assets/sprites/enemies/saja_boys/saja_boy_3_attack.png' },
      { key: 'saja_boy_3_hit', path: 'assets/sprites/enemies/saja_boys/saja_boy_3_hit.png' },
      { key: 'saja_boy_3_death', path: 'assets/sprites/enemies/saja_boys/saja_boy_3_death.png' },

      // Saja Boy 4 (Purple Summoner)
      { key: 'saja_boy_4_idle', path: 'assets/sprites/enemies/saja_boys/saja_boy_4_idle.png' },
      { key: 'saja_boy_4_attack', path: 'assets/sprites/enemies/saja_boys/saja_boy_4_attack.png' },
      { key: 'saja_boy_4_hit', path: 'assets/sprites/enemies/saja_boys/saja_boy_4_hit.png' },
      { key: 'saja_boy_4_death', path: 'assets/sprites/enemies/saja_boys/saja_boy_4_death.png' },

      // Saja Boy 5 (Orange Berserker)
      { key: 'saja_boy_5_idle', path: 'assets/sprites/enemies/saja_boys/saja_boy_5_idle.png' },
      { key: 'saja_boy_5_attack', path: 'assets/sprites/enemies/saja_boys/saja_boy_5_attack.png' },
      { key: 'saja_boy_5_hit', path: 'assets/sprites/enemies/saja_boys/saja_boy_5_hit.png' },
      { key: 'saja_boy_5_death', path: 'assets/sprites/enemies/saja_boys/saja_boy_5_death.png' },

      // Gwi-Ma (Final Boss)
      { key: 'gwima_idle', path: 'assets/sprites/enemies/gwima/gwima_idle.png' },
      { key: 'gwima_hit', path: 'assets/sprites/enemies/gwima/gwima_hit.png' },
      { key: 'gwima_death', path: 'assets/sprites/enemies/gwima/gwima_death.png' },
    ];
  }

  static getEffectAssets() {
    return [
      { key: 'blood_splatter', path: 'assets/sprites/effects/blood_splatter.png' },
      { key: 'combo_flash', path: 'assets/sprites/effects/combo_flash.png' },
      { key: 'heal_effect', path: 'assets/sprites/effects/heal_effect.png' },
      { key: 'hit_spark', path: 'assets/sprites/effects/hit_spark.png' },
      { key: 'knife', path: 'assets/sprites/effects/knife.png' },
      { key: 'slash_effect', path: 'assets/sprites/effects/slash_effect.png' },
    ];
  }

  static getTutorialAssets() {
    return [
      { key: 'tutorial_arrow_keys', path: 'assets/sprites/tutorial/tutorial_arrow_keys.png' },
      { key: 'tutorial_attack_icon', path: 'assets/sprites/tutorial/tutorial_attack_icon.png' },
      { key: 'tutorial_drag_gesture', path: 'assets/sprites/tutorial/tutorial_drag_gesture.png' },
      { key: 'tutorial_enemy_icon', path: 'assets/sprites/tutorial/tutorial_enemy_icon.png' },
      { key: 'tutorial_space_key', path: 'assets/sprites/tutorial/tutorial_space_key.png' },
      { key: 'tutorial_tap_gesture', path: 'assets/sprites/tutorial/tutorial_tap_gesture.png' },
    ];
  }

  static getUIAssets() {
    return [
      { key: 'button_easy', path: 'assets/sprites/ui/button_easy.png' },
      { key: 'button_hard', path: 'assets/sprites/ui/button_hard.png' },
      { key: 'button_start', path: 'assets/sprites/ui/button_start.png' },
      { key: 'heart_full', path: 'assets/sprites/ui/heart_full.png' },
      { key: 'heart_empty', path: 'assets/sprites/ui/heart_empty.png' },
      { key: 'insert_coin', path: 'assets/sprites/ui/insert_coin.png' },
      { key: 'press_start', path: 'assets/sprites/ui/press_start.png' },
      { key: 'logo', path: 'assets/sprites/ui/logo.png' },
      { key: 'demon_icon_rumi', path: 'assets/sprites/ui/demon_icon_rumi.png' },
      { key: 'demon_icon_mira', path: 'assets/sprites/ui/demon_icon_mira.png' },
      { key: 'demon_icon_zoey', path: 'assets/sprites/ui/demon_icon_zoey.png' },
      { key: 'stat_heart', path: 'assets/sprites/ui/stat_heart.png' },
    ];
  }

  static getBackgroundAssets() {
    return [
      // Level 1: Seoul Cityscape Night
      { key: 'bg_level1_layer1', path: 'assets/backgrounds/level1/bg_level1_layer1.png' },
      { key: 'bg_level1_layer2', path: 'assets/backgrounds/level1/bg_level1_layer2.png' },
      { key: 'bg_level1_layer3', path: 'assets/backgrounds/level1/bg_level1_layer3.png' },

      // Level 2: Neon District
      { key: 'bg_level2_layer1', path: 'assets/backgrounds/level2/bg_level2_layer1.png' },
      { key: 'bg_level2_layer2', path: 'assets/backgrounds/level2/bg_level2_layer2.png' },
      { key: 'bg_level2_layer3', path: 'assets/backgrounds/level2/bg_level2_layer3.png' },

      // Level 3: Demonic Realm
      { key: 'bg_level3_layer1', path: 'assets/backgrounds/level3/bg_level3_layer1.png' },
      { key: 'bg_level3_layer2', path: 'assets/backgrounds/level3/bg_level3_layer2.png' },
      { key: 'bg_level3_layer3', path: 'assets/backgrounds/level3/bg_level3_layer3.png' },

      // Boss Arena
      { key: 'bg_boss_layer1', path: 'assets/backgrounds/boss/bg_boss_layer1.png' },
      { key: 'bg_boss_layer2', path: 'assets/backgrounds/boss/bg_boss_layer2.png' },
      { key: 'bg_boss_layer3', path: 'assets/backgrounds/boss/bg_boss_layer3.png' },
    ];
  }

  static getAllAssets() {
    return [
      ...AssetLoader.getCharacterAssets(),
      ...AssetLoader.getEnemyAssets(),
      ...AssetLoader.getEffectAssets(),
      ...AssetLoader.getTutorialAssets(),
      ...AssetLoader.getUIAssets(),
      ...AssetLoader.getBackgroundAssets()
    ];
  }
}
