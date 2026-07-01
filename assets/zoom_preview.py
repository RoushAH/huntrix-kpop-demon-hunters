from PIL import Image

def zoom_for_preview(input_path, output_path, scale=8):
    """Create a zoomed version for preview (no smoothing)"""
    img = Image.open(input_path)
    w, h = img.size
    zoomed = img.resize((w * scale, h * scale), Image.Resampling.NEAREST)
    zoomed.save(output_path, 'PNG')
    print(f"Zoomed {w}x{h} to {zoomed.size} at {output_path}")

if __name__ == "__main__":
    zoom_for_preview("rumi_idle_pixelated.png", "rumi_idle_preview.png", scale=8)
