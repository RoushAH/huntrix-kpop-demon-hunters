# HUNTRIX: K-Pop Demon Hunters - Art Asset Specifications

## Overview

This document specifies all graphic and audio assets needed for the game. Assets should be created in **8-bit pixel art style** with vibrant colors inspired by the provided cover photo.

## Directory Structure

```
assets/
├── sprites/
│   ├── characters/
│   │   ├── rumi/
│   │   ├── mira/
│   │   └── zoey/
│   ├── enemies/
│   │   ├── basic/
│   │   ├── fast/
│   │   ├── tank/
│   │   ├── flying/
│   │   ├── saja_boys/
│   │   └── gwima/
│   ├── effects/
│   ├── ui/
│   └── tutorial/
├── backgrounds/
│   ├── level1/
│   ├── level2/
│   ├── level3/
│   └── boss/
├── audio/
│   ├── music/
│   └── sfx/
└── icons/
```

---

## Character Sprites

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (frames side-by-side)

### Character 1: Rumi (Purple Hunter)
**Theme**: Balanced warrior, sword wielder, purple/gold color scheme

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `rumi_idle.png` | 128×48px | 4 frames @ 32×48px | Standing ready, sword held casually |
| `rumi_walk.png` | 192×48px | 6 frames @ 32×48px | Walking animation, sword at side |
| `rumi_attack.png` | 240×48px | 5 frames @ 48×48px | Sword swing arc motion |
| `rumi_hit.png` | 96×48px | 3 frames @ 32×48px | Recoiling from damage |
| `rumi_portrait.png` | 128×128px | 1 frame | Character select portrait, high detail |

