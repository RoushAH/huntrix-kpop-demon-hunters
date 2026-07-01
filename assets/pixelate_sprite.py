from PIL import Image
import numpy as np

def pixelate_sprite(input_path, output_path, target_width, target_height, num_colors=64):
    """
    Convert a high-res image to pixel art style

    Args:
        input_path: Source image path
        output_path: Output pixel art path
        target_width: Final pixel width
        target_height: Final pixel height
        num_colors: Number of colors in palette (lower = more pixelated look)
    """

    # Load image
    img = Image.open(input_path).convert('RGBA')
    print(f"Original size: {img.size}")

    # Step 1: Remove background (convert light blue to transparent)
    # The AI generated with a light blue/cyan background
    data = np.array(img)

    # Define background color threshold (light blue/cyan)
    # Pixels close to this color become transparent
    bg_threshold = 200  # Brightness threshold for background
    r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]

    # Find pixels that are light and bluish (background)
    is_bg = (r > 150) & (g > 180) & (b > 200)
    data[is_bg, 3] = 0  # Make transparent

    img = Image.fromarray(data, 'RGBA')

    # Step 2: Downscale to target size using nearest neighbor (no smoothing)
    img_small = img.resize((target_width, target_height), Image.Resampling.NEAREST)
    print(f"Downscaled to: {img_small.size}")

    # Step 3: Reduce colors (posterize effect)
    # Convert to RGB for color quantization, keeping alpha separate
    alpha = img_small.split()[3]
    rgb = img_small.convert('RGB')

    # Quantize to limited palette
    rgb_quantized = rgb.quantize(colors=num_colors, method=Image.Quantize.MEDIANCUT)
    rgb_quantized = rgb_quantized.convert('RGB')

    # Restore alpha channel
    rgb_quantized.putalpha(alpha)

    # Step 4: Optional - make it more "chunky" by slight upscale then downscale
    # This creates cleaner pixel blocks
    scale_factor = 4
    img_chunky = rgb_quantized.resize(
        (target_width * scale_factor, target_height * scale_factor),
        Image.Resampling.NEAREST
    )
    img_final = img_chunky.resize(
        (target_width, target_height),
        Image.Resampling.NEAREST
    )

    # Save
    img_final.save(output_path, 'PNG')
    print(f"SUCCESS: Saved pixel art to {output_path}")
    print(f"Final size: {img_final.size}")

    return output_path

if __name__ == "__main__":
    pixelate_sprite(
        "rumi_idle_test.png",
        "rumi_idle_pixelated.png",
        target_width=128,
        target_height=48,
        num_colors=32  # Fairly limited palette for retro look
    )
