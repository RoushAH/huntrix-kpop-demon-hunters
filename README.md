# HUNTRIX: K-Pop Demon Hunters

An 8-bit style beat-em-up game featuring a K-pop girl band fighting demons. Built with HTML5 Canvas and vanilla JavaScript.

## Features

- 3 playable characters (Rumi, Mira, Zoey) with unique stats and abilities
- AI companion "wingwomen" system
- Two difficulty modes (Easy/Hard)
- Story Mode and Endless Mode
- PWA support (installable, offline play)
- MIDI music and retro sound effects
- Local high score tracking
- Touch and keyboard controls

## Development

### Phase 1: Foundation ✅
- Core game loop with fixed timestep
- State management system
- Input handling (keyboard + touch with auto-detect)
- Title screen
- PWA infrastructure

### Running Locally

1. Start a local web server (required for ES6 modules):
   ```bash
   python -m http.server 8000
   # or
   npx http-server -p 8000
   ```

2. Open browser to `http://localhost:8000`

### Project Structure

```
huntrix/
├── index.html          # Entry point
├── manifest.json       # PWA manifest
├── sw.js              # Service worker
├── css/               # Styles
├── js/
│   ├── main.js        # Game initialization
│   ├── config.js      # Game constants
│   ├── core/          # Core engine
│   ├── entities/      # Game entities
│   ├── systems/       # Game systems
│   ├── states/        # Game states
│   ├── data/          # Game data
│   └── utils/         # Utilities
└── assets/            # Graphics and audio

```

## Controls

**Keyboard:**
- Arrow keys or WASD: Move
- Space or X: Attack

**Touch:**
- Drag: Move character
- Tap: Attack

## Art Assets

See `ART_ASSETS.md` for complete specifications for artists.

## License

© 2026 HUNTRIX Game Development
