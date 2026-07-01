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
    # Single Rumi idle pose - MATCHING COVER PHOTO STYLE
    prompt = """FULL BODY character sprite art from head to toe including feet and weapon.
STYLE: Cute anime K-pop idol aesthetic exactly like retro arcade pixel art games (Street Fighter, Final Fight character select screens).
Character: Young woman named Rumi, demon hunter.
MUST SHOW: Complete figure from top of head down to bottom of boots, PLUS her large sword weapon.
HAIR: Bright purple (#9966ff) styled in two high buns with long braids, gold hoop earrings.
FACE: Cute anime style with large expressive eyes, K-pop idol look, confident smile.
BODY: Golden yellow cropped bomber jacket (very bright), white crop top showing midriff, black shorts with prominent gold belt buckle.
LEGS AND FEET: Visible legs, black platform combat boots with gold accents and laces.
WEAPON: Large glowing purple/magenta energy sword held in one hand - the sword blade should be as tall as her torso, very prominent.
POSE: Standing ready stance, weight on both feet, holding sword, facing 3/4 toward viewer.
FRAMING: Full body shot zoomed out enough to see head, torso, legs, feet, boots AND the full sword blade.
PROPORTIONS: Slightly stylized/chibi cute proportions like arcade game characters - not realistic, anime cute.
COLORS: Vibrant saturated colors - purple hair, bright yellow jacket, glowing purple sword.
Background: Plain white or light gray for easy removal."""

    # Generate at 1:1 for a single character
    output = generate_image(prompt, "rumi_v2.png", width=1, height=1)
    if output:
        print(f"\nSUCCESS: Generated Rumi v2")
        print(f"File: {output}")
