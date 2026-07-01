import boto3
import json
import base64

def generate_rumi_precise():
    """Ultra-precise attempt based on direct Cover Photo analysis"""

    bedrock = boto3.client(
        service_name='bedrock-runtime',
        region_name='us-west-2'
    )

    # Commissioning-style prompt - like talking to a pixel artist
    prompt = """Character sprite commission: Full body chibi character for arcade beat-em-up game.

CHARACTER: Rumi, a demon hunter from K-pop themed game HUNTRIX

REFERENCE STYLE: Exact aesthetic of Streets of Rage 2 or Final Fight character select screen - that specific chibi ratio where the head is almost half the body height.

HAIR: ONE single thick purple braid. Not two braids - ONE. The braid starts from a high ponytail at the crown of her head and hangs down her back to waist level. The braid is THICK - nearly as wide as her arm. Vibrant purple color. She has gold hoop earrings.

JACKET: Bright golden yellow cropped bomber jacket with black trim. This is her signature item. The yellow must be bright and vibrant like a school bus or gold bar. The jacket is cropped to show her midriff.

UNDER JACKET: White or light purple crop top.

BOTTOM: Black high-waisted shorts with a large prominent gold belt buckle clearly visible.

BOOTS: Black platform combat boots with yellow/gold laces and gold buckle accents.

WEAPON: She is holding a large purple glowing energy sword in one hand. The sword blade is long (about as long as her torso) and has a bright purple/magenta glow effect.

POSE: Standing idle pose, front-facing 3/4 view, confident stance, sword held casually.

PROPORTIONS CRITICAL: Chibi/super-deformed - her head should be LARGE, about 40% of her total height. Short stubby legs, compact torso. Think "cute" not "tall". Head-to-body ratio like Final Fight or River City Girls.

COLORS: Bright saturated colors - vibrant purple hair, golden yellow jacket, glowing purple sword, black shorts/boots, gold accents.

ART STYLE: Bold anime chibi art with strong black outlines, cute K-pop aesthetic, arcade game character art style.

BACKGROUND: White or neutral gray for easy extraction.

CRITICAL: The jacket must be YELLOW (not purple, not orange, YELLOW). The hair must be ONE braid (not two). The proportions must be chibi (big head, short body)."""

    request_body = {
        "prompt": prompt,
        "aspect_ratio": "1:1",
        "output_format": "png",
        "seed": 42
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
        with open('rumi_ultra_precise.png', 'wb') as f:
            f.write(image_data)
        print("SUCCESS: rumi_ultra_precise.png generated")
        return True
    return False

if __name__ == "__main__":
    generate_rumi_precise()
