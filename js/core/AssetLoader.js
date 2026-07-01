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
      // Fast demon
      { key: 'demon_fast_walk', path: 'assets/sprites/enemies/fast/demon_fast_walk.png' },
      { key: 'demon_fast_attack', path: 'assets/sprites/enemies/fast/demon_fast_attack.png' },
      { key: 'demon_fast_death', path: 'assets/sprites/enemies/fast/demon_fast_death.png' },

      // Tank demon
      { key: 'demon_tank_walk', path: 'assets/sprites/enemies/tank/demon_tank_walk.png' },
      { key: 'demon_tank_attack', path: 'assets/sprites/enemies/tank/demon_tank_attack.png' },
    ];
  }

  static getAllAssets() {
    return [
      ...AssetLoader.getCharacterAssets(),
      ...AssetLoader.getEnemyAssets()
    ];
  }
}
