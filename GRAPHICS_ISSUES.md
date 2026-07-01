# HUNTRIX Graphics Issues - Critical Fix List

## Issue 1: Background PNG Files Are RGB Instead of RGBA

**Problem**: All layer 2 and layer 3 background PNGs were exported as RGB format without alpha channels.

**Files affected** (all need regeneration):
- `assets/backgrounds/level1/bg_level1_layer2.png` ❌ RGB (needs RGBA)
- `assets/backgrounds/level1/bg_level1_layer3.png` ❌ RGB (needs RGBA)
- `assets/backgrounds/level2/bg_level2_layer2.png` ❌ RGB (needs RGBA)
- `assets/backgrounds/level2/bg_level2_layer3.png` ❌ RGB (needs RGBA)
- `assets/backgrounds/level3/bg_level3_layer2.png` ❌ RGB (needs RGBA)
- `assets/backgrounds/level3/bg_level3_layer3.png` ❌ RGB (needs RGBA)
- `assets/backgrounds/boss/bg_boss_layer2.png` ❌ RGB (needs RGBA)
- `assets/backgrounds/boss/bg_boss_layer3.png` ❌ RGB (needs RGBA)

**What needs to happen**:
When regenerating these files, you MUST:
1. Export as **PNG with Alpha Channel** (RGBA mode)
2. The transparent areas (between buildings, sky areas) must have **alpha = 0**
3. NOT just RGB with white/gray pixels that look transparent in editors

**How to verify**:
Run this command to check format:
```bash
file assets/backgrounds/level1/bg_level1_layer2.png
```

Should say: `PNG image data, 800 x 450, 8-bit/color RGBA, non-interlaced`
NOT: `PNG image data, 800 x 450, 8-bit/color RGB, non-interlaced`

---

## Issue 2: UI Sprites Not Being Rendered

**Problem**: UI sprites (logo, buttons) are loaded but never displayed in the UI.

**Files loaded but NOT used**:
- ✅ Loaded: `assets/sprites/ui/logo.png` → ❌ NOT displayed on Title/Loading screen
- ✅ Loaded: `assets/sprites/ui/button_easy.png` → ❌ NOT displayed on Difficulty Select
- ✅ Loaded: `assets/sprites/ui/button_hard.png` → ❌ NOT displayed on Difficulty Select
- ✅ Loaded: `assets/sprites/ui/button_start.png` → ❌ NOT displayed anywhere
- ✅ Loaded: `assets/sprites/ui/heart_full.png` → ❌ NOT used (using text '♥')
- ✅ Loaded: `assets/sprites/ui/heart_empty.png` → ❌ NOT used (using text '♥')
- ✅ Loaded: `assets/sprites/ui/insert_coin.png` → ❌ NOT displayed on Title
- ✅ Loaded: `assets/sprites/ui/press_start.png` → ❌ NOT displayed on Title

**What needs to happen**:
Code needs to be updated to actually RENDER these loaded images:

### Files to update:
1. `js/states/TitleState.js` - Add logo, insert_coin, press_start sprites
2. `js/states/LoadingState.js` - Add logo sprite  
3. `js/states/DifficultySelectState.js` - Add button_easy and button_hard sprites
4. `js/core/Renderer.js` - Use heart_full/heart_empty sprites instead of text

---

## Current Status

**Backgrounds**: Currently only rendering layer 1 (far background) because layers 2 and 3 are RGB and block everything.

**UI**: Using text/shapes instead of the beautiful sprite artwork that was created.

**Next Steps**:
1. Regenerate background layers 2 and 3 as RGBA PNGs with proper transparency
2. Update UI rendering code to use the loaded sprite images instead of text
