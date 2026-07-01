from PIL import Image
import os

def verify_sprite(sprite_path, expected_dims, expected_frames, frame_size):
    """Verify a sprite matches spec"""
    if not os.path.exists(sprite_path):
        return None, "Missing"

    try:
        img = Image.open(sprite_path)
        actual_dims = img.size

        # Check dimensions
        if actual_dims != expected_dims:
            return False, f"Wrong size: {actual_dims} (expected {expected_dims})"

        # Check frame count (for multi-frame sprites)
        if expected_frames > 1:
            actual_frame_count = actual_dims[0] // frame_size[0]
            if actual_frame_count != expected_frames:
                return False, f"Wrong frame count: {actual_frame_count} (expected {expected_frames})"

        return True, "OK"
    except Exception as e:
        return False, f"Error: {str(e)}"

def verify_all_phase1():
    """Verify all Phase 1 sprites"""

    sprites_to_check = [
        ("sprites/characters/rumi/rumi_idle.png", (128, 48), 4, (32, 48)),
        ("sprites/characters/rumi/rumi_walk.png", (192, 48), 6, (32, 48)),
        ("sprites/characters/rumi/rumi_attack.png", (240, 48), 5, (48, 48)),
        ("sprites/characters/rumi/rumi_hit.png", (96, 48), 3, (32, 48)),
        ("sprites/characters/rumi/rumi_portrait.png", (128, 128), 1, (128, 128)),
        ("sprites/characters/mira/mira_idle.png", (128, 48), 4, (32, 48)),
        ("sprites/characters/mira/mira_walk.png", (192, 48), 6, (32, 48)),
        ("sprites/characters/mira/mira_attack.png", (240, 48), 5, (48, 48)),
        ("sprites/characters/mira/mira_hit.png", (96, 48), 3, (32, 48)),
        ("sprites/characters/mira/mira_portrait.png", (128, 128), 1, (128, 128)),
        ("sprites/characters/zoey/zoey_idle.png", (128, 48), 4, (32, 48)),
        ("sprites/characters/zoey/zoey_walk.png", (192, 48), 6, (32, 48)),
        ("sprites/characters/zoey/zoey_attack.png", (240, 48), 5, (48, 48)),
        ("sprites/characters/zoey/zoey_hit.png", (96, 48), 3, (32, 48)),
        ("sprites/characters/zoey/zoey_portrait.png", (128, 128), 1, (128, 128)),
    ]

    print("="*60)
    print("PHASE 1 SPRITE VERIFICATION")
    print("="*60 + "\n")

    completed = []
    needs_work = []

    for path, dims, frames, frame_size in sprites_to_check:
        status, msg = verify_sprite(path, dims, frames, frame_size)

        if status is None:
            print(f"[ ] {os.path.basename(path)}: {msg}")
            needs_work.append(os.path.basename(path).replace('.png', ''))
        elif status:
            print(f"[OK] {os.path.basename(path)}: {msg}")
            completed.append(os.path.basename(path).replace('.png', ''))
        else:
            print(f"[!!] {os.path.basename(path)}: {msg}")
            needs_work.append(os.path.basename(path).replace('.png', ''))

    print("\n" + "="*60)
    print(f"SUMMARY: {len(completed)} complete, {len(needs_work)} need work")
    print("="*60)

    return completed, needs_work

if __name__ == "__main__":
    completed, needs_work = verify_all_phase1()

    print(f"\nCompleted sprites: {', '.join(completed) if completed else 'None'}")
    print(f"Needs work: {', '.join(needs_work) if needs_work else 'None'}")
