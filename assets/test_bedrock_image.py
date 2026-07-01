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
    # Single Rumi idle pose - CHIBI ARCADE BEAT-EM-UP STYLE
    prompt = """FULL BODY character sprite in CHIBI SUPER-DEFORMED arcade beat-em-up style.
REFERENCE STYLE: Streets of Rage, Final Fight, River City Girls - CUTE SHORT PROPORTIONS with big head, compact body.
NOT tall anime proportions - CHIBI/SD style! Head should be 1/3 to 1/4 of total height. Cute and compact.

Character: Rumi, young K-pop demon hunter girl.
HAIR: ONE massive long purple braid (bright purple #9966ff) hanging down her back from a high ponytail. Large gold hoop earrings. NO buns, NO two braids - ONE thick braid is her signature!
FACE: Large cute anime eyes, friendly expression, round face, K-pop idol cute.
OUTFIT: Bright YELLOW/GOLD cropped bomber jacket - the jacket must be YELLOW color, not purple, not blue. White crop top underneath, black shorts with large gold belt buckle.
FEET: Black platform combat boots with yellow/gold laces and accents.
WEAPON: She is holding a large SWORD in her hand - glowing purple energy blade sword, very prominent and visible. NOT a whip or tail - a SWORD with a blade!

POSE: Cute idle stance, standing ready, 3/4 front view.
PROPORTIONS: CHIBI - big head, short legs, compact torso, cute arcade beat-em-up style. NOT realistic or tall.
FRAMING: Full body head to toe including boots and sword.
COLORS: BRIGHT vibrant - purple braid, YELLOW jacket (not green!), glowing purple sword, gold accents.
Background: Plain neutral for easy removal."""

    # Generate at 1:1 for a single character
    output = generate_image(prompt, "rumi_v2.png", width=1, height=1)
    if output:
        print(f"\nSUCCESS: Generated Rumi v2")
        print(f"File: {output}")
