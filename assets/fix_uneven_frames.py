from PIL import Image
import numpy as np

def find_frame_boundaries(img_array, min_gap=5):
    """
    Find frame boundaries by detecting vertical gaps (columns with all transparent pixels)
    """
    height, width = img_array.shape[:2]
    alpha = img_array[:, :, 3]

    # Find columns that are completely transparent
    transparent_cols = []
    for x in range(width):
        if np.all(alpha[:, x] == 0):
            transparent_cols.append(x)

    # Group consecutive transparent columns into gaps
    gaps = []
    if transparent_cols:
        gap_start = transparent_cols[0]
        for i in range(1, len(transparent_cols)):
            if transparent_cols[i] != transparent_cols[i-1] + 1:
                # Gap ended
                if transparent_cols[i-1] - gap_start >= min_gap:
                    gaps.append((gap_start, transparent_cols[i-1]))
                gap_start = transparent_cols[i]
        # Last gap
        if transparent_cols[-1] - gap_start >= min_gap:
            gaps.append((gap_start, transparent_cols[-1]))

    return gaps

def extract_frames_smart(img, expected_frames):
    """
    Extract frames by detecting content boundaries
    """
    data = np.array(img)

    # Try to find gaps between frames
    gaps = find_frame_boundaries(data, min_gap=2)

    if len(gaps) >= expected_frames - 1:
        # We found gaps! Use them to split frames
        frames = []
        x_start = 0

        for gap_start, gap_end in gaps[:expected_frames-1]:
            # Extract frame from x_start to gap_start
            frame = img.crop((x_start, 0, gap_start, img.height))
            frames.append(frame)
            x_start = gap_end + 1

        # Last frame
        frame = img.crop((x_start, 0, img.width, img.height))
        frames.append(frame)

        return frames
    else:
        # No clear gaps, fall back to equal division
        print(f"Warning: Only found {len(gaps)} gaps, expected {expected_frames-1}. Using equal division.")
        frame_width = img.width // expected_frames
        frames = []
        for i in range(expected_frames):
            frame = img.crop((i * frame_width, 0, (i + 1) * frame_width, img.height))
            frames.append(frame)
        return frames

def fix_uneven_sprite(input_path, output_path, expected_frames, target_frame_width):
    """
    Fix uneven frame spacing by extracting and re-spacing frames evenly
    """
    img = Image.open(input_path).convert('RGBA')

    print(f"Input dimensions: {img.size}")

    # Extract frames smartly
    frames = extract_frames_smart(img, expected_frames)

    print(f"Extracted {len(frames)} frames")

    # Crop each frame to content
    cropped_frames = []
    for i, frame in enumerate(frames):
        bbox = frame.getbbox()
        if bbox:
            cropped = frame.crop(bbox)
            print(f"Frame {i+1}: {cropped.size}")
            cropped_frames.append(cropped)
        else:
            print(f"Frame {i+1}: EMPTY")
            cropped_frames.append(frame)

    # Resize all frames to target size
    resized_frames = []
    for frame in cropped_frames:
        resized = frame.resize((target_frame_width, img.height), Image.Resampling.NEAREST)
        resized_frames.append(resized)

    # Create final evenly-spaced spritesheet
    final_width = target_frame_width * expected_frames
    final = Image.new('RGBA', (final_width, img.height), (0, 0, 0, 0))

    for i, frame in enumerate(resized_frames):
        final.paste(frame, (i * target_frame_width, 0))

    final.save(output_path, 'PNG')
    print(f"\nSaved to: {output_path}")
    print(f"Final dimensions: {final.size}")

if __name__ == "__main__":
    input_file = "sprites/enemies/saja_boys/saja_boy_2_attack.png"
    output_file = "sprites/enemies/saja_boys/saja_boy_2_attack_fixed.png"

    fix_uneven_sprite(input_file, output_file, expected_frames=5, target_frame_width=64)
