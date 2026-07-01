import { CONFIG } from '../config.js';

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;

    this.currentState = null;
    this.stateStack = [];
    this.lastTime = 0;
    this.accumulator = 0;
    this.fixedDeltaTime = CONFIG.FIXED_DT;

    this.running = false;
  }

  changeState(newState) {
    if (this.currentState) {
      this.currentState.exit();
    }
    this.currentState = newState;
    if (this.currentState) {
      this.currentState.enter();
    }
  }

  pushState(state) {
    this.stateStack.push(this.currentState);
    this.changeState(state);
  }

  popState() {
    if (this.stateStack.length > 0) {
      const previousState = this.stateStack.pop();
      this.changeState(previousState);
    }
  }

  start() {
    this.running = true;
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  stop() {
    this.running = false;
  }

  loop(currentTime) {
    if (!this.running) return;

    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    this.accumulator += deltaTime;

    while (this.accumulator >= this.fixedDeltaTime) {
      if (this.currentState) {
        this.currentState.update(this.fixedDeltaTime);
      }
      this.accumulator -= this.fixedDeltaTime;
    }

    const alpha = this.accumulator / this.fixedDeltaTime;

    this.ctx.fillStyle = '#1a0033';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.currentState) {
      this.currentState.render(this.ctx, alpha);
    }

    requestAnimationFrame((t) => this.loop(t));
  }
}
