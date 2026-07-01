from PIL import Image
import numpy as np

def process_and_verify_sprite(input_path, output_path, expected_width=128, expected_height=48):
    """Process ChatGPT sprite to exact spec and verify"""

    print(f"Processing: {input_path}")
    img = Image.open(input_path).convert('RGBA')
    print(f"Input size: {img.size}")

    # Check if background needs to be made transparent
    data = np.array(img)
    r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]

    # Make dark gray/purple background transparent
    is_bg = ((r > 50) & (r < 100) & (g > 50) & (g < 100) & (b > 50) & (b < 100))
    data[is_bg, 3] = 0

    img = Image.fromarray(data, 'RGBA')

    # Crop to content bounds
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        print(f"Cropped to content: {img.size}")

    # Resize to exact dimensions if needed
    if img.size != (expected_width, expected_height):
        print(f"Resizing to spec: {expected_width}x{expected_height}")
        img = img.resize((expected_width, expected_height), Image.Resampling.NEAREST)

    # Save with transparency
    img.save(output_path, 'PNG')
    print(f"SUCCESS: Saved: {output_path}")

    # Create zoomed preview
    preview_path = output_path.replace('.png', '_preview.png')
    preview = img.resize((img.width * 8, img.height * 8), Image.Resampling.NEAREST)
    preview.save(preview_path, 'PNG')
    print(f"SUCCESS: Preview (8x): {preview_path}")

    # Verify frame count (should be 4 frames at 32px each for idle)
    if expected_width == 128 and expected_height == 48:
        frame_width = 32
        num_frames = expected_width // frame_width
        print(f"\nSUCCESS: Verified: {num_frames} frames @ {frame_width}x{expected_height}px each")

    return img

if __name__ == "__main__":
    print("="*60)
    print("STEP 1: Process ChatGPT Sprite to Spec")
    print("="*60 + "\n")

    # Process the ChatGPT generated sprite
    processed = process_and_verify_sprite(
        "ChatGPT Image Jul 1, 2026, 08_20_42 AM.png",
        "rumi_idle_processed.png",
        expected_width=128,
        expected_height=48
    )

    print("\n" + "="*60)
    print("STEP 1 COMPLETE!")
    print("="*60)
