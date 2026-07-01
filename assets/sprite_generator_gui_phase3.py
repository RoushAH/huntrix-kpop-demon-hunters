import tkinter as tk
from tkinter import filedialog, scrolledtext, messagebox
import pyperclip
from PIL import Image
import numpy as np
import os

# Phase 3 Queue: Basic Demon, Saja Boys, Gwi-Ma, UI Elements
SPRITE_QUEUE = [
    # Basic Demon (3 sprites)
    {"name": "demon_basic_walk", "prompt": """### Enemy Type 1: Basic Demon
**Theme**: Standard demon, red/orange, humanoid

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `demon_basic_walk.png` | 128×48px | 4 frames @ 32×48px | Walking toward player |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (frames side-by-side)

**Color palette**: Red (#cc0000), orange highlights, black shadows""",
        "dims": (128, 48), "frames": 4, "frame_size": (32, 48), "dir": "sprites/enemies/basic"},
    {"name": "demon_basic_attack", "prompt": """### Enemy Type 1: Basic Demon
**Theme**: Standard demon, red/orange, humanoid

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `demon_basic_attack.png` | 96×48px | 3 frames @ 32×48px | Claw swipe attack |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (frames side-by-side)

**Color palette**: Red (#cc0000), orange highlights, black shadows""",
        "dims": (96, 48), "frames": 3, "frame_size": (32, 48), "dir": "sprites/enemies/basic"},
    {"name": "demon_basic_death", "prompt": """### Enemy Type 1: Basic Demon
**Theme**: Standard demon, red/orange, humanoid

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `demon_basic_death.png` | 128×48px | 4 frames @ 32×48px | Dissolve/explode animation |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (frames side-by-side)

**Color palette**: Red (#cc0000), orange highlights, black shadows""",
        "dims": (128, 48), "frames": 4, "frame_size": (32, 48), "dir": "sprites/enemies/basic"},

    # Saja Boys - Boy 1 (Red/Maroon Leader)
    {"name": "saja_boy_1_idle", "prompt": """### Boss: Saja Boy 1 (Leader)
**Theme**: K-pop idol demon hunter, Red/maroon color scheme

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `saja_boy_1_idle.png` | 384×96px | 6 frames @ 64×96px | Leader - Red/maroon |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (frames side-by-side)

**Color palette**: Red/maroon (#990000), black outfit, gold accents
**Hair**: Red/maroon styled hair""",
        "dims": (384, 96), "frames": 6, "frame_size": (64, 96), "dir": "sprites/enemies/saja_boys"},
    {"name": "saja_boy_1_attack", "prompt": """### Boss: Saja Boy 1 (Leader)
**Theme**: K-pop idol demon hunter, Red/maroon color scheme

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `saja_boy_1_attack.png` | 320×96px | 5 frames @ 64×96px | Special attack move |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (frames side-by-side)

**Color palette**: Red/maroon (#990000), black outfit, gold accents
**Hair**: Red/maroon styled hair""",
        "dims": (320, 96), "frames": 5, "frame_size": (64, 96), "dir": "sprites/enemies/saja_boys"},
    {"name": "saja_boy_1_hit", "prompt": """### Boss: Saja Boy 1 (Leader)
**Theme**: K-pop idol demon hunter, Red/maroon color scheme

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `saja_boy_1_hit.png` | 192×96px | 3 frames @ 64×96px | Taking damage |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (frames side-by-side)

**Color palette**: Red/maroon (#990000), black outfit, gold accents
**Hair**: Red/maroon styled hair""",
        "dims": (192, 96), "frames": 3, "frame_size": (64, 96), "dir": "sprites/enemies/saja_boys"},
    {"name": "saja_boy_1_death", "prompt": """### Boss: Saja Boy 1 (Leader)
**Theme**: K-pop idol demon hunter, Red/maroon color scheme

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `saja_boy_1_death.png` | 512×96px | 8 frames @ 64×96px | Dramatic defeat |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (frames side-by-side)

**Color palette**: Red/maroon (#990000), black outfit, gold accents
**Hair**: Red/maroon styled hair""",
        "dims": (512, 96), "frames": 8, "frame_size": (64, 96), "dir": "sprites/enemies/saja_boys"},

    # Saja Boys - Boy 2 (Blue/Navy)
    {"name": "saja_boy_2_idle", "prompt": """### Boss: Saja Boy 2
**Theme**: K-pop idol demon hunter, Blue/navy color scheme

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `saja_boy_2_idle.png` | 384×96px | 6 frames @ 64×96px | Blue/navy member |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (frames side-by-side)

**Color palette**: Blue/navy (#000099), black outfit, silver accents
**Hair**: Blue/navy styled hair""",
        "dims": (384, 96), "frames": 6, "frame_size": (64, 96), "dir": "sprites/enemies/saja_boys"},
    {"name": "saja_boy_2_attack", "prompt": """### Boss: Saja Boy 2
**Theme**: K-pop idol demon hunter, Blue/navy color scheme

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `saja_boy_2_attack.png` | 320×96px | 5 frames @ 64×96px | Special attack move |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (frames side-by-side)

**Color palette**: Blue/navy (#000099), black outfit, silver accents
**Hair**: Blue/navy styled hair""",
        "dims": (320, 96), "frames": 5, "frame_size": (64, 96), "dir": "sprites/enemies/saja_boys"},
    {"name": "saja_boy_2_hit", "prompt": """### Boss: Saja Boy 2
**Theme**: K-pop idol demon hunter, Blue/navy color scheme

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `saja_boy_2_hit.png` | 192×96px | 3 frames @ 64×96px | Taking damage |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (frames side-by-side)

**Color palette**: Blue/navy (#000099), black outfit, silver accents
**Hair**: Blue/navy styled hair""",
        "dims": (192, 96), "frames": 3, "frame_size": (64, 96), "dir": "sprites/enemies/saja_boys"},
    {"name": "saja_boy_2_death", "prompt": """### Boss: Saja Boy 2
**Theme**: K-pop idol demon hunter, Blue/navy color scheme

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `saja_boy_2_death.png` | 512×96px | 8 frames @ 64×96px | Dramatic defeat |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (frames side-by-side)

**Color palette**: Blue/navy (#000099), black outfit, silver accents
**Hair**: Blue/navy styled hair""",
        "dims": (512, 96), "frames": 8, "frame_size": (64, 96), "dir": "sprites/enemies/saja_boys"},

    # Saja Boys - Boy 3 (Green/Teal)
    {"name": "saja_boy_3_idle", "prompt": """### Boss: Saja Boy 3
**Theme**: K-pop idol demon hunter, Green/teal color scheme

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `saja_boy_3_idle.png` | 384×96px | 6 frames @ 64×96px | Green/teal member |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (frames side-by-side)

**Color palette**: Green/teal (#009966), black outfit, silver accents
**Hair**: Green/teal styled hair""",
        "dims": (384, 96), "frames": 6, "frame_size": (64, 96), "dir": "sprites/enemies/saja_boys"},
    {"name": "saja_boy_3_attack", "prompt": """### Boss: Saja Boy 3
**Theme**: K-pop idol demon hunter, Green/teal color scheme

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `saja_boy_3_attack.png` | 320×96px | 5 frames @ 64×96px | Special attack move |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (frames side-by-side)

**Color palette**: Green/teal (#009966), black outfit, silver accents
**Hair**: Green/teal styled hair""",
        "dims": (320, 96), "frames": 5, "frame_size": (64, 96), "dir": "sprites/enemies/saja_boys"},
    {"name": "saja_boy_3_hit", "prompt": """### Boss: Saja Boy 3
**Theme**: K-pop idol demon hunter, Green/teal color scheme

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `saja_boy_3_hit.png` | 192×96px | 3 frames @ 64×96px | Taking damage |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (frames side-by-side)

**Color palette**: Green/teal (#009966), black outfit, silver accents
**Hair**: Green/teal styled hair""",
        "dims": (192, 96), "frames": 3, "frame_size": (64, 96), "dir": "sprites/enemies/saja_boys"},
    {"name": "saja_boy_3_death", "prompt": """### Boss: Saja Boy 3
**Theme**: K-pop idol demon hunter, Green/teal color scheme

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `saja_boy_3_death.png` | 512×96px | 8 frames @ 64×96px | Dramatic defeat |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (frames side-by-side)

**Color palette**: Green/teal (#009966), black outfit, silver accents
**Hair**: Green/teal styled hair""",
        "dims": (512, 96), "frames": 8, "frame_size": (64, 96), "dir": "sprites/enemies/saja_boys"},

    # Saja Boys - Boy 4 (Orange/Gold)
    {"name": "saja_boy_4_idle", "prompt": """### Boss: Saja Boy 4
**Theme**: K-pop idol demon hunter, Orange/gold color scheme

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `saja_boy_4_idle.png` | 384×96px | 6 frames @ 64×96px | Orange/gold member |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (frames side-by-side)

**Color palette**: Orange/gold (#ff9900), black outfit, gold accents
**Hair**: Orange/gold styled hair""",
        "dims": (384, 96), "frames": 6, "frame_size": (64, 96), "dir": "sprites/enemies/saja_boys"},
    {"name": "saja_boy_4_attack", "prompt": """### Boss: Saja Boy 4
**Theme**: K-pop idol demon hunter, Orange/gold color scheme

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `saja_boy_4_attack.png` | 320×96px | 5 frames @ 64×96px | Special attack move |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (frames side-by-side)

**Color palette**: Orange/gold (#ff9900), black outfit, gold accents
**Hair**: Orange/gold styled hair""",
        "dims": (320, 96), "frames": 5, "frame_size": (64, 96), "dir": "sprites/enemies/saja_boys"},
    {"name": "saja_boy_4_hit", "prompt": """### Boss: Saja Boy 4
**Theme**: K-pop idol demon hunter, Orange/gold color scheme

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `saja_boy_4_hit.png` | 192×96px | 3 frames @ 64×96px | Taking damage |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (frames side-by-side)

**Color palette**: Orange/gold (#ff9900), black outfit, gold accents
**Hair**: Orange/gold styled hair""",
        "dims": (192, 96), "frames": 3, "frame_size": (64, 96), "dir": "sprites/enemies/saja_boys"},
    {"name": "saja_boy_4_death", "prompt": """### Boss: Saja Boy 4
**Theme**: K-pop idol demon hunter, Orange/gold color scheme

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `saja_boy_4_death.png` | 512×96px | 8 frames @ 64×96px | Dramatic defeat |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (frames side-by-side)

**Color palette**: Orange/gold (#ff9900), black outfit, gold accents
**Hair**: Orange/gold styled hair""",
        "dims": (512, 96), "frames": 8, "frame_size": (64, 96), "dir": "sprites/enemies/saja_boys"},

    # Saja Boys - Boy 5 (Purple/Violet)
    {"name": "saja_boy_5_idle", "prompt": """### Boss: Saja Boy 5
**Theme**: K-pop idol demon hunter, Purple/violet color scheme

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `saja_boy_5_idle.png` | 384×96px | 6 frames @ 64×96px | Purple/violet member |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (frames side-by-side)

**Color palette**: Purple/violet (#9933cc), black outfit, silver accents
**Hair**: Purple/violet styled hair""",
        "dims": (384, 96), "frames": 6, "frame_size": (64, 96), "dir": "sprites/enemies/saja_boys"},
    {"name": "saja_boy_5_attack", "prompt": """### Boss: Saja Boy 5
**Theme**: K-pop idol demon hunter, Purple/violet color scheme

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `saja_boy_5_attack.png` | 320×96px | 5 frames @ 64×96px | Special attack move |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (frames side-by-side)

**Color palette**: Purple/violet (#9933cc), black outfit, silver accents
**Hair**: Purple/violet styled hair""",
        "dims": (320, 96), "frames": 5, "frame_size": (64, 96), "dir": "sprites/enemies/saja_boys"},
    {"name": "saja_boy_5_hit", "prompt": """### Boss: Saja Boy 5
**Theme**: K-pop idol demon hunter, Purple/violet color scheme

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `saja_boy_5_hit.png` | 192×96px | 3 frames @ 64×96px | Taking damage |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (frames side-by-side)

**Color palette**: Purple/violet (#9933cc), black outfit, silver accents
**Hair**: Purple/violet styled hair""",
        "dims": (192, 96), "frames": 3, "frame_size": (64, 96), "dir": "sprites/enemies/saja_boys"},
    {"name": "saja_boy_5_death", "prompt": """### Boss: Saja Boy 5
**Theme**: K-pop idol demon hunter, Purple/violet color scheme

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `saja_boy_5_death.png` | 512×96px | 8 frames @ 64×96px | Dramatic defeat |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (frames side-by-side)

**Color palette**: Purple/violet (#9933cc), black outfit, silver accents
**Hair**: Purple/violet styled hair""",
        "dims": (512, 96), "frames": 8, "frame_size": (64, 96), "dir": "sprites/enemies/saja_boys"},

    # Gwi-Ma Final Boss (3 sprites)
    {"name": "gwima_idle", "prompt": """### Final Boss: Gwi-Ma
**Theme**: Massive demon overlord, dark purple/black with glowing eyes, INTIMIDATING

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `gwima_idle.png` | 1152×256px | 6 frames @ 192×256px | Menacing standing pose, arms crossed |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (frames side-by-side)

**Color palette**: Dark purple (#330066), black, glowing red eyes, dark energy effects""",
        "dims": (1152, 256), "frames": 6, "frame_size": (192, 256), "dir": "sprites/enemies/gwima"},
    {"name": "gwima_hit", "prompt": """### Final Boss: Gwi-Ma
**Theme**: Massive demon overlord, dark purple/black with glowing eyes, INTIMIDATING

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `gwima_hit.png` | 576×256px | 3 frames @ 192×256px | Flinching from attacks (NOT attacking back) |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (frames side-by-side)

**Color palette**: Dark purple (#330066), black, glowing red eyes, dark energy effects""",
        "dims": (576, 256), "frames": 3, "frame_size": (192, 256), "dir": "sprites/enemies/gwima"},
    {"name": "gwima_death", "prompt": """### Final Boss: Gwi-Ma
**Theme**: Massive demon overlord, dark purple/black with glowing eyes, INTIMIDATING

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `gwima_death.png` | 2304×256px | 12 frames @ 192×256px | Epic defeat - explosions, light beams, dramatic |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (frames side-by-side)

**Color palette**: Dark purple (#330066), black, glowing red eyes, dark energy effects, white/yellow explosions""",
        "dims": (2304, 256), "frames": 12, "frame_size": (192, 256), "dir": "sprites/enemies/gwima"},

    # UI Elements (17 sprites)
    {"name": "heart_full", "prompt": """### UI Element: Full Heart
**Theme**: Full health heart icon

| File | Dimensions | Description |
|------|-----------|-------------|
| `heart_full.png` | 16×16px | Full health heart icon |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)

**Color palette**: Red heart, black outline""",
        "dims": (16, 16), "frames": 1, "frame_size": (16, 16), "dir": "sprites/ui"},
    {"name": "heart_empty", "prompt": """### UI Element: Empty Heart
**Theme**: Empty health heart icon

| File | Dimensions | Description |
|------|-----------|-------------|
| `heart_empty.png` | 16×16px | Empty health heart icon |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)

**Color palette**: Gray/white outline, black border""",
        "dims": (16, 16), "frames": 1, "frame_size": (16, 16), "dir": "sprites/ui"},
    {"name": "button_start", "prompt": """### UI Element: START Button
**Theme**: "START" button graphic

| File | Dimensions | Description |
|------|-----------|-------------|
| `button_start.png` | 128×32px | "START" button graphic |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)

**Color palette**: Gradient button (purple/pink), white "START" text, arcade style""",
        "dims": (128, 32), "frames": 1, "frame_size": (128, 32), "dir": "sprites/ui"},
    {"name": "button_easy", "prompt": """### UI Element: EASY Button
**Theme**: "EASY" difficulty button

| File | Dimensions | Description |
|------|-----------|-------------|
| `button_easy.png` | 96×32px | "EASY" difficulty button |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)

**Color palette**: Green button, white "EASY" text""",
        "dims": (96, 32), "frames": 1, "frame_size": (96, 32), "dir": "sprites/ui"},
    {"name": "button_hard", "prompt": """### UI Element: HARD Button
**Theme**: "HARD" difficulty button

| File | Dimensions | Description |
|------|-----------|-------------|
| `button_hard.png` | 96×32px | "HARD" difficulty button |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)

**Color palette**: Red button, white "HARD" text""",
        "dims": (96, 32), "frames": 1, "frame_size": (96, 32), "dir": "sprites/ui"},
    {"name": "frame_character_select_rumi", "prompt": """### UI Element: Rumi Character Select Frame
**Theme**: Purple frame for Rumi character select

| File | Dimensions | Description |
|------|-----------|-------------|
| `frame_character_select_rumi.png` | 256×256px | Purple frame for Rumi |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)

**Color palette**: Purple frame (#9966ff), gold accents, decorative border""",
        "dims": (256, 256), "frames": 1, "frame_size": (256, 256), "dir": "sprites/ui"},
    {"name": "frame_character_select_mira", "prompt": """### UI Element: Mira Character Select Frame
**Theme**: Pink frame for Mira character select

| File | Dimensions | Description |
|------|-----------|-------------|
| `frame_character_select_mira.png` | 256×256px | Pink frame for Mira |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)

**Color palette**: Hot pink frame (#ff1493), red accents, decorative border""",
        "dims": (256, 256), "frames": 1, "frame_size": (256, 256), "dir": "sprites/ui"},
    {"name": "frame_character_select_zoey", "prompt": """### UI Element: Zoey Character Select Frame
**Theme**: Blue frame for Zoey character select

| File | Dimensions | Description |
|------|-----------|-------------|
| `frame_character_select_zoey.png` | 256×256px | Blue frame for Zoey |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)

**Color palette**: Cyan/blue frame (#00bfff), white accents, decorative border""",
        "dims": (256, 256), "frames": 1, "frame_size": (256, 256), "dir": "sprites/ui"},
    {"name": "combo_meter_bg", "prompt": """### UI Element: Combo Meter Background
**Theme**: Background bar for combo meter

| File | Dimensions | Description |
|------|-----------|-------------|
| `combo_meter_bg.png` | 128×16px | Background bar for combo meter |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)

**Color palette**: Dark gray/black bar, white outline""",
        "dims": (128, 16), "frames": 1, "frame_size": (128, 16), "dir": "sprites/ui"},
    {"name": "combo_meter_fill", "prompt": """### UI Element: Combo Meter Fill
**Theme**: Filled portion of combo meter

| File | Dimensions | Description |
|------|-----------|-------------|
| `combo_meter_fill.png` | 128×16px | Filled portion of combo meter |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)

**Color palette**: Yellow-to-orange gradient fill""",
        "dims": (128, 16), "frames": 1, "frame_size": (128, 16), "dir": "sprites/ui"},
    {"name": "logo", "prompt": """### UI Element: Game Logo
**Theme**: "HUNTRIX" game logo styled like cover photo

| File | Dimensions | Description |
|------|-----------|-------------|
| `logo.png` | 512×128px | "HUNTRIX" game logo (styled like cover photo) |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)

**Color palette**: Bold letters, purple/pink/blue gradient, K-pop style, energetic""",
        "dims": (512, 128), "frames": 1, "frame_size": (512, 128), "dir": "sprites/ui"},
    {"name": "insert_coin", "prompt": """### UI Element: Insert Coin
**Theme**: "INSERT COIN" text with blink animation

| File | Dimensions | Description |
|------|-----------|-------------|
| `insert_coin.png` | 512×32px | "INSERT COIN" text, 2 frames (blink animation) |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (2 frames side-by-side: frame 1 = visible, frame 2 = invisible/blank)

**Color palette**: Yellow text, arcade style font""",
        "dims": (512, 32), "frames": 2, "frame_size": (256, 32), "dir": "sprites/ui"},
    {"name": "press_start", "prompt": """### UI Element: Press Start
**Theme**: "2P PRESS START" text with blink animation

| File | Dimensions | Description |
|------|-----------|-------------|
| `press_start.png` | 512×32px | "2P PRESS START" text, 2 frames (blink animation) |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (2 frames side-by-side: frame 1 = visible, frame 2 = invisible/blank)

**Color palette**: Cyan text, arcade style font""",
        "dims": (512, 32), "frames": 2, "frame_size": (256, 32), "dir": "sprites/ui"},
    {"name": "demon_icon_rumi", "prompt": """### UI Element: Rumi Demon Icon
**Theme**: Purple demon companion icon for Rumi

| File | Dimensions | Description |
|------|-----------|-------------|
| `demon_icon_rumi.png` | 64×64px | Purple demon companion icon |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)

**Color palette**: Purple (#9966ff), cute chibi demon, friendly""",
        "dims": (64, 64), "frames": 1, "frame_size": (64, 64), "dir": "sprites/ui"},
    {"name": "demon_icon_mira", "prompt": """### UI Element: Mira Demon Icon
**Theme**: Pink demon companion icon for Mira

| File | Dimensions | Description |
|------|-----------|-------------|
| `demon_icon_mira.png` | 64×64px | Pink demon companion icon |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)

**Color palette**: Hot pink (#ff1493), cute chibi demon, friendly""",
        "dims": (64, 64), "frames": 1, "frame_size": (64, 64), "dir": "sprites/ui"},
    {"name": "demon_icon_zoey", "prompt": """### UI Element: Zoey Demon Icon
**Theme**: Blue demon companion icon for Zoey

| File | Dimensions | Description |
|------|-----------|-------------|
| `demon_icon_zoey.png` | 64×64px | Blue demon companion icon |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)

**Color palette**: Cyan/blue (#00bfff), cute chibi demon, friendly""",
        "dims": (64, 64), "frames": 1, "frame_size": (64, 64), "dir": "sprites/ui"},
    {"name": "stat_heart", "prompt": """### UI Element: Stat Heart
**Theme**: Heart icon for stat display

| File | Dimensions | Description |
|------|-----------|-------------|
| `stat_heart.png` | 16×16px | Heart icon for stat display |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)

**Color palette**: Pink/red heart, black outline""",
        "dims": (16, 16), "frames": 1, "frame_size": (16, 16), "dir": "sprites/ui"}
]

