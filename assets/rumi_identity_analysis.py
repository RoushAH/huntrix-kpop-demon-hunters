import openai
import base64
import json
import os

# Load API key from environment variable
openai.api_key = os.environ.get("OPENAI_API_KEY")
if not openai.api_key:
    raise ValueError("OPENAI_API_KEY environment variable not set")

def analyze_rumi_key_traits():
    """Use GPT-4o Vision to identify what makes Rumi MOST recognizable"""

    with open("Cover Photo.png", "rb") as f:
        image_data = base64.b64encode(f.read()).decode('utf-8')

    print("Analyzing Rumi's KEY DISTINCTIVE traits...")

    response = openai.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": """Look at the LEFT character (Rumi with purple hair) in this HUNTRIX game cover.

List her TOP 5 MOST DISTINCTIVE visual traits - the things that make her instantly recognizable as THIS specific character, not just any purple-haired anime girl.

Rank them by importance:
1. Most distinctive/signature feature
2. Second most important
3. Third
4. Fourth
5. Fifth

For each, explain WHY it's distinctive and what common mistakes an AI might make when generating this character."""
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
        max_tokens=800
    )

    analysis = response.choices[0].message.content
    print("\n" + "="*60)
    print("RUMI'S SIGNATURE TRAITS (Ranked)")
    print("="*60)
    print(analysis)
    print("="*60 + "\n")

    return analysis

def check_openai_image_capabilities():
    """Research what image generation/editing OpenAI actually supports"""

    print("\nChecking OpenAI image capabilities...")
    print("-" * 60)

    # Check if image editing is available
    try:
        print("\nAvailable OpenAI image endpoints:")
        print("1. images.generate() - Text to image")
        print("2. images.edit() - Edit image with mask")
        print("3. images.create_variation() - Create variation of existing image")
        print("\nLet me try using create_variation with the Cover Photo...")
        print("This could work if we crop just Rumi from the cover!")
    except Exception as e:
        print(f"Error checking: {e}")

def try_image_variation_approach():
    """Try using OpenAI's image variation feature with Rumi cropped from cover"""

    print("\n" + "="*60)
    print("ATTEMPTING: Image Variation Approach")
    print("="*60)
    print("""
Strategy:
1. Use GPT-4o Vision to identify Rumi's exact bounding box in Cover Photo
2. Crop just Rumi from the cover
3. Use OpenAI's create_variation() to generate a similar pose
4. This preserves her visual identity while changing the pose!

This might work better than text-to-image since we're starting FROM her actual appearance.
""")

    # First, let's identify Rumi's position in the image
    with open("Cover Photo.png", "rb") as f:
        image_data = base64.b64encode(f.read()).decode('utf-8')

    response = openai.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": """In this HUNTRIX cover image, I need to crop out ONLY the left character (Rumi).

Please provide:
1. Approximate pixel coordinates for a bounding box around Rumi (left, top, right, bottom)
2. The image appears to be about 1080 pixels wide - estimate where Rumi starts and ends

Format: left_x, top_y, right_x, bottom_y (in pixels)"""
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
        max_tokens=300
    )

    coords = response.choices[0].message.content
    print("\nRumi's bounding box coordinates:")
    print(coords)

    return coords

if __name__ == "__main__":
    # Step 1: Identify her signature traits
    traits = analyze_rumi_key_traits()

    # Step 2: Check what OpenAI can actually do
    check_openai_image_capabilities()

    # Step 3: Try the variation approach
    coords = try_image_variation_approach()

    print("\n" + "="*60)
    print("NEXT: I'll crop Rumi and try create_variation()")
    print("="*60)
