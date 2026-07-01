# Asset Generation Scripts

Python scripts for generating game sprites using OpenAI DALL-E.

## Setup

1. Create a `.env` file in this directory (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

2. Add your OpenAI API key to `.env`:
   ```
   OPENAI_API_KEY=sk-proj-your-actual-key-here
   ```

3. Load environment variables before running scripts:
   ```bash
   # On Windows (PowerShell)
   $env:OPENAI_API_KEY = "sk-proj-your-key-here"
   python bulk_sprite_generator.py
   
   # On Windows (Command Prompt)
   set OPENAI_API_KEY=sk-proj-your-key-here
   python bulk_sprite_generator.py
   
   # On Linux/Mac
   export OPENAI_API_KEY=sk-proj-your-key-here
   python bulk_sprite_generator.py
   ```

## Scripts

- `bulk_sprite_generator.py` - Batch generate character sprites
- `openai_generator.py` - Core image generation functions
- `crop_and_vary.py` - Crop and create variations of existing sprites
- `rumi_identity_analysis.py` - Analyze character traits for consistency
- `sprite_generator_gui_phase2.py` - GUI tool for sprite generation

## Security Note

Never commit `.env` files or hardcode API keys. The `.gitignore` file excludes `.env` automatically.
