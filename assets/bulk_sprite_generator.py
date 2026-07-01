import openai
import base64
import requests
import time
from pathlib import Path

openai.api_key = "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"

# Phase 1 MVP sprites from ART_ASSETS.md
PHASE_1_SPRITES = [
    {
        "character": "rumi",
        "name": "rumi_walk",
        "output_dir": "sprites/characters/rumi",
        "dimensions": "192×48px",
        "frames": "6 frames @ 32×48px",
        "description": "Walking animation, sword at side",
        "spec": """### Character 1: Rumi (Purple Hunter)
**Theme**: Balanced warrior, sword wielder, purple/gold color scheme

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `rumi_walk.png` | 192×48px | 6 frames @ 32×48px | Walking animation, sword at side |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (frames side-by-side)

**Color palette**: Purple (#9966ff), gold accents, white/cream for clothing"""
    },
    {
        "character": "rumi",
        "name": "rumi_attack",
        "output_dir": "sprites/characters/rumi",
        "dimensions": "240×48px",
        "frames": "5 frames @ 48×48px",
        "description": "Sword swing arc motion",
        "spec": """### Character 1: Rumi (Purple Hunter)
**Theme**: Balanced warrior, sword wielder, purple/gold color scheme

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `rumi_attack.png` | 240×48px | 5 frames @ 48×48px | Sword swing arc motion |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (frames side-by-side)

**Color palette**: Purple (#9966ff), gold accents, white/cream for clothing"""
    },
    # Add more as needed...
]

def generate_sprite_with_chatgpt(sprite_spec, cover_photo_path="Cover Photo.png"):
    """Generate sprite using ChatGPT with Cover Photo reference"""

    print(f"\nGenerating: {sprite_spec['name']}")
    print(f"Dimensions: {sprite_spec['dimensions']}")
    print(f"Frames: {sprite_spec['frames']}")
    print(f"Description: {sprite_spec['description']}")

    # Encode cover photo
    with open(cover_photo_path, "rb") as f:
        image_data = base64.b64encode(f.read()).decode('utf-8')

    # Create prompt with spec
    prompt = f"""{sprite_spec['spec']}

Generate this exact sprite following the specifications above. Use the reference image to match the character's appearance exactly (purple braid, yellow jacket, etc.)."""

    try:
        response = openai.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/png;base64,{image_data}"
                            }
                        }
                    ]
                }
            ],
            max_tokens=4096
        )

        # Extract image URL from response if ChatGPT generated one
        # (This assumes ChatGPT returns an image - may need adjustment)
        content = response.choices[0].message.content
        print(f"Response: {content[:200]}...")

        return None  # Will need to handle image extraction

    except Exception as e:
        print(f"ERROR: {e}")
        return None

def test_single_sprite():
    """Test with just the next sprite (rumi_walk)"""

    print("="*60)
    print("STEP 2: Test Single Sprite Generation")
    print("="*60)

    sprite_spec = PHASE_1_SPRITES[0]  # rumi_walk

    print(f"\nTest sprite: {sprite_spec['name']}")
    print(f"Will be saved to: {sprite_spec['output_dir']}/{sprite_spec['name']}.png")

    print("\n" + "="*60)
    print("READY TO GENERATE")
    print("="*60)
    print(f"\nPrompt that will be sent to ChatGPT:")
    print("-"*60)
    print(sprite_spec['spec'])
    print("-"*60)

    print("\n[!] You'll need to run this via ChatGPT web interface")
    print("    I can't directly call DALL-E image generation")
    print("    But I've prepared the exact prompt and workflow!")

    return sprite_spec

if __name__ == "__main__":
    test_spec = test_single_sprite()

    print("\n" + "="*60)
    print("STEP 2 SETUP COMPLETE")
    print("="*60)
    print(f"\nNext: Generate '{test_spec['name']}' via ChatGPT")
    print("Then we'll process and verify it works!")
