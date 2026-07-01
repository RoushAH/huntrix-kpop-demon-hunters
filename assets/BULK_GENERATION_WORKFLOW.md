# Bulk Sprite Generation Workflow

## Confirmed Working Process

### Step 1: Generate via ChatGPT
1. Go to ChatGPT (web interface with image generation capability)
2. Attach: `Cover Photo.png`
3. Paste the sprite spec from ART_ASSETS.md (format table + requirements)
4. ChatGPT generates the sprite with correct character appearance

### Step 2: Download & Process
1. Download the generated image
2. Run processing script to:
   - Remove background (make transparent)
   - Crop to content
   - Resize to exact spec dimensions
   - Split into correct number of frames if needed
3. Move to correct directory per ART_ASSETS.md structure

### Step 3: Verify
- Check dimensions match spec exactly
- Verify frame count is correct
- Verify transparency
- Create 8x zoomed preview for visual QC

## Phase 1 MVP Sprites (Priority Order)

### Character Animations (Rumi, Mira, Zoey)
Each character needs:
1. ✅ **idle** - Standing ready (4 frames @ 32×48px = 128×48px total)
2. ✅ **walk** - Walking animation (6 frames @ 32×48px = 192×48px total)
3. **attack** - Attack animation (5 frames @ 48×48px = 240×48px total)
4. **hit** - Taking damage (3 frames @ 32×48px = 96×48px total)
5. **portrait** - Character select (1 frame @ 128×128px)

### Basic Enemy Sprites
6. **demon_basic_walk** - (4 frames @ 32×48px = 128×48px)
7. **demon_basic_attack** - (3 frames @ 32×48px = 96×48px)
8. **demon_basic_death** - (4 frames @ 32×48px = 128×48px)

### UI Elements
9. **heart_full** - 16×16px
10. **heart_empty** - 16×16px
11. **button_start** - 128×32px
12. **button_easy** - 96×32px
13. **button_hard** - 96×32px

### Background (Simplified for MVP)
14. **bg_level1_layer3** - 800×450px (single layer for MVP)

## Prompt Template for Next Sprites

For each sprite, use this format:

```
[Paste relevant section from ART_ASSETS.md including:]
- Character theme/description
- Sprite table with dimensions/frames/description
- Format requirements (PNG, transparency, pixel art style, etc.)
- Color palette

[Attach: Cover Photo.png]
```

## Processing Scripts Created

- `process_chatgpt_sprite.py` - Generic processor for any sprite
- `fix_rumi_idle_4frames.py` - Handles frame duplication when needed
- `process_rumi_walk.py` - Example for multi-frame animations

## Directory Structure (per ART_ASSETS.md)

```
assets/
├── sprites/
│   ├── characters/
│   │   ├── rumi/
│   │   │   ├── rumi_idle.png ✅
│   │   │   ├── rumi_walk.png ✅
│   │   │   ├── rumi_attack.png (NEXT)
│   │   │   ├── rumi_hit.png
│   │   │   └── rumi_portrait.png
│   │   ├── mira/
│   │   └── zoey/
│   ├── enemies/
│   │   └── basic/
│   ├── effects/
│   └── ui/
└── backgrounds/
    └── level1/
```

## Estimated Time
- Per sprite generation: ~2-3 minutes (ChatGPT + download)
- Per sprite processing: ~30 seconds
- **Total for Phase 1 MVP (~15 sprites): ~1-2 hours**

## Quality Checklist
- ✅ Matches character appearance from Cover Photo
- ✅ Correct dimensions per spec
- ✅ Correct frame count
- ✅ Transparent background
- ✅ True pixel art (no anti-aliasing)
- ✅ Vibrant colors matching palette
- ✅ Saved in correct directory

## Next Actions
1. Continue with rumi_attack.png
2. Complete Rumi's animations
3. Generate Mira's animations (same process, different character)
4. Generate Zoey's animations
5. Move to enemy sprites
6. Finish with UI elements

The workflow is proven and ready to scale!
