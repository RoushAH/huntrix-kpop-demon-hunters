import openai
import base64
import json
from pathlib import Path

# Set API key
openai.api_key = "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"

def analyze_cover_photo():
    """Use GPT-4 Vision to analyze the Cover Photo and extract Rumi details"""

    # Read and encode the Cover Photo
    with open("Cover Photo.png", "rb") as f:
        image_data = base64.b64encode(f.read()).decode('utf-8')

    print("Analyzing Cover Photo with GPT-4 Vision...")

    response = openai.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": """Analyze this HUNTRIX game cover art and describe ONLY the character on the LEFT (Rumi, the purple-haired one) in extreme detail for sprite generation:

1. EXACT hairstyle (how many braids? ponytails? buns? where positioned? how thick?)
2. Hair color and accessories
3. Face style (eye shape, expression, proportions)
4. Outfit details (jacket color, style, accessories, crop top, shorts, boots)
5. Weapon (type, size, color, how held)
6. Overall proportions (chibi ratio, head size vs body)
7. Color palette (specific colors used)
8. Art style characteristics (line weight, shading style, cute factor)

Be extremely specific and detailed - this will be used to generate a matching sprite."""
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/png;base64,{image_data}"
                        }
                    }
                ]
            }
        ],
        max_tokens=1000
    )

    analysis = response.choices[0].message.content
    print("\n=== COVER PHOTO ANALYSIS ===")
    print(analysis)
    print("=" * 50 + "\n")

    return analysis

def generate_rumi_sprite(analysis_text):
    """Generate Rumi sprite using DALL-E 3 based on the analysis"""

    prompt = f"""Create a single character sprite in chibi/super-deformed arcade beat-em-up style.

CHARACTER REFERENCE (from HUNTRIX game):
{analysis_text}

REQUIREMENTS:
- Full body sprite, standing idle pose, facing front/3-4 view
- Chibi proportions like Streets of Rage or Final Fight characters
- Clean, bold anime art style with strong outlines
- Character should match the EXACT details above
- Vibrant, saturated colors
- Include the weapon prominently
- White or neutral background for easy extraction

Style: Cute arcade game character art, bold colors, chibi proportions."""

    print("Generating sprite with DALL-E 3...")
    print(f"\nPrompt:\n{prompt}\n")

    response = openai.images.generate(
        model="dall-e-3",
        prompt=prompt,
        size="1024x1024",
        quality="standard",
        n=1
    )

    image_url = response.data[0].url

    print(f"Generated! URL: {image_url}")

    # Download the image
    import requests
    img_data = requests.get(image_url).content
    output_path = "rumi_openai_v1.png"
    with open(output_path, 'wb') as f:
        f.write(img_data)

    print(f"Saved to: {output_path}")
    return output_path

if __name__ == "__main__":
    # Step 1: Analyze the Cover Photo
    analysis = analyze_cover_photo()

    # Step 2: Generate sprite based on analysis
    output = generate_rumi_sprite(analysis)

    print(f"\n✓ Complete! Check {output}")
