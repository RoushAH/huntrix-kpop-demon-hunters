from PIL import Image
import numpy as np

def create_4frame_idle():
    """Take the 3-frame ChatGPT sprite and create proper 4-frame idle"""

    print("Loading ChatGPT 3-frame sprite...")
    img = Image.open("ChatGPT Image Jul 1, 2026, 08_20_42 AM.png").convert('RGBA')
    print(f"Original size: {img.size}")

    # Remove background and crop to content
    data = np.array(img)
    r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]

    # Make dark gray/purple background transparent
    is_bg = ((r > 50) & (r < 100) & (g > 50) & (g < 100) & (b > 50) & (b < 100))
    data[is_bg, 3] = 0

    img = Image.fromarray(data, 'RGBA')

    # Crop to content
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        print(f"Cropped to content: {img.size}")

    # The image has 3 characters - we need to split them into frames
    # and create a 4-frame animation
    width, height = img.size

    # Estimate frame width (should be roughly width/3)
    frame_width = width // 3
    print(f"Estimated frame width: {frame_width}px")

    # Extract the 3 frames
    frames = []
    for i in range(3):
        left = i * frame_width
        right = (i + 1) * frame_width
        frame = img.crop((left, 0, right, height))
        frames.append(frame)
        print(f"Frame {i+1}: {frame.size}")

    # For idle animation with 4 frames, typical pattern is:
    # Frame 1: Base pose
    # Frame 2: Slight movement (breathing in)
    # Frame 3: Base pose (duplicate of frame 1)
    # Frame 4: Slight movement opposite direction (breathing out)

    # So we'll use: frame1, frame2, frame1 again, frame3
    idle_frames = [frames[0], frames[1], frames[0], frames[2]]

    # Resize each frame to exactly 32x48
    resized_frames = []
    for i, frame in enumerate(idle_frames):
        resized = frame.resize((32, 48), Image.Resampling.NEAREST)
        resized_frames.append(resized)
        print(f"Resized frame {i+1} to 32x48")

    # Create final 128x48 spritesheet (4 frames @ 32x48)
    final = Image.new('RGBA', (128, 48), (0, 0, 0, 0))

    for i, frame in enumerate(resized_frames):
        final.paste(frame, (i * 32, 0))

    final.save("rumi_idle_4frames.png", "PNG")
    print(f"\nSUCCESS: Created 4-frame idle sprite (128x48)")
    print(f"Saved as: rumi_idle_4frames.png")

    # Create preview
    preview = final.resize((1024, 384), Image.Resampling.NEAREST)
    preview.save("rumi_idle_4frames_preview.png", "PNG")
    print(f"Preview: rumi_idle_4frames_preview.png")

    return final

if __name__ == "__main__":
    print("="*60)
    print("FIXING: Creating proper 4-frame idle animation")
    print("="*60 + "\n")

    sprite = create_4frame_idle()

    print("\n" + "="*60)
    print("FIXED! Now we have 4 frames @ 32x48px = 128x48px total")
    print("="*60)
