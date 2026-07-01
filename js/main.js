import { Game } from './core/Game.js';
import { InputManager } from './core/InputManager.js';
import { LoadingState } from './states/LoadingState.js';
import { CONFIG } from './config.js';

function resizeCanvas() {
  const canvas = document.getElementById('gameCanvas');
  const targetAspect = CONFIG.CANVAS_WIDTH / CONFIG.CANVAS_HEIGHT;
  const windowAspect = window.innerWidth / window.innerHeight;

  if (windowAspect > targetAspect) {
    canvas.style.height = '100vh';
    canvas.style.width = `${100 * targetAspect * window.innerHeight / window.innerWidth}vw`;
  } else {
    canvas.style.width = '100vw';
    canvas.style.height = `${100 * window.innerWidth / (targetAspect * window.innerHeight)}vh`;
  }

  canvas.width = CONFIG.CANVAS_WIDTH;
  canvas.height = CONFIG.CANVAS_HEIGHT;
}

window.addEventListener('load', () => {
  const canvas = document.getElementById('gameCanvas');
  resizeCanvas();

  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('orientationchange', resizeCanvas);

  const game = new Game(canvas);
  const inputManager = new InputManager(canvas);

  game.inputManager = inputManager;

  // Start with loading state to preload assets
  const loadingState = new LoadingState(game);
  game.changeState(loadingState);

  game.start();

  function updateInput() {
    if (game.currentState) {
      game.currentState.handleInput(inputManager.getInput());
    }
    requestAnimationFrame(updateInput);
  }
  updateInput();

  document.getElementById('loading').style.display = 'none';
});
