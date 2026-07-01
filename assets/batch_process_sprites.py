from PIL import Image
import numpy as np
import os
from pathlib import Path

# Sprite specifications
SPRITE_SPECS = {
    # Rumi
    "rumi_idle": {"dims": (128, 48), "frames": 4, "frame_size": (32, 48), "dir": "sprites/characters/rumi"},
    "rumi_walk": {"dims": (192, 48), "frames": 6, "frame_size": (32, 48), "dir": "sprites/characters/rumi"},
    "rumi_attack": {"dims": (240, 48), "frames": 5, "frame_size": (48, 48), "dir": "sprites/characters/rumi"},
    "rumi_hit": {"dims": (96, 48), "frames": 3, "frame_size": (32, 48), "dir": "sprites/characters/rumi"},
    "rumi_portrait": {"dims": (128, 128), "frames": 1, "frame_size": (128, 128), "dir": "sprites/characters/rumi"},

    # Mira
    "mira_idle": {"dims": (128, 48), "frames": 4, "frame_size": (32, 48), "dir": "sprites/characters/mira"},
    "mira_walk": {"dims": (192, 48), "frames": 6, "frame_size": (32, 48), "dir": "sprites/characters/mira"},
    "mira_attack": {"dims": (240, 48), "frames": 5, "frame_size": (48, 48), "dir": "sprites/characters/mira"},
    "mira_hit": {"dims": (96, 48), "frames": 3, "frame_size": (32, 48), "dir": "sprites/characters/mira"},
    "mira_portrait": {"dims": (128, 128), "frames": 1, "frame_size": (128, 128), "dir": "sprites/characters/mira"},

    # Zoey
    "zoey_idle": {"dims": (128, 48), "frames": 4, "frame_size": (32, 48), "dir": "sprites/characters/zoey"},
    "zoey_walk": {"dims": (192, 48), "frames": 6, "frame_size": (32, 48), "dir": "sprites/characters/zoey"},
    "zoey_attack": {"dims": (240, 48), "frames": 5, "frame_size": (48, 48), "dir": "sprites/characters/zoey"},
    "zoey_hit": {"dims": (96, 48), "frames": 3, "frame_size": (32, 48), "dir": "sprites/characters/zoey"},
    "zoey_portrait": {"dims": (128, 128), "frames": 1, "frame_size": (128, 128), "dir": "sprites/characters/zoey"},
}

def process_sprite(input_path, sprite_name):
    """Process any sprite to its spec"""

    if sprite_name not in SPRITE_SPECS:
        print(f"ERROR: Unknown sprite '{sprite_name}'")
        return None

    spec = SPRITE_SPECS[sprite_name]

    print(f"\nProcessing: {sprite_name}")
    print(f"Target: {spec['dims'][0]}x{spec['dims'][1]}px ({spec['frames']} frames @ {spec['frame_size'][0]}x{spec['frame_size'][1]}px)")

    # Load image
    img = Image.open(input_path).convert('RGBA')
    print(f"Input size: {img.size}")

    # Remove background
    data = np.array(img)
    r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]

    # Handle both light and dark backgrounds
    is_light_bg = (r > 200) & (g > 200) & (b > 200)
    is_dark_bg = (r > 50) & (r < 100) & (g > 50) & (g < 100) & (b > 50) & (b < 100)
    data[is_light_bg | is_dark_bg, 3] = 0

    img = Image.fromarray(data, 'RGBA')

    # Crop to content
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        print(f"Cropped to: {img.size}")

    # Extract frames
    width, height = img.size
    expected_frames = spec['frames']

    if expected_frames > 1:
        frame_width = width // expected_frames
        frames = []
        for i in range(expected_frames):
            left = i * frame_width
            right = (i + 1) * frame_width
            frame = img.crop((left, 0, right, height))
            frames.append(frame)
        print(f"Extracted {len(frames)} frames")
    else:
        frames = [img]

    # Handle frame duplication for 4-frame idles (if only 3 provided)
    if sprite_name.endswith('_idle') and len(frames) == 3 and expected_frames == 4:
        print("Converting 3 frames to 4-frame idle animation")
        frames = [frames[0], frames[1], frames[0], frames[2]]

    # Resize frames
    target_frame_size = spec['frame_size']
    resized_frames = []
    for i, frame in enumerate(frames):
        resized = frame.resize(target_frame_size, Image.Resampling.NEAREST)
        resized_frames.append(resized)

    # Create final spritesheet
    final_width, final_height = spec['dims']
    final = Image.new('RGBA', (final_width, final_height), (0, 0, 0, 0))

    for i, frame in enumerate(resized_frames):
        x_offset = i * target_frame_size[0]
        final.paste(frame, (x_offset, 0))

    # Save
    output_dir = spec['dir']
    os.makedirs(output_dir, exist_ok=True)
    output_path = f"{output_dir}/{sprite_name}.png"
    final.save(output_path, 'PNG')
    print(f"SUCCESS: Saved to {output_path}")

    # Create preview
    preview = final.resize((final_width * 8, final_height * 8), Image.Resampling.NEAREST)
    preview_path = f"{sprite_name}_preview.png"
    preview.save(preview_path, 'PNG')
    print(f"Preview: {preview_path}")

    return output_path

def batch_process(input_dir="."):
    """Process all ChatGPT images in current directory"""

    print("="*60)
    print("BATCH SPRITE PROCESSOR")
    print("="*60)

    # Find all ChatGPT image files
    chatgpt_files = list(Path(input_dir).glob("ChatGPT Image*.png"))

    if not chatgpt_files:
        print("\nNo ChatGPT images found.")
        print("Expected filenames like: 'ChatGPT Image Jul 1, 2026, 08_32_26 AM.png'")
        return

    print(f"\nFound {len(chatgpt_files)} ChatGPT images")
    print("\nFor each file, enter the sprite name (e.g., 'rumi_attack')")
    print("Available sprites:")
    for name in sorted(SPRITE_SPECS.keys()):
        print(f"  - {name}")

    print("\n" + "="*60)

    for i, file_path in enumerate(chatgpt_files, 1):
        print(f"\n[{i}/{len(chatgpt_files)}] File: {file_path.name}")
        sprite_name = input("Sprite name (or 'skip'): ").strip()

        if sprite_name.lower() == 'skip':
            print("Skipped")
            continue

        if sprite_name in SPRITE_SPECS:
            process_sprite(str(file_path), sprite_name)
        else:
            print(f"ERROR: Unknown sprite '{sprite_name}'")

if __name__ == "__main__":
    print("="*60)
    print("Sprite Batch Processor")
    print("="*60)
    print("\nOptions:")
    print("1. Process single sprite (provide filename and sprite name)")
    print("2. Batch process all ChatGPT images in current directory")

    choice = input("\nChoice (1 or 2): ").strip()

    if choice == "1":
        filename = input("ChatGPT image filename: ").strip()
        sprite_name = input("Sprite name (e.g., 'rumi_attack'): ").strip()
        if os.path.exists(filename) and sprite_name in SPRITE_SPECS:
            process_sprite(filename, sprite_name)
        else:
            print("ERROR: File not found or invalid sprite name")
    elif choice == "2":
        batch_process()
    else:
        print("Invalid choice")
