import tkinter as tk
from tkinter import filedialog, scrolledtext, messagebox
import pyperclip
from PIL import Image
import numpy as np
import os

# Import verification
from verify_and_fix_existing import verify_sprite

# Phase 2 Queue: Fast/Tank demons, Effects, Tutorial
SPRITE_QUEUE = [
    # Fast Demon (3 sprites)
    {"name": "demon_fast_walk", "prompt": """### Enemy Type 2: Fast Demon
**Theme**: Smaller, quicker, orange/yellow

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `demon_fast_walk.png` | 144×40px | 6 frames @ 24×40px | Quick scurrying motion |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (frames side-by-side)

**Color palette**: Orange (#ff8800), yellow highlights, black""",
        "dims": (144, 40), "frames": 6, "frame_size": (24, 40), "dir": "sprites/enemies/fast"},
    {"name": "demon_fast_attack", "prompt": """### Enemy Type 2: Fast Demon
**Theme**: Smaller, quicker, orange/yellow

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `demon_fast_attack.png` | 72×40px | 3 frames @ 24×40px | Quick lunge |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (frames side-by-side)

**Color palette**: Orange (#ff8800), yellow highlights, black""",
        "dims": (72, 40), "frames": 3, "frame_size": (24, 40), "dir": "sprites/enemies/fast"},
    {"name": "demon_fast_death", "prompt": """### Enemy Type 2: Fast Demon
**Theme**: Smaller, quicker, orange/yellow

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `demon_fast_death.png` | 72×40px | 3 frames @ 24×40px | Quick poof effect |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (frames side-by-side)

**Color palette**: Orange (#ff8800), yellow highlights, black""",
        "dims": (72, 40), "frames": 3, "frame_size": (24, 40), "dir": "sprites/enemies/fast"},

    # Tank Demon (3 sprites)
    {"name": "demon_tank_walk", "prompt": """### Enemy Type 3: Tank Demon
**Theme**: Large, slow, heavily armored, dark red

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `demon_tank_walk.png` | 192×64px | 4 frames @ 48×64px | Heavy stomping walk |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (frames side-by-side)

**Color palette**: Dark red (#660000), gray armor, black""",
        "dims": (192, 64), "frames": 4, "frame_size": (48, 64), "dir": "sprites/enemies/tank"},
    {"name": "demon_tank_attack", "prompt": """### Enemy Type 3: Tank Demon
**Theme**: Large, slow, heavily armored, dark red

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `demon_tank_attack.png` | 192×64px | 4 frames @ 48×64px | Ground pound attack |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (frames side-by-side)

**Color palette**: Dark red (#660000), gray armor, black""",
        "dims": (192, 64), "frames": 4, "frame_size": (48, 64), "dir": "sprites/enemies/tank"},
    {"name": "demon_tank_death", "prompt": """### Enemy Type 3: Tank Demon
**Theme**: Large, slow, heavily armored, dark red

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `demon_tank_death.png` | 240×64px | 5 frames @ 48×64px | Slow collapse and explode |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (frames side-by-side)

**Color palette**: Dark red (#660000), gray armor, black""",
        "dims": (240, 64), "frames": 5, "frame_size": (48, 64), "dir": "sprites/enemies/tank"},

    # Visual Effects (6 sprites)
    {"name": "knife", "prompt": """### Visual Effects: Throwing Knife
**Theme**: Zoey's throwing knife projectile

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `knife.png` | 32×16px | 2 frames @ 16×16px | Throwing knife, two rotation states |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (frames side-by-side)

**Color palette**: Silver/gray blade, blue/cyan handle (matches Zoey)""",
        "dims": (32, 16), "frames": 2, "frame_size": (16, 16), "dir": "sprites/effects"},
    {"name": "slash_effect", "prompt": """### Visual Effects: Slash Effect
**Theme**: Sword/melee slash arc for Rumi and Mira

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `slash_effect.png` | 144×48px | 3 frames @ 48×48px | Sword/melee slash arc |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (frames side-by-side)

**Color palette**: White/light blue arc, slight glow""",
        "dims": (144, 48), "frames": 3, "frame_size": (48, 48), "dir": "sprites/effects"},
    {"name": "hit_spark", "prompt": """### Visual Effects: Hit Spark
**Theme**: Impact flash when attacks connect

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `hit_spark.png` | 128×32px | 4 frames @ 32×32px | Impact flash |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (frames side-by-side)

**Color palette**: White, yellow, orange burst""",
        "dims": (128, 32), "frames": 4, "frame_size": (32, 32), "dir": "sprites/effects"},
    {"name": "blood_splatter", "prompt": """### Visual Effects: Blood Splatter
**Theme**: Demon defeat effect

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `blood_splatter.png` | 96×32px | 3 frames @ 32×32px | Demon defeat effect |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (frames side-by-side)

**Color palette**: Dark purple/black (demon blood), red highlights""",
        "dims": (96, 32), "frames": 3, "frame_size": (32, 32), "dir": "sprites/effects"},
    {"name": "heal_effect", "prompt": """### Visual Effects: Heal Effect
**Theme**: Sparkles/stars for wingwomen arrival

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `heal_effect.png` | 320×64px | 5 frames @ 64×64px | Sparkles/stars for wingwomen arrival |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (frames side-by-side)

**Color palette**: Pink, cyan, yellow sparkles, white glow""",
        "dims": (320, 64), "frames": 5, "frame_size": (64, 64), "dir": "sprites/effects"},
    {"name": "combo_flash", "prompt": """### Visual Effects: Combo Flash
**Theme**: Screen flash for combo milestones

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `combo_flash.png` | 192×64px | 3 frames @ 64×64px | Screen flash for combo milestones |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (frames side-by-side)

**Color palette**: White flash, gold/yellow rays""",
        "dims": (192, 64), "frames": 3, "frame_size": (64, 64), "dir": "sprites/effects"},

    # Tutorial Graphics (6 sprites)
    {"name": "tutorial_arrow_keys", "prompt": """### Tutorial Graphics: Arrow Keys
**Theme**: Diagram of arrow keys for movement tutorial

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `tutorial_arrow_keys.png` | 64×64px | 1 | Diagram of arrow keys |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)

**Color palette**: White/gray keys, black outlines, arrows""",
        "dims": (64, 64), "frames": 1, "frame_size": (64, 64), "dir": "sprites/tutorial"},
    {"name": "tutorial_space_key", "prompt": """### Tutorial Graphics: Space Key
**Theme**: Space bar key icon for attack tutorial

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `tutorial_space_key.png` | 64×64px | 1 | Space bar key icon |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)

**Color palette**: White/gray key, black outline, "SPACE" text""",
        "dims": (64, 64), "frames": 1, "frame_size": (64, 64), "dir": "sprites/tutorial"},
    {"name": "tutorial_drag_gesture", "prompt": """### Tutorial Graphics: Drag Gesture
**Theme**: Hand dragging motion for mobile tutorial

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `tutorial_drag_gesture.png` | 192×64px | 3 frames @ 64×64px | Hand dragging motion |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (frames side-by-side)

**Color palette**: Skin tone hand, motion lines, arrow""",
        "dims": (192, 64), "frames": 3, "frame_size": (64, 64), "dir": "sprites/tutorial"},
    {"name": "tutorial_tap_gesture", "prompt": """### Tutorial Graphics: Tap Gesture
**Theme**: Finger tapping motion for mobile tutorial

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `tutorial_tap_gesture.png` | 192×64px | 3 frames @ 64×64px | Finger tapping motion |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (frames side-by-side)

**Color palette**: Skin tone finger, impact burst, motion lines""",
        "dims": (192, 64), "frames": 3, "frame_size": (64, 64), "dir": "sprites/tutorial"},
    {"name": "tutorial_enemy_icon", "prompt": """### Tutorial Graphics: Enemy Icon
**Theme**: Simplified demon icon for tutorial

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `tutorial_enemy_icon.png` | 32×32px | 1 | Simplified demon icon |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)

**Color palette**: Red demon, black outline, simple shapes""",
        "dims": (32, 32), "frames": 1, "frame_size": (32, 32), "dir": "sprites/tutorial"},
    {"name": "tutorial_attack_icon", "prompt": """### Tutorial Graphics: Attack Icon
**Theme**: Attack indicator (sword/fist)

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `tutorial_attack_icon.png` | 32×32px | 1 | Attack indicator (sword/fist) |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)

**Color palette**: Silver sword or white fist, black outline""",
        "dims": (32, 32), "frames": 1, "frame_size": (32, 32), "dir": "sprites/tutorial"}
]

