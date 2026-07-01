from PIL import Image
import numpy as np

def process_walk_sprite():
    """Process rumi_walk to exact spec: 192x48px, 6 frames @ 32x48px"""

    print("Processing rumi_walk sprite...")
    img = Image.open("ChatGPT Image Jul 1, 2026, 08_32_26 AM.png").convert('RGBA')
    print(f"Input size: {img.size}")

    # Remove background (white/light gray)
    data = np.array(img)
    r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]

    # Make light background transparent
    is_bg = (r > 200) & (g > 200) & (b > 200)
    data[is_bg, 3] = 0

    img = Image.fromarray(data, 'RGBA')

    # Crop to content
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        print(f"Cropped to content: {img.size}")

    # The image has 6 frames - extract them
    width, height = img.size
    frame_width = width // 6
    print(f"Estimated frame width: {frame_width}px")

    frames = []
    for i in range(6):
        left = i * frame_width
        right = (i + 1) * frame_width
        frame = img.crop((left, 0, right, height))
        frames.append(frame)

    # Resize each frame to exactly 32x48
    resized_frames = []
    for i, frame in enumerate(frames):
        resized = frame.resize((32, 48), Image.Resampling.NEAREST)
        resized_frames.append(resized)
        print(f"Frame {i+1} resized to 32x48")

    # Create final 192x48 spritesheet (6 frames @ 32x48)
    final = Image.new('RGBA', (192, 48), (0, 0, 0, 0))

    for i, frame in enumerate(resized_frames):
        final.paste(frame, (i * 32, 0))

    final.save("rumi_walk.png", "PNG")
    print(f"\nSUCCESS: Created rumi_walk.png (192x48)")

    # Create preview
    preview = final.resize((1536, 384), Image.Resampling.NEAREST)
    preview.save("rumi_walk_preview.png", "PNG")
    print(f"Preview: rumi_walk_preview.png")

    return final

if __name__ == "__main__":
    print("="*60)
    print("Processing: rumi_walk.png")
    print("="*60 + "\n")

    sprite = process_walk_sprite()

    print("\n" + "="*60)
    print("SUCCESS: 6 frames @ 32x48px = 192x48px total")
    print("="*60)
