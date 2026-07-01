export class Timer {
  constructor(duration) {
    this.duration = duration;
    this.elapsed = 0;
    this.active = false;
  }

  start() {
    this.active = true;
    this.elapsed = 0;
  }

  stop() {
    this.active = false;
  }

  reset() {
    this.elapsed = 0;
  }

  update(dt) {
    if (this.active) {
      this.elapsed += dt;
    }
  }

  isFinished() {
    return this.elapsed >= this.duration;
  }

  getProgress() {
    return Math.min(this.elapsed / this.duration, 1.0);
  }

  getRemaining() {
    return Math.max(0, this.duration - this.elapsed);
  }
}