**Color palette**: Purple (#9966ff), gold accents, white/cream for clothing

---

### Character 2: Mira (Red/Pink Hunter)
**Theme**: Ranged attacker, throwing knives, red/pink/black color scheme

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `mira_idle.png` | 128×48px | 4 frames @ 32×48px | Ready stance, knife visible |
| `mira_walk.png` | 192×48px | 6 frames @ 32×48px | Walking animation |
| `mira_attack.png` | 240×48px | 5 frames @ 48×48px | Throwing knife wind-up and release |
| `mira_hit.png` | 96×48px | 3 frames @ 32×48px | Taking damage |
| `mira_portrait.png` | 128×128px | 1 frame | Character select portrait |

**Color palette**: Hot pink (#ff1493), red (#cc0033), black, gold accents

---

### Character 3: Zoey (Blue Hunter)
**Theme**: Fast attacker, martial arts, blue/cyan/white color scheme

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `zoey_idle.png` | 128×48px | 4 frames @ 32×48px | Fighting stance, hands ready |
| `zoey_walk.png` | 192×48px | 6 frames @ 32×48px | Quick step animation |
| `zoey_attack.png` | 240×48px | 5 frames @ 48×48px | Punch/kick combo |
| `zoey_hit.png` | 96×48px | 3 frames @ 32×48px | Taking damage |
| `zoey_portrait.png` | 128×128px | 1 frame | Character select portrait |

**Color palette**: Cyan (#00bfff), blue (#0066ff), white pants, gold accents

---

## Enemy Sprites

### Enemy Type 1: Basic Demon
**Theme**: Standard demon, red/orange, humanoid

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `demon_basic_walk.png` | 128×48px | 4 frames @ 32×48px | Walking toward player |
| `demon_basic_attack.png` | 96×48px | 3 frames @ 32×48px | Claw swipe attack |
| `demon_basic_death.png` | 128×48px | 4 frames @ 32×48px | Dissolve/explode animation |

**Color palette**: Red (#cc0000), orange highlights, black shadows

---

### Enemy Type 2: Fast Demon
**Theme**: Smaller, quicker, orange/yellow

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `demon_fast_walk.png` | 144×40px | 6 frames @ 24×40px | Quick scurrying motion |
| `demon_fast_attack.png` | 72×40px | 3 frames @ 24×40px | Quick lunge |
| `demon_fast_death.png` | 72×40px | 3 frames @ 24×40px | Quick poof effect |

**Color palette**: Orange (#ff8800), yellow highlights, black

---

### Enemy Type 3: Tank Demon
**Theme**: Large, slow, heavily armored, dark red

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `demon_tank_walk.png` | 192×64px | 4 frames @ 48×64px | Heavy stomping walk |
| `demon_tank_attack.png` | 192×64px | 4 frames @ 48×64px | Ground pound attack |
| `demon_tank_death.png` | 240×64px | 5 frames @ 48×64px | Slow collapse and explode |

**Color palette**: Dark red (#660000), gray armor, black

---

### Enemy Type 4: Flying Demon
**Theme**: Aerial enemy, yellow/purple wings

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `demon_flying_fly.png` | 128×32px | 4 frames @ 32×32px | Hovering/flapping wings |
| `demon_flying_attack.png` | 128×48px | 4 frames @ 32×48px | Dive attack motion |
| `demon_flying_death.png` | 128×32px | 4 frames @ 32×32px | Spiral fall |

**Color palette**: Yellow body (#ffcc00), purple wings (#9933ff), black

---

## Boss Sprites

### Boss Phase 1: Saja Boys (5 Individual Bosses)
**Theme**: K-pop idol demon hunters (rival boy band), each with unique color scheme

**NOTE**: Create 5 variations with different hair colors and outfit accents

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `saja_boy_1_idle.png` | 384×96px | 6 frames @ 64×96px | Leader - Red/maroon |
| `saja_boy_1_attack.png` | 320×96px | 5 frames @ 64×96px | Special attack move |
| `saja_boy_1_hit.png` | 192×96px | 3 frames @ 64×96px | Taking damage |
| `saja_boy_1_death.png` | 512×96px | 8 frames @ 64×96px | Dramatic defeat |

**Repeat for boys 2-5** with color variations:
- Boy 1: Red/maroon (leader)
- Boy 2: Blue/navy
- Boy 3: Green/teal
- Boy 4: Orange/gold
- Boy 5: Purple/violet

**Total files**: 20 spritesheets (5 boys × 4 animations)

---

### Boss Phase 2: Gwi-Ma (Final Boss)
**Theme**: Massive demon overlord, dark purple/black with glowing eyes, INTIMIDATING

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `gwima_idle.png` | 1152×256px | 6 frames @ 192×256px | Menacing standing pose, arms crossed |
| `gwima_hit.png` | 576×256px | 3 frames @ 192×256px | Flinching from attacks (NOT attacking back) |
| `gwima_death.png` | 2304×256px | 12 frames @ 192×256px | Epic defeat - explosions, light beams, dramatic |

**Color palette**: Dark purple (#330066), black, glowing red eyes, dark energy effects

---

## Visual Effects

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `knife.png` | 32×16px | 2 frames @ 16×16px | Throwing knife, two rotation states |
| `slash_effect.png` | 144×48px | 3 frames @ 48×48px | Sword/melee slash arc |
| `hit_spark.png` | 128×32px | 4 frames @ 32×32px | Impact flash |
| `blood_splatter.png` | 96×32px | 3 frames @ 32×32px | Demon defeat effect |
| `heal_effect.png` | 320×64px | 5 frames @ 64×64px | Sparkles/stars for wingwomen arrival |
| `combo_flash.png` | 192×64px | 3 frames @ 64×64px | Screen flash for combo milestones |

---

## UI Elements

| File | Dimensions | Description |
|------|-----------|-------------|
| `heart_full.png` | 16×16px | Full health heart icon |
| `heart_empty.png` | 16×16px | Empty health heart icon |
| `button_start.png` | 128×32px | "START" button graphic |
| `button_easy.png` | 96×32px | "EASY" difficulty button |
| `button_hard.png` | 96×32px | "HARD" difficulty button |
| `frame_character_select_rumi.png` | 256×256px | Purple frame for Rumi |
| `frame_character_select_mira.png` | 256×256px | Pink frame for Mira |
| `frame_character_select_zoey.png` | 256×256px | Blue frame for Zoey |
| `combo_meter_bg.png` | 128×16px | Background bar for combo meter |
| `combo_meter_fill.png` | 128×16px | Filled portion of combo meter |
| `logo.png` | 512×128px | "HUNTRIX" game logo (styled like cover photo) |
| `insert_coin.png` | 512×32px | "INSERT COIN" text, 2 frames (blink animation) |
| `press_start.png` | 512×32px | "2P PRESS START" text, 2 frames (blink) |
| `demon_icon_rumi.png` | 64×64px | Purple demon companion icon |
| `demon_icon_mira.png` | 64×64px | Pink demon companion icon |
| `demon_icon_zoey.png` | 64×64px | Blue demon companion icon |
| `stat_heart.png` | 16×16px | Heart icon for stat display |

---

## Tutorial Graphics

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `tutorial_arrow_keys.png` | 64×64px | 1 | Diagram of arrow keys |
| `tutorial_space_key.png` | 64×64px | 1 | Space bar key icon |
| `tutorial_drag_gesture.png` | 192×64px | 3 frames @ 64×64px | Hand dragging motion |
| `tutorial_tap_gesture.png` | 192×64px | 3 frames @ 64×64px | Finger tapping motion |
| `tutorial_enemy_icon.png` | 32×32px | 1 | Simplified demon icon |
| `tutorial_attack_icon.png` | 32×32px | 1 | Attack indicator (sword/fist) |

---

## Background Art (Parallax Layers)

All backgrounds should be **800×450px** (16:9 aspect ratio) with **3 parallax layers** each.

### Level 1: Seoul Cityscape Night
**Theme**: Modern Seoul at night, neon signs, skyscrapers, purple sky

| File | Layer | Description |
|------|-------|-------------|
| `bg_level1_layer1.png` | Far | Distant buildings, moon, purple sky |
| `bg_level1_layer2.png` | Mid | Mid-distance buildings with neon signs |
| `bg_level1_layer3.png` | Near | Street level, sidewalk, close buildings |

**Color palette**: Purple sky, pink/blue neon, dark buildings

---

### Level 2: Neon District
**Theme**: Dense urban neon district, more vibrant and energetic

| File | Layer | Description |
|------|-------|-------------|
| `bg_level2_layer1.png` | Far | Distant neon skyline, stars |
| `bg_level2_layer2.png` | Mid | Bright neon signs, billboards |
| `bg_level2_layer3.png` | Near | Street with shop fronts, neon reflections |

**Color palette**: Hot pink, cyan, yellow neon, dark blue sky

---

### Level 3: Demonic Realm
**Theme**: Twisted nightmare version of Seoul, purple/red sky, warped buildings

| File | Layer | Description |
|------|-------|-------------|
| `bg_level3_layer1.png` | Far | Purple sky, blood moon, dark clouds |
| `bg_level3_layer2.png` | Mid | Twisted demonic architecture |
| `bg_level3_layer3.png` | Near | Cracked ground, demon portals |

**Color palette**: Dark purple, blood red, black, sickly green

---

### Boss Arena
**Theme**: Concert/idol stage for final showdown

| File | Layer | Description |
|------|-------|-------------|
| `bg_boss_layer1.png` | Far | Stage back wall with "SAJA" logo |
| `bg_boss_layer2.png` | Mid | Stage lighting rigs, spotlights |
| `bg_boss_layer3.png` | Near | Stage floor with light effects |

**Color palette**: Dark stage, dramatic spotlights, gold/red accents

---

## PWA App Icons

| File | Dimensions | Format | Description |
|------|-----------|---------|-------------|
| `icon-192.png` | 192×192px | PNG | App icon for Android/Chrome |
| `icon-512.png` | 512×512px | PNG | High-res app icon |
| `favicon.ico` | 32×32px | ICO | Browser tab icon |

**Design**: Should feature the HUNTRIX logo or one of the main characters

---

## Audio Assets

### Music (MIDI Format)
**Style**: 8-bit chiptune with K-pop energy

| File | Duration | Loop | Description |
|------|----------|------|-------------|
| `title.mid` | ~2 min | Yes | Upbeat, catchy title screen theme |
| `level1.mid` | ~3 min | Yes | High-energy K-pop battle theme |
| `level2.mid` | ~3 min | Yes | Faster tempo, more intense |
| `level3.mid` | ~3 min | Yes | Dark, dramatic, demon realm vibe |
| `boss.mid` | ~4 min | Yes | Epic finale, idol battle theme |
| `victory.mid` | ~15 sec | No | Victory jingle (triumphant) |
| `gameover.mid` | ~30 sec | No | Game over theme (somber but not sad) |

**Technical specs**:
- Format: Standard MIDI (.mid)
- Tempo: 120-140 BPM (fast-paced)
- Instruments: Chiptune sounds (square wave, triangle wave, noise)

---

### Sound Effects (MP3 Format)
**Style**: 8-bit retro game sounds

| File | Duration | Description |
|------|----------|-------------|
| `attack_sword.mp3` | ~0.2s | Sword whoosh/slash |
| `attack_knife.mp3` | ~0.2s | Knife throw whoosh |
| `attack_punch.mp3` | ~0.2s | Punch/kick impact |
| `hit_player.mp3` | ~0.3s | Player damage grunt |
| `hit_enemy.mp3` | ~0.2s | Enemy hit sound |
| `enemy_death.mp3` | ~0.5s | Enemy defeat explosion |
| `spawn.mp3` | ~0.3s | Enemy spawn effect |
| `wingwomen_arrive.mp3` | ~1.0s | Triumphant arrival fanfare |
| `wingwomen_leave.mp3` | ~1.0s | Whoosh dash-away |
| `combo_ding.mp3` | ~0.3s | Combo milestone chime |
| `ui_select.mp3` | ~0.2s | Menu cursor move |
| `ui_confirm.mp3` | ~0.3s | Menu selection confirm |
| `boss_roar.mp3` | ~2.0s | Boss appearance roar |
| `boss_special.mp3` | ~1.0s | Boss special attack sound |

**Technical specs**:
- Format: MP3, 128kbps, mono
- Volume: Normalized to -3dB peak
- Style: Classic 8-bit game SFX

---

## Asset Summary

**Total sprite files**: ~95
**Total background files**: 12
**Total UI/icon files**: 21
**Total audio files**: 21 (7 music + 14 SFX)

**Grand total**: ~149 files

---

## Delivery Notes

1. **File naming**: Use exact filenames as specified (lowercase, underscores)
2. **Transparency**: All sprite PNGs should have transparent backgrounds
3. **Frame layout**: Horizontal strips (left to right)
4. **Pixel perfect**: No anti-aliasing or smoothing
5. **Color consistency**: Match the vibrant style of the cover photo
6. **Spritesheet format**: All frames equal size, evenly spaced, no padding

## Reference Image

See `Cover Photo.png` for style inspiration (characters Rumi, Mira, Zoey already shown)

---

## Priority Order for Art Department

### Phase 1 (MVP - Needed First)
1. Character idle animations (Rumi, Mira, Zoey)
2. Character attack animations
3. Basic demon sprites (walk, attack, death)
4. UI hearts and basic buttons
5. Level 1 background (simplified, can be single layer initially)

### Phase 2 (Core Gameplay)
6. Character walk and hit animations
7. Fast demon and Tank demon sprites
8. Projectile and effect sprites
9. Tutorial graphics
10. Character portraits

### Phase 3 (Full Game)
11. Flying demon sprites
12. Saja Boys boss sprites (all 5)
13. Gwi-Ma final boss sprites
14. All 3 level backgrounds (full parallax)
15. Boss arena background
16. All UI polish elements
17. PWA icons

### Phase 4 (Audio - Can be sourced/created separately)
18. MIDI music tracks
19. Sound effects

---

**Questions?** Contact the development team for clarifications on sprite specifications or technical requirements.
