from PIL import Image
import numpy as np

def remove_bg_and_crop(input_path, output_path):
    """Remove background and crop to character bounds"""
    img = Image.open(input_path).convert('RGBA')
    data = np.array(img)

    # Remove purple/lavender background
    r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]

    # Purple/lavender background threshold
    is_bg = (r > 140) & (g > 120) & (b > 160) & (np.abs(r.astype(int) - b.astype(int)) < 80)
    data[is_bg, 3] = 0

    # Also remove white floor area
    is_white = (r > 230) & (g > 230) & (b > 230)
    data[is_white, 3] = 0

    img = Image.fromarray(data, 'RGBA')

    # Find bounding box of non-transparent pixels
    bbox = img.getbbox()
    if bbox:
        img_cropped = img.crop(bbox)
        img_cropped.save(output_path, 'PNG')
        print(f"Cropped to {img_cropped.size}, saved to {output_path}")
        return img_cropped
    else:
        print("No non-transparent pixels found!")
        return None

def pixelate_single_frame(input_path, output_path, width=32, height=48, num_colors=32):
    """Convert to pixel art at exact dimensions"""
    img = Image.open(input_path).convert('RGBA')

    # Resize to target pixel dimensions (nearest neighbor)
    img_small = img.resize((width, height), Image.Resampling.NEAREST)

    # Reduce colors
    alpha = img_small.split()[3]
    rgb = img_small.convert('RGB')
    rgb_quantized = rgb.quantize(colors=num_colors, method=Image.Quantize.MEDIANCUT)
    rgb_quantized = rgb_quantized.convert('RGB')
    rgb_quantized.putalpha(alpha)

    # Save
    rgb_quantized.save(output_path, 'PNG')
    print(f"Pixelated to {rgb_quantized.size}, saved to {output_path}")
    return rgb_quantized

def create_4frame_spritesheet(frame_path, output_path):
    """
    Create a 4-frame idle animation from one base frame
    Frame 1: Base pose
    Frame 2: Slight down (breathing in)
    Frame 3: Base pose (duplicate of frame 1)
    Frame 4: Slight up (breathing out)
    """
    base = Image.open(frame_path).convert('RGBA')
    w, h = base.size  # Should be 32x48

    # Create spritesheet canvas (128x48 = 4 frames side by side)
    spritesheet = Image.new('RGBA', (w * 4, h), (0, 0, 0, 0))

    # Frame 1: Base pose
    spritesheet.paste(base, (0, 0))

    # Frame 2: Shift down by 1 pixel (breathing in, body lowers slightly)
    frame2 = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    frame2.paste(base, (0, 1))  # Paste 1px down
    spritesheet.paste(frame2, (w, 0))

    # Frame 3: Base pose again (duplicate of frame 1)
    spritesheet.paste(base, (w * 2, 0))

    # Frame 4: Shift up by 1 pixel (breathing out, body rises)
    frame4 = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    # Crop 1px from bottom and paste at top
    base_cropped = base.crop((0, 1, w, h))
    frame4.paste(base_cropped, (0, 0))
    spritesheet.paste(frame4, (w * 3, 0))

    spritesheet.save(output_path, 'PNG')
    print(f"Created 4-frame spritesheet: {output_path}")
    print(f"Dimensions: {spritesheet.size}")
    return spritesheet

if __name__ == "__main__":
    # Step 1: Remove background and crop
    cropped = remove_bg_and_crop("rumi_single_pose.png", "rumi_cropped.png")

    if cropped:
        # Step 2: Pixelate to 32x48px
        pixelate_single_frame("rumi_cropped.png", "rumi_frame1.png", width=32, height=48, num_colors=32)

        # Step 3: Create 4-frame breathing animation
        create_4frame_spritesheet("rumi_frame1.png", "rumi_idle.png")

        print("\nSUCCESS: rumi_idle.png created (128x48px, 4 frames)")
