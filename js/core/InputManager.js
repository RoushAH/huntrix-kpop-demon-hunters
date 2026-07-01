export class InputManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.inputMode = null;
    this.currentInput = {
      left: false,
      right: false,
      up: false,
      down: false,
      attack: false,
      confirm: false,
      pause: false
    };

    this.touchStart = null;
    this.touchCurrent = null;

    this.setupListeners();
  }

  setupListeners() {
    window.addEventListener('keydown', (e) => {
      if (!this.inputMode) this.inputMode = 'keyboard';
      this.handleKeyDown(e);
    });

    window.addEventListener('keyup', (e) => {
      this.handleKeyUp(e);
    });

    this.canvas.addEventListener('touchstart', (e) => {
      if (!this.inputMode) this.inputMode = 'touch';
      this.handleTouchStart(e);
    });

    this.canvas.addEventListener('touchmove', (e) => {
      this.handleTouchMove(e);
    });

    this.canvas.addEventListener('touchend', (e) => {
      this.handleTouchEnd(e);
    });

    this.canvas.addEventListener('mousedown', (e) => {
      if (!this.inputMode) this.inputMode = 'touch';
      this.handleMouseDown(e);
    });

    this.canvas.addEventListener('mousemove', (e) => {
      if (this.touchStart) {
        this.handleMouseMove(e);
      }
    });

    this.canvas.addEventListener('mouseup', (e) => {
      this.handleMouseUp(e);
    });
  }

  handleKeyDown(e) {
    switch(e.key.toLowerCase()) {
      case 'arrowleft':
      case 'a':
        this.currentInput.left = true;
        break;
      case 'arrowright':
      case 'd':
        this.currentInput.right = true;
        break;
      case 'arrowup':
      case 'w':
        this.currentInput.up = true;
        break;
      case 'arrowdown':
      case 's':
        this.currentInput.down = true;
        break;
      case ' ':
      case 'x':
        this.currentInput.attack = true;
        break;
      case 'enter':
        this.currentInput.confirm = true;
        break;
      case 'escape':
        this.currentInput.pause = true;
        break;
    }
  }

  handleKeyUp(e) {
    switch(e.key.toLowerCase()) {
      case 'arrowleft':
      case 'a':
        this.currentInput.left = false;
        break;
      case 'arrowright':
      case 'd':
        this.currentInput.right = false;
        break;
      case 'arrowup':
      case 'w':
        this.currentInput.up = false;
        break;
      case 'arrowdown':
      case 's':
        this.currentInput.down = false;
        break;
      case ' ':
      case 'x':
        this.currentInput.attack = false;
        break;
      case 'enter':
        this.currentInput.confirm = false;
        break;
      case 'escape':
        this.currentInput.pause = false;
        break;
    }
  }

  handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = this.canvas.getBoundingClientRect();
    this.touchStart = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };
    this.touchCurrent = { ...this.touchStart };
  }

  handleTouchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = this.canvas.getBoundingClientRect();
    this.touchCurrent = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };

    const dx = this.touchCurrent.x - this.touchStart.x;
    const dy = this.touchCurrent.y - this.touchStart.y;
    const threshold = 10;

    this.currentInput.left = dx < -threshold;
    this.currentInput.right = dx > threshold;
    this.currentInput.up = dy < -threshold;
    this.currentInput.down = dy > threshold;
  }

  handleTouchEnd(e) {
    if (this.touchStart && this.touchCurrent) {
      const dx = this.touchCurrent.x - this.touchStart.x;
      const dy = this.touchCurrent.y - this.touchStart.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 20) {
        this.currentInput.attack = true;
        setTimeout(() => {
          this.currentInput.attack = false;
        }, 100);
      }
    }

    this.currentInput.left = false;
    this.currentInput.right = false;
    this.currentInput.up = false;
    this.currentInput.down = false;
    this.touchStart = null;
    this.touchCurrent = null;
  }

  handleMouseDown(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.touchStart = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    this.touchCurrent = { ...this.touchStart };
  }

  handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.touchCurrent = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };

    const dx = this.touchCurrent.x - this.touchStart.x;
    const dy = this.touchCurrent.y - this.touchStart.y;
    const threshold = 10;

    this.currentInput.left = dx < -threshold;
    this.currentInput.right = dx > threshold;
    this.currentInput.up = dy < -threshold;
    this.currentInput.down = dy > threshold;
  }

  handleMouseUp(e) {
    if (this.touchStart && this.touchCurrent) {
      const dx = this.touchCurrent.x - this.touchStart.x;
      const dy = this.touchCurrent.y - this.touchStart.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 20) {
        this.currentInput.attack = true;
        setTimeout(() => {
          this.currentInput.attack = false;
        }, 100);
      }
    }

    this.currentInput.left = false;
    this.currentInput.right = false;
    this.currentInput.up = false;
    this.currentInput.down = false;
    this.touchStart = null;
    this.touchCurrent = null;
  }

  getInput() {
    return this.currentInput;
  }

  getInputMode() {
    return this.inputMode;
  }
}
