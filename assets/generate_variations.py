import boto3
import json
import base64
import time

def generate_variation(prompt, output_path, model_id, seed=None):
    """Generate using specified model and seed"""
    bedrock = boto3.client(
        service_name='bedrock-runtime',
        region_name='us-west-2'
    )

    request_body = {
        "prompt": prompt,
        "aspect_ratio": "1:1",
        "output_format": "png"
    }

    if seed is not None:
        request_body["seed"] = seed

    try:
        response = bedrock.invoke_model(
            modelId=model_id,
            body=json.dumps(request_body),
            contentType='application/json',
            accept='application/json'
        )

        response_body = json.loads(response['body'].read())

        if 'images' in response_body and len(response_body['images']) > 0:
            image_data = base64.b64decode(response_body['images'][0])
            with open(output_path, 'wb') as f:
                f.write(image_data)
            print(f"SUCCESS: {output_path} (model: {model_id}, seed: {seed})")
            return output_path
        elif 'image' in response_body:
            image_data = base64.b64decode(response_body['image'])
            with open(output_path, 'wb') as f:
                f.write(image_data)
            print(f"SUCCESS: {output_path} (model: {model_id}, seed: {seed})")
            return output_path
        else:
            print(f"FAILED: {output_path} - no image in response")
            return None
    except Exception as e:
        print(f"ERROR: {output_path} - {str(e)}")
        return None

if __name__ == "__main__":
    # Try two different prompt approaches

    # Approach 1: Very explicit with negative constraints
    prompt_v1 = """Chibi arcade beat-em-up character sprite, full body.
Style: River City Girls, Streets of Rage - cute super-deformed proportions, big head.
Girl named Rumi: purple hair in ONE thick braid, YELLOW jacket (bright gold color), holding glowing purple SWORD weapon.
Face forward, standing pose. Bright colors, cute arcade game aesthetic.
IMPORTANT: Jacket must be YELLOW/GOLD colored, NOT purple, NOT pink, NOT any other color - YELLOW.
IMPORTANT: She is holding a SWORD in her hands - a blade weapon with purple glow.
Full body visible from head to boots."""

    # Approach 2: Reference specific games and be more structured
    prompt_v2 = """Full body character sprite art.
REFERENCE STYLE: Final Fight character select screen + River City Girls style.
PROPORTIONS: Chibi/super-deformed - head is 1/3 of height, short legs, cute compact.
CHARACTER: Rumi the demon hunter.
HAIR: Vibrant purple, styled as ONE massive thick braid down her back from high ponytail. Gold earrings.
FACE: Cute large anime eyes, friendly smile, round chibi face.
TOP: Bright golden yellow cropped bomber jacket worn over white crop top.
BOTTOM: Black shorts, gold belt buckle visible.
LEGS/FEET: Black platform boots with gold/yellow details.
WEAPON IN HAND: Large purple glowing energy sword held ready - blade visible and prominent.
POSE: Front 3/4 view facing camera, standing ready stance.
COLORS: Purple hair, YELLOW jacket, purple sword glow, gold accents.
Background: neutral."""

    # Approach 3: Simpler, more direct
    prompt_v3 = """Cute chibi arcade game character, full body sprite.
Girl with purple braid hair holding glowing purple sword.
Wearing bright yellow jacket, black shorts, platform boots.
Super-deformed proportions like beat-em-up game character.
Standing front-facing pose. Bold vibrant colors."""

    models = [
        'stability.stable-image-ultra-v1:1',
        'stability.stable-image-core-v1:1'
    ]

    seeds = [42, 123, 999, 1337, 7777]

    print("Generating variations...\n")

    # Test Core model with different prompts and seeds
    for i, prompt in enumerate([prompt_v1, prompt_v2, prompt_v3], 1):
        print(f"\n--- PROMPT APPROACH {i} ---")

        # Try Core model with multiple seeds
        for seed in seeds[:3]:  # 3 seeds per prompt
            output = f"rumi_test_p{i}_core_s{seed}.png"
            generate_variation(prompt, output, 'stability.stable-image-core-v1:1', seed)
            time.sleep(0.5)  # Small delay between requests

    print("\n=== GENERATION COMPLETE ===")
    print("Generated 9 variations to review")
