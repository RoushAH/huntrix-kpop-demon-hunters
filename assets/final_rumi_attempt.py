import boto3
import json
import base64

def generate_rumi_final():
    """Final attempt with very explicit ONE BRAID description"""

    bedrock = boto3.client(
        service_name='bedrock-runtime',
        region_name='us-west-2'
    )

    # Ultra-specific about the single braid
    prompt = """Chibi arcade beat-em-up character sprite, full body from head to boots.
Girl named Rumi holding glowing purple sword weapon.
HAIRSTYLE CRITICAL: Hair is pulled up into ONE high ponytail at top of head, then braided into ONE SINGLE THICK PURPLE BRAID that hangs down her back. NOT two braids, NOT pigtails, NOT twintails - ONE BRAID ONLY hanging from a high ponytail.
OUTFIT: Bright golden yellow cropped bomber jacket, black shorts, platform boots with yellow accents. Gold hoop earrings.
WEAPON: Large glowing purple/white energy sword held in one hand - blade is very prominent and visible.
STYLE: Super-deformed chibi proportions like Final Fight or River City Girls - big head, short legs, cute arcade game style.
POSE: Standing front-facing ready stance.
COLORS: Vibrant purple hair in ONE braid, bright yellow jacket, glowing purple sword.
Background: neutral dark."""

    request_body = {
        "prompt": prompt,
        "aspect_ratio": "1:1",
        "output_format": "png",
        "seed": 42  # Use the seed that worked well before
    }

    response = bedrock.invoke_model(
        modelId='stability.stable-image-core-v1:1',
        body=json.dumps(request_body),
        contentType='application/json',
        accept='application/json'
    )

    response_body = json.loads(response['body'].read())

    if 'images' in response_body:
        image_data = base64.b64decode(response_body['images'][0])
        with open('rumi_final_candidate.png', 'wb') as f:
            f.write(image_data)
        print("SUCCESS: rumi_final_candidate.png generated")
        return True
    return False

if __name__ == "__main__":
    generate_rumi_final()
