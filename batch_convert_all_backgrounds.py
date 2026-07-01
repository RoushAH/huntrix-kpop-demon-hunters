"""
Batch convert all identified background images from Downloads
"""

from PIL import Image
import os
import glob

downloads = os.path.expanduser('~/Downloads')

def make_rgba_transparent(img_path, output_path, target_size=(800, 450)):
    """Convert RGB to RGBA with white/light gray as transparent, and resize"""
    img = Image.open(img_path)

    # Convert to RGBA if needed
    if img.mode == 'RGB':
        img = img.convert('RGBA')
        pixels = img.load()
        width, height = img.size

        # Make very light pixels transparent (checkerboard background)
        for y in range(height):
            for x in range(width):
                r, g, b, a = pixels[x, y]
                # Very light gray/white = transparent
                if r > 240 and g > 240 and b > 240:
                    pixels[x, y] = (r, g, b, 0)

    # Resize to target
    img = img.resize(target_size, Image.Resampling.LANCZOS)
    img.save(output_path, 'PNG')
    print(f"OK: {os.path.basename(output_path)}")
    return True

def copy_and_resize(img_path, output_path, target_size=(800, 450)):
    """Just resize without transparency conversion (for opaque backgrounds)"""
    img = Image.open(img_path)

    # Keep as is, just resize
    img = img.resize(target_size, Image.Resampling.LANCZOS)
    img.save(output_path, 'PNG')
    print(f"OK: {os.path.basename(output_path)}")
    return True

# Mapping of source files to destinations
# Based on visual analysis:
# - Level 1: Purple Seoul night
# - Level 2: Vibrant neon district
# - Level 3: Demonic realm
# - Boss: Stage arena

conversions = [
    # Level 1: Seoul Cityscape Night
    {
        'source': 'ChatGPT Image Jul 1, 2026, 02_28_53 PM.png',
        'dest': 'assets/backgrounds/level1/bg_level1_layer1.png',
        'transparent': False,  # Far background, opaque sky
        'desc': 'Level 1 Layer 1 - Purple Seoul night sky with moon'
    },
    {
        'source': 'ChatGPT Image Jul 1, 2026, 02_38_23 PM.png',
        'dest': 'assets/backgrounds/level1/bg_level1_layer2.png',
        'transparent': False,  # Dense cityscape, might be opaque
        'desc': 'Level 1 Layer 2 - Neon Seoul mid-distance'
    },

    # Level 2: Neon District (need to find more images)
    # Skipping for now, will use what we have

    # Level 3: Demonic Realm
    {
        'source': 'ChatGPT Image Jul 1, 2026, 02_49_52 PM.png',
        'dest': 'assets/backgrounds/level3/bg_level3_layer3.png',
        'transparent': True,  # Foreground with transparency
        'desc': 'Level 3 Layer 3 - Demon realm foreground'
    },

    # Boss Arena
    {
        'source': 'ChatGPT Image Jul 1, 2026, 02_52_45 PM.png',
        'dest': 'assets/backgrounds/boss/bg_boss_layer1.png',
        'transparent': False,  # Back wall, opaque
        'desc': 'Boss Layer 1 - SAJA stage backdrop'
    },
    {
        'source': 'ChatGPT Image Jul 1, 2026, 02_57_34 PM.png',
        'dest': 'assets/backgrounds/boss/bg_boss_layer2.png',
        'transparent': True,  # Stage lights with transparency
        'desc': 'Boss Layer 2 - Stage lighting rigs'
    },
    {
        'source': 'ChatGPT Image Jul 1, 2026, 02_59_09 PM.png',
        'dest': 'assets/backgrounds/boss/bg_boss_layer3.png',
        'transparent': True,  # Stage floor with transparency
        'desc': 'Boss Layer 3 - Stage floor with speakers'
    },
]

print("="*70)
print("BATCH BACKGROUND CONVERSION")
print("="*70)
print()

success_count = 0
for conv in conversions:
    source_path = os.path.join(downloads, conv['source'])

    if not os.path.exists(source_path):
        print(f"ERROR: Source not found: {conv['source']}")
        continue

    print(f"Converting: {conv['desc']}")
    print(f"  From: {conv['source']}")

    try:
        if conv['transparent']:
            make_rgba_transparent(source_path, conv['dest'])
        else:
            copy_and_resize(source_path, conv['dest'])

        success_count += 1
    except Exception as e:
        print(f"ERROR: {e}")

    print()

print("="*70)
print(f"Conversion complete! {success_count}/{len(conversions)} successful")
print("="*70)
print()

# Verify the results
print("Verifying file formats...")
for conv in conversions:
    if os.path.exists(conv['dest']):
        img = Image.open(conv['dest'])
        print(f"  {os.path.basename(conv['dest'])}: {img.size}, {img.mode}")
