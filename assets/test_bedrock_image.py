import boto3
import json
import base64
from datetime import datetime

def generate_image(prompt, output_path="test_output.png", width=1024, height=1024):
    """Generate an image using Stable Image Ultra on Bedrock"""

    bedrock = boto3.client(
        service_name='bedrock-runtime',
        region_name='us-west-2'
    )

    # Calculate aspect ratio
    aspect_ratio = f"{width}:{height}"

    # Stable Image Ultra request format
    request_body = {
        "prompt": prompt,
        "aspect_ratio": aspect_ratio,
        "output_format": "png"
    }

    response = bedrock.invoke_model(
        modelId='stability.stable-image-ultra-v1:1',
        body=json.dumps(request_body),
        contentType='application/json',
        accept='application/json'
    )

    response_body = json.loads(response['body'].read())

    # Extract and save the image
    print("Response keys:", list(response_body.keys()))

    if 'images' in response_body and len(response_body['images']) > 0:
        image_data = base64.b64decode(response_body['images'][0])
        with open(output_path, 'wb') as f:
            f.write(image_data)
        print(f"SUCCESS: Image saved to {output_path}")
        return output_path
    elif 'image' in response_body:
        # Single image field
        image_data = base64.b64decode(response_body['image'])
        with open(output_path, 'wb') as f:
            f.write(image_data)
        print(f"SUCCESS: Image saved to {output_path}")
        return output_path
    else:
        print("Error: No image in response")
        print(json.dumps(response_body, indent=2))
        return None

if __name__ == "__main__":
    # Rumi idle sprite sheet prompt
    prompt = """8-bit pixel art sprite sheet, 4 frames horizontal layout side by side, no padding between frames.
Character: Rumi from HUNTRIX - young woman with purple braided hair in buns, gold/yellow cropped jacket,
black sports bra showing midriff, black shorts with gold belt, black boots with gold accents, purple sword.
Animation: Idle standing pose, subtle breathing animation, sword held casually at side.
Style: Clean pixel art like 1990s arcade games, no anti-aliasing, vibrant colors (purple #9966ff, gold/yellow).
Background: Completely transparent/removed.
Layout: 4 identical-sized frames arranged horizontally, each frame 32x48 pixels, total 128x48 pixels."""

    # Generate at 21:9 (closest to 128:48 = 2.67:1 ratio) which is wide
    # We'll generate at higher res then downscale to exact pixel dimensions
    output = generate_image(prompt, "rumi_idle_test.png", width=21, height=9)
    if output:
        print(f"\nSUCCESS: Generated Rumi idle sprite sheet")
        print(f"File: {output}")