def find_resume_point():
    """Find the first incomplete sprite"""
    for i, sprite in enumerate(SPRITE_QUEUE):
        sprite_path = f"{sprite['dir']}/{sprite['name']}.png"
        # Simplified check - just file existence
        if not os.path.exists(sprite_path):
            return i
    return len(SPRITE_QUEUE)  # All complete

class FrameCountDialog:
    """Dialog to let user confirm/correct frame count"""
    def __init__(self, parent, detected, expected):
        self.result = None
        dialog = tk.Toplevel(parent)
        dialog.title("Frame Count Mismatch")
        dialog.geometry("450x250")
        dialog.transient(parent)
        dialog.grab_set()

        tk.Label(dialog, text="Frame Count Mismatch Detected!", font=("Arial", 12, "bold"), fg="red").pack(pady=10)
        tk.Label(dialog, text=f"Expected: {expected} frames", font=("Arial", 10)).pack()
        tk.Label(dialog, text=f"Detected: {detected} frames", font=("Arial", 10)).pack(pady=5)
        tk.Label(dialog, text="How many frames did ChatGPT generate?", font=("Arial", 10)).pack(pady=10)

        frame_frame = tk.Frame(dialog)
        frame_frame.pack(pady=10)

        self.frame_var = tk.IntVar(value=detected)
        for i in range(max(1, expected - 2), expected + 3):
            tk.Radiobutton(frame_frame, text=f"{i}", variable=self.frame_var, value=i).pack(side=tk.LEFT, padx=5)

        btn_frame = tk.Frame(dialog)
        btn_frame.pack(pady=10)
        tk.Button(btn_frame, text="Confirm", command=lambda: self.confirm(dialog), bg="#4CAF50", fg="white", padx=10, pady=5).pack(side=tk.LEFT, padx=5)
        tk.Button(btn_frame, text="Cancel", command=lambda: self.cancel(dialog), bg="#f44336", fg="white", padx=10, pady=5).pack(side=tk.LEFT, padx=5)

        dialog.wait_window()

    def confirm(self, dialog):
        self.result = self.frame_var.get()
        dialog.destroy()

    def cancel(self, dialog):
        self.result = None
        dialog.destroy()

class SpriteGeneratorGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("HUNTRIX Sprite Generator - Phase 2")
        self.root.geometry("800x700")

        # Find resume point
        resume_index = find_resume_point()
        self.current_index = resume_index
        self.total = len(SPRITE_QUEUE)
        self.completed_count = resume_index

        # Title
        tk.Label(root, text="HUNTRIX Phase 2 Sprite Generator", font=("Arial", 16, "bold")).pack(pady=10)
        tk.Label(root, text="Enemies, Effects, Tutorial", font=("Arial", 12), fg="blue").pack()

        # Progress label
        self.progress_label = tk.Label(root, text="", font=("Arial", 14, "bold"))
        self.progress_label.pack(pady=5)

        # Current sprite name
        self.sprite_label = tk.Label(root, text="", font=("Arial", 12))
        self.sprite_label.pack(pady=5)

        # Completed list (collapsible)
        if self.completed_count > 0:
            completed_frame = tk.LabelFrame(root, text=f"Already Completed ({self.completed_count})", font=("Arial", 10))
            completed_frame.pack(pady=5, padx=10, fill=tk.X)
            completed_names = [SPRITE_QUEUE[i]['name'] for i in range(self.completed_count)]
            tk.Label(completed_frame, text=", ".join(completed_names), font=("Arial", 9), fg="green", wraplength=700).pack(pady=5, padx=5)

        # Prompt display
        tk.Label(root, text="Prompt (auto-copied to clipboard):", font=("Arial", 10)).pack(pady=5)
        self.prompt_text = scrolledtext.ScrolledText(root, height=12, width=90, wrap=tk.WORD)
        self.prompt_text.pack(pady=5, padx=10)

        # Instructions
        instructions_text = "1. Prompt is already copied - paste into ChatGPT\n2. Attach Cover Photo.png (for style reference)\n3. Download generated image\n4. Click button below to select it"
        tk.Label(root, text=instructions_text, font=("Arial", 9), fg="blue", justify=tk.LEFT).pack(pady=5)

        # Select file button
        self.select_btn = tk.Button(root, text="Select Downloaded Image", command=self.select_and_process,
                                    font=("Arial", 12, "bold"), bg="#4CAF50", fg="white", padx=20, pady=10)
        self.select_btn.pack(pady=10)

        # Skip button
        self.skip_btn = tk.Button(root, text="Skip This Sprite", command=self.skip_sprite,
                                  font=("Arial", 10), bg="#FF9800", fg="white", padx=10, pady=5)
        self.skip_btn.pack(pady=5)

        # Status label
        self.status_label = tk.Label(root, text="", font=("Arial", 10), fg="green", wraplength=750)
        self.status_label.pack(pady=5)

        # Load first prompt
        self.load_current_prompt()

    def skip_sprite(self):
        """Skip current sprite and move to next"""
        if messagebox.askyesno("Skip Sprite", f"Skip {SPRITE_QUEUE[self.current_index]['name']}?"):
            self.current_index += 1
            self.load_current_prompt()

    def load_current_prompt(self):
        """Load and display current prompt"""
        if self.current_index >= self.total:
            self.show_completion()
            return

        sprite = SPRITE_QUEUE[self.current_index]
        remaining = self.total - self.current_index

        self.progress_label.config(text=f"Progress: {self.completed_count} complete, {remaining} remaining")
        self.sprite_label.config(text=f"Current: {sprite['name']}.png ({sprite['frames']} frames @ {sprite['frame_size'][0]}x{sprite['frame_size'][1]}px)")

        self.prompt_text.delete(1.0, tk.END)
        self.prompt_text.insert(1.0, sprite['prompt'])

        try:
            pyperclip.copy(sprite['prompt'])
            self.status_label.config(text="✓ Prompt copied to clipboard! Paste into ChatGPT with Cover Photo.", fg="green")
        except:
            self.status_label.config(text="Prompt ready (install pyperclip for auto-copy)", fg="orange")

    def select_and_process(self):
        """Select and process image"""
        file_path = filedialog.askopenfilename(
            title="Select ChatGPT Generated Image",
            filetypes=[("PNG files", "*.png"), ("All files", "*.*")]
        )
        if not file_path:
            return

        self.status_label.config(text="Processing...", fg="blue")
        self.root.update()

        try:
            sprite = SPRITE_QUEUE[self.current_index]
            output_path = self.process_sprite_with_validation(file_path, sprite)
            self.status_label.config(text=f"SUCCESS! Saved to {output_path}", fg="green")
            self.completed_count += 1
            self.current_index += 1
            self.root.after(1500, self.load_current_prompt)
        except Exception as e:
            messagebox.showerror("Error", f"Processing failed:\n{str(e)}")
            self.status_label.config(text="Error! Try again or skip.", fg="red")

    def process_sprite_with_validation(self, input_path, spec):
        """Process sprite with frame validation"""
        img = Image.open(input_path).convert('RGBA')
        data = np.array(img)
        r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]
        is_light_bg = (r > 200) & (g > 200) & (b > 200)
        is_dark_bg = (r > 50) & (r < 100) & (g > 50) & (g < 100) & (b > 50) & (b < 100)
        data[is_light_bg | is_dark_bg, 3] = 0
        img = Image.fromarray(data, 'RGBA')

        bbox = img.getbbox()
        if bbox:
            img = img.crop(bbox)

        width, height = img.size
        expected_frames = spec['frames']
        expected_frame_width = spec['frame_size'][0]

        if expected_frames > 1:
            detected_frames = round(width / expected_frame_width)
            actual_frames = expected_frames

            if abs(detected_frames - expected_frames) > 0:
                dialog = FrameCountDialog(self.root, detected_frames, expected_frames)
                if dialog.result is None:
                    raise Exception("Cancelled")
                actual_frames = dialog.result

            frame_width = width // actual_frames
            frames = [img.crop((i * frame_width, 0, (i + 1) * frame_width, height)) for i in range(actual_frames)]

            if actual_frames < expected_frames:
                while len(frames) < expected_frames:
                    frames.append(frames[-1].copy())
            elif actual_frames > expected_frames:
                frames = frames[:expected_frames]
        else:
            frames = [img]

        target_frame_size = spec['frame_size']
        resized_frames = [frame.resize(target_frame_size, Image.Resampling.NEAREST) for frame in frames]

        final_width, final_height = spec['dims']
        final = Image.new('RGBA', (final_width, final_height), (0, 0, 0, 0))
        for i, frame in enumerate(resized_frames):
            final.paste(frame, (i * target_frame_size[0], 0))

        output_dir = spec['dir']
        os.makedirs(output_dir, exist_ok=True)
        output_path = f"{output_dir}/{spec['name']}.png"
        final.save(output_path, 'PNG')
        return output_path

    def show_completion(self):
        """Show completion"""
        self.prompt_text.delete(1.0, tk.END)
        self.prompt_text.insert(1.0, "🎉 ALL PHASE 2 SPRITES COMPLETE! 🎉\n\nEnemies, effects, and tutorial graphics generated successfully!")
        self.sprite_label.config(text="COMPLETE!")
        self.select_btn.config(state=tk.DISABLED)
        self.skip_btn.config(state=tk.DISABLED)
        self.status_label.config(text="Phase 2 done! Ready for Phase 3.", fg="green")
        messagebox.showinfo("Complete!", "All Phase 2 sprites generated!")

if __name__ == "__main__":
    root = tk.Tk()
    app = SpriteGeneratorGUI(root)
    root.mainloop()
