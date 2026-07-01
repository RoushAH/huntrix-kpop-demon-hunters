import tkinter as tk
from tkinter import filedialog, scrolledtext, messagebox
import pyperclip
from PIL import Image
import numpy as np
import os

# Import verification
from verify_and_fix_existing import verify_sprite

# [Full SPRITE_QUEUE - keeping all 13 for brevity, same as before]
SPRITE_QUEUE = [
    {"name": "rumi_attack", "prompt": """### Character 1: Rumi (Purple Hunter)
**Theme**: Balanced warrior, sword wielder, purple/gold color scheme

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `rumi_attack.png` | 240×48px | 5 frames @ 48×48px | Sword swing arc motion |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (frames side-by-side)

**Color palette**: Purple (#9966ff), gold accents, white/cream for clothing""",
        "dims": (240, 48), "frames": 5, "frame_size": (48, 48), "dir": "sprites/characters/rumi"},
    {"name": "rumi_hit", "prompt": """### Character 1: Rumi (Purple Hunter)
**Theme**: Balanced warrior, sword wielder, purple/gold color scheme

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `rumi_hit.png` | 96×48px | 3 frames @ 32×48px | Recoiling from damage |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (frames side-by-side)

**Color palette**: Purple (#9966ff), gold accents, white/cream for clothing""",
        "dims": (96, 48), "frames": 3, "frame_size": (32, 48), "dir": "sprites/characters/rumi"},
    {"name": "rumi_portrait", "prompt": """### Character 1: Rumi (Purple Hunter)
**Theme**: Balanced warrior, sword wielder, purple/gold color scheme

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `rumi_portrait.png` | 128×128px | 1 frame | Character select portrait, high detail |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)

**Color palette**: Purple (#9966ff), gold accents, white/cream for clothing""",
        "dims": (128, 128), "frames": 1, "frame_size": (128, 128), "dir": "sprites/characters/rumi"},
    {"name": "zoey_idle", "prompt": """### Character 3: Zoey (Blue Hunter)
**Theme**: Ranged attacker, throwing knives, blue/cyan/white color scheme

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `zoey_idle.png` | 128×48px | 4 frames @ 32×48px | Fighting stance, knife visible |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (frames side-by-side)

**Color palette**: Cyan (#00bfff), blue (#0066ff), white pants, gold accents""",
        "dims": (128, 48), "frames": 4, "frame_size": (32, 48), "dir": "sprites/characters/zoey"},
    {"name": "zoey_walk", "prompt": """### Character 3: Zoey (Blue Hunter)
**Theme**: Ranged attacker, throwing knives, blue/cyan/white color scheme

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `zoey_walk.png` | 192×48px | 6 frames @ 32×48px | Quick step animation |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (frames side-by-side)

**Color palette**: Cyan (#00bfff), blue (#0066ff), white pants, gold accents""",
        "dims": (192, 48), "frames": 6, "frame_size": (32, 48), "dir": "sprites/characters/zoey"},
    {"name": "zoey_attack", "prompt": """### Character 3: Zoey (Blue Hunter)
**Theme**: Ranged attacker, throwing knives, blue/cyan/white color scheme

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `zoey_attack.png` | 240×48px | 5 frames @ 48×48px | Throwing knife wind-up and release |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (frames side-by-side)

**Color palette**: Cyan (#00bfff), blue (#0066ff), white pants, gold accents""",
        "dims": (240, 48), "frames": 5, "frame_size": (48, 48), "dir": "sprites/characters/zoey"},
    {"name": "zoey_hit", "prompt": """### Character 3: Zoey (Blue Hunter)
**Theme**: Fast attacker, Japanese naginata bladed pole-arm, blue/cyan/white color scheme

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `zoey_hit.png` | 96×48px | 3 frames @ 32×48px | Taking damage |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (frames side-by-side)

**Color palette**: Cyan (#00bfff), blue (#0066ff), white pants, gold accents""",
        "dims": (96, 48), "frames": 3, "frame_size": (32, 48), "dir": "sprites/characters/zoey"},
    {"name": "zoey_portrait", "prompt": """### Character 3: Zoey (Blue Hunter)
**Theme**: Fast attacker, Japanese naginata bladed pole-arm, blue/cyan/white color scheme

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `zoey_portrait.png` | 128×128px | 1 frame | Character select portrait |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)

**Color palette**: Cyan (#00bfff), blue (#0066ff), white pants, gold accents""",
        "dims": (128, 128), "frames": 1, "frame_size": (128, 128), "dir": "sprites/characters/zoey"},
    {"name": "mira_idle", "prompt": """### Character 2: Mira (Red/Pink Hunter)
**Theme**: Ranged attacker, throwing knives, red/pink/black color scheme

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `mira_idle.png` | 128×48px | 4 frames @ 32×48px | Ready stance, knife visible |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (frames side-by-side)

**Color palette**: Hot pink (#ff1493), red (#cc0033), black, gold accents""",
        "dims": (128, 48), "frames": 4, "frame_size": (32, 48), "dir": "sprites/characters/mira"},
    {"name": "mira_walk", "prompt": """### Character 2: Mira (Red/Pink Hunter)
**Theme**: Ranged attacker, throwing knives, red/pink/black color scheme

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `mira_walk.png` | 192×48px | 6 frames @ 32×48px | Walking animation |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (frames side-by-side)

**Color palette**: Hot pink (#ff1493), red (#cc0033), black, gold accents""",
        "dims": (192, 48), "frames": 6, "frame_size": (32, 48), "dir": "sprites/characters/mira"},
    {"name": "mira_attack", "prompt": """### Character 2: Mira (Red/Pink Hunter)
**Theme**: Ranged attacker, throwing knives, red/pink/black color scheme

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `mira_attack.png` | 240×48px | 5 frames @ 48×48px | Throwing knife wind-up and release |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (frames side-by-side)

**Color palette**: Hot pink (#ff1493), red (#cc0033), black, gold accents""",
        "dims": (240, 48), "frames": 5, "frame_size": (48, 48), "dir": "sprites/characters/mira"},
    {"name": "mira_hit", "prompt": """### Character 2: Mira (Red/Pink Hunter)
**Theme**: Ranged attacker, throwing knives, red/pink/black color scheme

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `mira_hit.png` | 96×48px | 3 frames @ 32×48px | Taking damage |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (frames side-by-side)

**Color palette**: Hot pink (#ff1493), red (#cc0033), black, gold accents""",
        "dims": (96, 48), "frames": 3, "frame_size": (32, 48), "dir": "sprites/characters/mira"},
    {"name": "mira_portrait", "prompt": """### Character 2: Mira (Red/Pink Hunter)
**Theme**: Ranged attacker, throwing knives, red/pink/black color scheme

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `mira_portrait.png` | 128×128px | 1 frame | Character select portrait |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)

**Color palette**: Hot pink (#ff1493), red (#cc0033), black, gold accents""",
        "dims": (128, 128), "frames": 1, "frame_size": (128, 128), "dir": "sprites/characters/mira"}
]

