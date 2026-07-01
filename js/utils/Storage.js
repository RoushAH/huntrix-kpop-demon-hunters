export class Storage {
  static KEY_PREFIX = 'huntrix_';

  static save(key, value) {
    try {
      const fullKey = this.KEY_PREFIX + key;
      const serialized = JSON.stringify(value);
      localStorage.setItem(fullKey, serialized);
      return true;
    } catch (e) {
      console.error('Storage save failed:', e);
      return false;
    }
  }

  static load(key, defaultValue = null) {
    try {
      const fullKey = this.KEY_PREFIX + key;
      const serialized = localStorage.getItem(fullKey);
      if (serialized === null) {
        return defaultValue;
      }
      return JSON.parse(serialized);
    } catch (e) {
      console.error('Storage load failed:', e);
      return defaultValue;
    }
  }

  static remove(key) {
    const fullKey = this.KEY_PREFIX + key;
    localStorage.removeItem(fullKey);
  }

  static clear() {
    Object.keys(localStorage)
      .filter(key => key.startsWith(this.KEY_PREFIX))
      .forEach(key => localStorage.removeItem(key));
  }
}
