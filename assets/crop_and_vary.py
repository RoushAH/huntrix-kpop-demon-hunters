import openai
from PIL import Image
import requests
import os

# Load API key from environment variable
openai.api_key = os.environ.get("OPENAI_API_KEY")
if not openai.api_key:
    raise ValueError("OPENAI_API_KEY environment variable not set")

def crop_rumi_from_cover():
    """Crop just Rumi from the Cover Photo"""

    print("Cropping Rumi from Cover Photo...")

    img = Image.open("Cover Photo.png")
    print(f"Original image size: {img.size}")

    # Coordinates from GPT-4o Vision
    # left_x: 120, top_y: 180, right_x: 320, bottom_y: 700
    left, top, right, bottom = 120, 180, 320, 700

    rumi_crop = img.crop((left, top, right, bottom))
    print(f"Cropped Rumi size: {rumi_crop.size}")

    # OpenAI requires square images or specific sizes for variations
    # Let's make it square by padding
    width, height = rumi_crop.size
    max_dim = max(width, height)

    # Create square canvas
    square = Image.new('RGBA', (max_dim, max_dim), (255, 255, 255, 0))

    # Paste Rumi centered
    paste_x = (max_dim - width) // 2
    paste_y = (max_dim - height) // 2
    square.paste(rumi_crop, (paste_x, paste_y))

    # OpenAI requires specific sizes - let's use 1024x1024
    final = square.resize((1024, 1024), Image.Resampling.LANCZOS)

    # Save as PNG (OpenAI requires PNG for variations)
    final.save("rumi_cropped_square.png", "PNG")
    print(f"Saved square crop: rumi_cropped_square.png (1024x1024)")

    return "rumi_cropped_square.png"

def create_variation_from_rumi(crop_path):
    """Use OpenAI's create_variation to generate similar characters"""

    print("\nGenerating variations from Rumi crop...")
    print("This preserves her visual identity while creating new poses!")

    try:
        with open(crop_path, 'rb') as image_file:
            response = openai.images.create_variation(
                image=image_file,
                n=1,
                size="1024x1024"
            )

        image_url = response.data[0].url
        print(f"\nVariation created! URL: {image_url}")

        # Download the result
        img_data = requests.get(image_url).content
        output_path = "rumi_variation_v1.png"
        with open(output_path, 'wb') as f:
            f.write(img_data)

        print(f"SUCCESS: Saved to {output_path}")
        return output_path

    except Exception as e:
        print(f"ERROR: {e}")
        print("\nTrying alternative: image editing with mask...")
        return try_image_edit_approach(crop_path)

def try_image_edit_approach(crop_path):
    """Try OpenAI's image edit feature as fallback"""

    print("\nAttempting image EDIT approach...")
    print("This lets us keep Rumi but change her pose/angle")

    try:
        # Create a simple mask (transparent areas will be regenerated)
        img = Image.open(crop_path).convert('RGBA')

        # Create mask - we'll mask out just the background
        mask = Image.new('RGBA', img.size, (255, 255, 255, 255))

        mask.save("rumi_mask.png", "PNG")

        with open(crop_path, 'rb') as image_file, open("rumi_mask.png", 'rb') as mask_file:
            response = openai.images.edit(
                image=image_file,
                mask=mask_file,
                prompt="Chibi arcade game character sprite, front-facing idle pose, same character but standing straight facing forward",
                n=1,
                size="1024x1024"
            )

        image_url = response.data[0].url
        print(f"Edit created! URL: {image_url}")

        img_data = requests.get(image_url).content
        output_path = "rumi_edited_v1.png"
        with open(output_path, 'wb') as f:
            f.write(img_data)

        print(f"SUCCESS: Saved to {output_path}")
        return output_path

    except Exception as e:
        print(f"Image edit also failed: {e}")
        return None

if __name__ == "__main__":
    print("="*60)
    print("IMAGE CONDITIONING APPROACH")
    print("Using Rumi from Cover Photo AS THE BASE")
    print("="*60 + "\n")

    # Step 1: Crop Rumi
    crop_path = crop_rumi_from_cover()

    # Step 2: Try variation
    result = create_variation_from_rumi(crop_path)

    if result:
        print(f"\n{'='*60}")
        print(f"SUCCESS! Check: {result}")
        print(f"{'='*60}")
    else:
        print("\nImage conditioning approaches not available on this account")
