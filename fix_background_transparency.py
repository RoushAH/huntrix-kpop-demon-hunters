"""
Fix background PNG transparency by converting RGB to RGBA.

This script converts RGB PNG files to RGBA format by making specific
colors transparent (like pure white or specified background colors).
"""

from PIL import Image
import os
import sys

def convert_to_rgba_with_transparency(input_path, output_path, bg_color=(255, 255, 255), tolerance=10):
    """
    Convert RGB PNG to RGBA with transparency.

    Args:
        input_path: Path to input RGB PNG
        output_path: Path to save RGBA PNG
        bg_color: RGB color to make transparent (default: white)
        tolerance: Color tolerance for transparency (0-255)
    """
    # Open the image
    img = Image.open(input_path)

    # Convert to RGBA if not already
    if img.mode != 'RGBA':
        img = img.convert('RGBA')

    # Get pixel data
    pixels = img.load()
    width, height = img.size

    # Make background color transparent
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]

            # Check if pixel matches background color within tolerance
            if (abs(r - bg_color[0]) <= tolerance and
                abs(g - bg_color[1]) <= tolerance and
                abs(b - bg_color[2]) <= tolerance):
                # Make transparent
                pixels[x, y] = (r, g, b, 0)

    # Save as RGBA PNG
    img.save(output_path, 'PNG')
    print(f"Converted: {input_path} -> {output_path}")
    print(f"  Mode: {Image.open(output_path).mode}")
    print(f"  Size: {img.size}")

def main():
    # Background layers that need fixing (layer 2 and 3 for all levels)
    backgrounds = [
        ('assets/backgrounds/level1/bg_level1_layer2.png', (255, 255, 255)),  # white bg
        ('assets/backgrounds/level1/bg_level1_layer3.png', (255, 255, 255)),  # white bg
        ('assets/backgrounds/level2/bg_level2_layer2.png', (255, 255, 255)),
        ('assets/backgrounds/level2/bg_level2_layer3.png', (255, 255, 255)),
        ('assets/backgrounds/level3/bg_level3_layer2.png', (255, 255, 255)),
        ('assets/backgrounds/level3/bg_level3_layer3.png', (255, 255, 255)),
        ('assets/backgrounds/boss/bg_boss_layer2.png', (255, 255, 255)),
        ('assets/backgrounds/boss/bg_boss_layer3.png', (255, 255, 255)),
    ]

    for bg_path, bg_color in backgrounds:
        if os.path.exists(bg_path):
            # Create backup
            backup_path = bg_path.replace('.png', '_rgb_backup.png')
            if not os.path.exists(backup_path):
                img_backup = Image.open(bg_path)
                img_backup.save(backup_path)
                print(f"Backed up: {bg_path} -> {backup_path}")

            # Convert to RGBA with transparency
            convert_to_rgba_with_transparency(bg_path, bg_path, bg_color, tolerance=10)
        else:
            print(f"Warning: {bg_path} not found")

    print("\n✅ All background layers converted to RGBA with transparency!")
    print("Original RGB files backed up with '_rgb_backup.png' suffix")

if __name__ == '__main__':
    main()
