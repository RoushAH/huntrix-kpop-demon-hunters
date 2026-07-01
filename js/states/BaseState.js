export class BaseState {
  constructor(game) {
    this.game = game;
  }

  enter() {}

  exit() {}

  update(dt) {}

  render(ctx, alpha) {}

  handleInput(inputState) {}
}
