from PIL import Image
import numpy as np

def extract_rumi_sprite():
    """Extract Rumi directly from the Cover Photo pixel art"""

    print("Extracting Rumi sprite from Cover Photo...")
    print("The Cover Photo IS pixel art - we can use it directly!\n")

    img = Image.open("Cover Photo.png").convert('RGBA')
    data = np.array(img)

    # Rumi's position (from GPT-4o Vision analysis)
    left, top, right, bottom = 120, 180, 320, 700

    rumi_raw = img.crop((left, top, right, bottom))
    print(f"Raw Rumi crop: {rumi_raw.size}")

    # Remove background
    rumi_data = np.array(rumi_raw)
    r, g, b, a = rumi_data[:,:,0], rumi_data[:,:,1], rumi_data[:,:,2], rumi_data[:,:,3]

    # Background is dark blue/purple
    is_bg = (r < 100) & (g < 100) & (b > 120)
    rumi_data[is_bg, 3] = 0

    rumi_clean = Image.fromarray(rumi_data, 'RGBA')

    # Crop to actual bounds
    bbox = rumi_clean.getbbox()
    if bbox:
        rumi_clean = rumi_clean.crop(bbox)

    rumi_clean.save("rumi_extracted.png", "PNG")
    print(f"Extracted clean Rumi: {rumi_clean.size}")
    print(f"Saved as: rumi_extracted.png")

    # Now let's resize to 32x48 for the idle sprite frame
    rumi_sprite = rumi_clean.resize((32, 48), Image.Resampling.NEAREST)
    rumi_sprite.save("rumi_sprite_32x48.png", "PNG")
    print(f"\nResized to sprite dimensions: 32x48")
    print(f"Saved as: rumi_sprite_32x48.png")

    # Create zoomed preview
    preview = rumi_sprite.resize((256, 384), Image.Resampling.NEAREST)
    preview.save("rumi_sprite_preview.png", "PNG")
    print(f"Zoomed preview (8x): rumi_sprite_preview.png")

    return rumi_sprite

if __name__ == "__main__":
    print("="*60)
    print("DIRECT EXTRACTION APPROACH")
    print("The Cover Photo already IS perfect pixel art!")
    print("="*60 + "\n")

    sprite = extract_rumi_sprite()

    print("\n" + "="*60)
    print("SUCCESS!")
    print("We have Rumi as a pixel art sprite directly from the cover!")
    print("="*60)