def find_resume_point():
    """Find the first incomplete sprite"""
    for i, sprite in enumerate(SPRITE_QUEUE):
        sprite_path = f"{sprite['dir']}/{sprite['name']}.png"
        if not os.path.exists(sprite_path):
            return i
    return len(SPRITE_QUEUE)

class FrameCountDialog:
    """Dialog to let user confirm/correct frame count"""
    def __init__(self, parent, detected, expected):
        self.result = None
        dialog = tk.Toplevel(parent)
        dialog.title("Frame Count Mismatch")
        dialog.geometry("450x250")
        dialog.transient(parent)
        dialog.grab_set()

        tk.Label(dialog, text="Frame Count Mismatch Detected!", font=("Arial", 12, "bold"), fg="red").pack(pady=10)
        tk.Label(dialog, text=f"Expected: {expected} frames", font=("Arial", 10)).pack()
        tk.Label(dialog, text=f"Detected: {detected} frames", font=("Arial", 10)).pack(pady=5)
        tk.Label(dialog, text="How many frames did ChatGPT generate?", font=("Arial", 10)).pack(pady=10)

        frame_frame = tk.Frame(dialog)
        frame_frame.pack(pady=10)

        self.frame_var = tk.IntVar(value=detected)
        for i in range(max(1, expected - 2), expected + 3):
            tk.Radiobutton(frame_frame, text=f"{i}", variable=self.frame_var, value=i).pack(side=tk.LEFT, padx=5)

        btn_frame = tk.Frame(dialog)
        btn_frame.pack(pady=10)
        tk.Button(btn_frame, text="Confirm", command=lambda: self.confirm(dialog), bg="#4CAF50", fg="white", padx=10, pady=5).pack(side=tk.LEFT, padx=5)
        tk.Button(btn_frame, text="Cancel", command=lambda: self.cancel(dialog), bg="#f44336", fg="white", padx=10, pady=5).pack(side=tk.LEFT, padx=5)

        dialog.wait_window()

    def confirm(self, dialog):
        self.result = self.frame_var.get()
        dialog.destroy()

    def cancel(self, dialog):
        self.result = None
        dialog.destroy()

class SpriteGeneratorGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("HUNTRIX Sprite Generator - Phase 3")
        self.root.geometry("800x700")

        resume_index = find_resume_point()
        self.current_index = resume_index
        self.total = len(SPRITE_QUEUE)
        self.completed_count = resume_index

        tk.Label(root, text="HUNTRIX Phase 3 Sprite Generator", font=("Arial", 16, "bold")).pack(pady=10)
        tk.Label(root, text="Bosses & UI Elements", font=("Arial", 12), fg="blue").pack()

        self.progress_label = tk.Label(root, text="", font=("Arial", 14, "bold"))
        self.progress_label.pack(pady=5)

        self.sprite_label = tk.Label(root, text="", font=("Arial", 12))
        self.sprite_label.pack(pady=5)

        if self.completed_count > 0:
            completed_frame = tk.LabelFrame(root, text=f"Already Completed ({self.completed_count})", font=("Arial", 10))
            completed_frame.pack(pady=5, padx=10, fill=tk.X)
            completed_names = [SPRITE_QUEUE[i]['name'] for i in range(self.completed_count)]
            tk.Label(completed_frame, text=", ".join(completed_names), font=("Arial", 9), fg="green", wraplength=700).pack(pady=5, padx=5)

        tk.Label(root, text="Prompt (auto-copied to clipboard):", font=("Arial", 10)).pack(pady=5)
        self.prompt_text = scrolledtext.ScrolledText(root, height=12, width=90, wrap=tk.WORD)
        self.prompt_text.pack(pady=5, padx=10)

        instructions_text = "1. Prompt is already copied - paste into ChatGPT\n2. Attach Cover Photo.png for style reference\n3. Download generated image\n4. Click button below to select it"
        tk.Label(root, text=instructions_text, font=("Arial", 9), fg="blue", justify=tk.LEFT).pack(pady=5)

        self.select_btn = tk.Button(root, text="Select Downloaded Image", command=self.select_and_process,
                                    font=("Arial", 12, "bold"), bg="#4CAF50", fg="white", padx=20, pady=10)
        self.select_btn.pack(pady=10)

        self.skip_btn = tk.Button(root, text="Skip This Sprite", command=self.skip_sprite,
                                  font=("Arial", 10), bg="#FF9800", fg="white", padx=10, pady=5)
        self.skip_btn.pack(pady=5)

        self.status_label = tk.Label(root, text="", font=("Arial", 10), fg="green", wraplength=750)
        self.status_label.pack(pady=5)

        self.load_current_prompt()

    def skip_sprite(self):
        if messagebox.askyesno("Skip Sprite", f"Skip {SPRITE_QUEUE[self.current_index]['name']}?"):
            self.current_index += 1
            self.load_current_prompt()

    def load_current_prompt(self):
        if self.current_index >= self.total:
            self.show_completion()
            return

        sprite = SPRITE_QUEUE[self.current_index]
        remaining = self.total - self.current_index

        self.progress_label.config(text=f"Progress: {self.completed_count} complete, {remaining} remaining")
        self.sprite_label.config(text=f"Current: {sprite['name']}.png ({sprite['frames']} frames @ {sprite['frame_size'][0]}x{sprite['frame_size'][1]}px)")

        self.prompt_text.delete(1.0, tk.END)
        self.prompt_text.insert(1.0, sprite['prompt'])

        try:
            pyperclip.copy(sprite['prompt'])
            self.status_label.config(text="✓ Prompt copied to clipboard! Paste into ChatGPT with Cover Photo.", fg="green")
        except:
            self.status_label.config(text="Prompt ready (install pyperclip for auto-copy)", fg="orange")

    def select_and_process(self):
        file_path = filedialog.askopenfilename(
            title="Select ChatGPT Generated Image",
            filetypes=[("PNG files", "*.png"), ("All files", "*.*")]
        )
        if not file_path:
            return

        self.status_label.config(text="Processing...", fg="blue")
        self.root.update()

        try:
            sprite = SPRITE_QUEUE[self.current_index]
            output_path = self.process_sprite_with_validation(file_path, sprite)
            self.status_label.config(text=f"SUCCESS! Saved to {output_path}", fg="green")
            self.completed_count += 1
            self.current_index += 1
            self.root.after(1500, self.load_current_prompt)
        except Exception as e:
            messagebox.showerror("Error", f"Processing failed:\n{str(e)}")
            self.status_label.config(text="Error! Try again or skip.", fg="red")

    def process_sprite_with_validation(self, input_path, spec):
        img = Image.open(input_path).convert('RGBA')
        data = np.array(img)
        r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]
        is_light_bg = (r > 200) & (g > 200) & (b > 200)
        is_dark_bg = (r > 50) & (r < 100) & (g > 50) & (g < 100) & (b > 50) & (b < 100)
        data[is_light_bg | is_dark_bg, 3] = 0
        img = Image.fromarray(data, 'RGBA')

        bbox = img.getbbox()
        if bbox:
            img = img.crop(bbox)

        width, height = img.size
        expected_frames = spec['frames']
        expected_frame_width = spec['frame_size'][0]

        if expected_frames > 1:
            detected_frames = round(width / expected_frame_width)
            actual_frames = expected_frames

            if abs(detected_frames - expected_frames) > 0:
                dialog = FrameCountDialog(self.root, detected_frames, expected_frames)
                if dialog.result is None:
                    raise Exception("Cancelled")
                actual_frames = dialog.result

            frame_width = width // actual_frames
            frames = [img.crop((i * frame_width, 0, (i + 1) * frame_width, height)) for i in range(actual_frames)]

            if actual_frames < expected_frames:
                while len(frames) < expected_frames:
                    frames.append(frames[-1].copy())
            elif actual_frames > expected_frames:
                frames = frames[:expected_frames]
        else:
            frames = [img]

        target_frame_size = spec['frame_size']
        resized_frames = [frame.resize(target_frame_size, Image.Resampling.NEAREST) for frame in frames]

        final_width, final_height = spec['dims']
        final = Image.new('RGBA', (final_width, final_height), (0, 0, 0, 0))
        for i, frame in enumerate(resized_frames):
            final.paste(frame, (i * target_frame_size[0], 0))

        output_dir = spec['dir']
        os.makedirs(output_dir, exist_ok=True)
        output_path = f"{output_dir}/{spec['name']}.png"
        final.save(output_path, 'PNG')
        return output_path

    def show_completion(self):
        self.prompt_text.delete(1.0, tk.END)
        self.prompt_text.insert(1.0, "🎉 ALL PHASE 3 SPRITES COMPLETE! 🎉\n\nBosses and UI elements generated successfully!")
        self.sprite_label.config(text="COMPLETE!")
        self.select_btn.config(state=tk.DISABLED)
        self.skip_btn.config(state=tk.DISABLED)
        self.status_label.config(text="Phase 3 done! All sprites complete!", fg="green")
        messagebox.showinfo("Complete!", "All Phase 3 sprites generated!")

if __name__ == "__main__":
    root = tk.Tk()
    app = SpriteGeneratorGUI(root)
    root.mainloop()