def find_resume_point():
    """Find the first incomplete sprite"""
    for i, sprite in enumerate(SPRITE_QUEUE):
        sprite_path = f"{sprite['dir']}/{sprite['name']}.png"
        status, msg = verify_sprite(sprite_path, sprite['dims'], sprite['frames'], sprite['frame_size'])
        if status != True:  # Missing or wrong
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
        self.root.title("HUNTRIX Sprite Generator")
        self.root.geometry("800x700")

        # Find resume point
        resume_index = find_resume_point()
        self.current_index = resume_index
        self.total = len(SPRITE_QUEUE)
        self.completed_count = resume_index

        # Title
        tk.Label(root, text="HUNTRIX Phase 1 Sprite Generator", font=("Arial", 16, "bold")).pack(pady=10)

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
        instructions_text = "1. Prompt is already copied - paste into ChatGPT\n2. Attach Cover Photo.png\n3. Download generated image\n4. Click button below to select it"
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

        if spec['name'].endswith('_idle') and len(frames) == 3 and expected_frames == 4:
            frames = [frames[0], frames[1], frames[0], frames[2]]

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
        self.prompt_text.insert(1.0, "🎉 ALL PHASE 1 SPRITES COMPLETE! 🎉\n\nAll character sprites generated successfully!")
        self.sprite_label.config(text="COMPLETE!")
        self.select_btn.config(state=tk.DISABLED)
        self.skip_btn.config(state=tk.DISABLED)
        self.status_label.config(text="Phase 1 done! Ready for game development.", fg="green")
        messagebox.showinfo("Complete!", "All Phase 1 character sprites generated!")

if __name__ == "__main__":
    root = tk.Tk()
    app = SpriteGeneratorGUI(root)
    root.mainloop()
