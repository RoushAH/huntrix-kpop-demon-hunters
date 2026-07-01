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
    # Single Rumi idle pose - bold and clear
    prompt = """Single character full body illustration, standing pose facing viewer.
Character: Rumi from HUNTRIX K-pop demon hunter game.
HAIR: Vibrant bright purple (#9966ff) styled in two high side buns with long braids, large golden hoop earrings.
OUTFIT: Bright golden yellow cropped bomber jacket (one sleeve on, one off shoulder), white/light purple sports bra crop top showing midriff,
black shorts with prominent gold belt buckle, tall black platform boots with gold accents and laces.
WEAPON: Large glowing purple energy sword held casually in right hand, blade pointing down.
POSE: Confident idle stance, weight on one leg, slight hip tilt, ready for action.
STYLE: Bold vibrant colors, sharp anime art style, clean lines, NO pixel art yet.
COLORS: Saturated and bright - purple hair must be vivid, jacket must be bright yellow/gold, sword must glow purple.
Background: Pure white or light gray, will be removed later.
Full body visible from head to boots, centered in frame."""

    # Generate at 1:1 for a single character
    output = generate_image(prompt, "rumi_single_pose.png", width=1, height=1)
    if output:
        print(f"\nSUCCESS: Generated Rumi single pose")
        print(f"File: {output}")
