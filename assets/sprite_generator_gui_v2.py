import tkinter as tk
from tkinter import filedialog, scrolledtext, messagebox
import pyperclip
from PIL import Image
import numpy as np
import os

# [Previous SPRITE_QUEUE definition - same as before, keeping for brevity]
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
        "dims": (128, 128), "frames": 1, "frame_size": (128, 128), "dir": "sprites/characters/mira"},

    {"name": "zoey_idle", "prompt": """### Character 3: Zoey (Blue Hunter)
**Theme**: Fast attacker, martial arts, blue/cyan/white color scheme

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `zoey_idle.png` | 128×48px | 4 frames @ 32×48px | Fighting stance, hands ready |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (frames side-by-side)

**Color palette**: Cyan (#00bfff), blue (#0066ff), white pants, gold accents""",
        "dims": (128, 48), "frames": 4, "frame_size": (32, 48), "dir": "sprites/characters/zoey"},

    {"name": "zoey_walk", "prompt": """### Character 3: Zoey (Blue Hunter)
**Theme**: Fast attacker, martial arts, blue/cyan/white color scheme

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
**Theme**: Fast attacker, martial arts, blue/cyan/white color scheme

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `zoey_attack.png` | 240×48px | 5 frames @ 48×48px | Punch/kick combo |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layout**: Horizontal spritesheet (frames side-by-side)

**Color palette**: Cyan (#00bfff), blue (#0066ff), white pants, gold accents""",
        "dims": (240, 48), "frames": 5, "frame_size": (48, 48), "dir": "sprites/characters/zoey"},

    {"name": "zoey_hit", "prompt": """### Character 3: Zoey (Blue Hunter)
**Theme**: Fast attacker, martial arts, blue/cyan/white color scheme

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
**Theme**: Fast attacker, martial arts, blue/cyan/white color scheme

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `zoey_portrait.png` | 128×128px | 1 frame | Character select portrait |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)

**Color palette**: Cyan (#00bfff), blue (#0066ff), white pants, gold accents""",
        "dims": (128, 128), "frames": 1, "frame_size": (128, 128), "dir": "sprites/characters/zoey"}
]

def detect_actual_frame_count(img, expected_frame_width):
    """Try to detect how many frames are actually in the image"""
    width = img.size[0]

    # Simple heuristic: count based on apparent width
    apparent_frames = round(width / expected_frame_width)

    return apparent_frames

class FrameCountDialog:
    """Dialog to let user confirm/correct frame count"""
    def __init__(self, parent, detected, expected):
        self.result = None

        dialog = tk.Toplevel(parent)
        dialog.title("Frame Count Mismatch")
        dialog.geometry("400x200")
        dialog.transient(parent)
        dialog.grab_set()

        tk.Label(dialog, text="Frame Count Mismatch Detected!", font=("Arial", 12, "bold"), fg="red").pack(pady=10)
        tk.Label(dialog, text=f"Expected: {expected} frames", font=("Arial", 10)).pack()
        tk.Label(dialog, text=f"Detected: {detected} frames", font=("Arial", 10)).pack(pady=5)
        tk.Label(dialog, text="How many frames did ChatGPT actually generate?", font=("Arial", 10)).pack(pady=10)

        frame_frame = tk.Frame(dialog)
        frame_frame.pack(pady=10)

        self.frame_var = tk.IntVar(value=detected)
        for i in range(max(1, expected - 2), expected + 3):
            tk.Radiobutton(frame_frame, text=f"{i} frames", variable=self.frame_var, value=i).pack(side=tk.LEFT, padx=5)

        btn_frame = tk.Frame(dialog)
        btn_frame.pack(pady=10)

        tk.Button(btn_frame, text="Confirm", command=lambda: self.confirm(dialog), bg="#4CAF50", fg="white").pack(side=tk.LEFT, padx=5)
        tk.Button(btn_frame, text="Cancel", command=lambda: self.cancel(dialog), bg="#f44336", fg="white").pack(side=tk.LEFT, padx=5)

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
        self.root.geometry("800x650")

        self.current_index = 0
        self.total = len(SPRITE_QUEUE)

        # Progress label
        self.progress_label = tk.Label(root, text="", font=("Arial", 14, "bold"))
        self.progress_label.pack(pady=10)

        # Current sprite name
        self.sprite_label = tk.Label(root, text="", font=("Arial", 12))
        self.sprite_label.pack(pady=5)

        # Prompt display
        tk.Label(root, text="Prompt (copied to clipboard):", font=("Arial", 10)).pack(pady=5)
        self.prompt_text = scrolledtext.ScrolledText(root, height=15, width=90, wrap=tk.WORD)
        self.prompt_text.pack(pady=10, padx=10)

        # Instructions
        instructions = tk.Label(root, text="1. Paste prompt into ChatGPT with Cover Photo\n2. Download the generated image\n3. Click 'Select Downloaded Image' below",
                               font=("Arial", 9), fg="blue")
        instructions.pack(pady=10)

        # Select file button
        self.select_btn = tk.Button(root, text="Select Downloaded Image", command=self.select_and_process,
                                    font=("Arial", 12, "bold"), bg="#4CAF50", fg="white", padx=20, pady=10)
        self.select_btn.pack(pady=10)

        # Status label
        self.status_label = tk.Label(root, text="", font=("Arial", 10), fg="green", wraplength=700)
        self.status_label.pack(pady=5)

        # Load first prompt
        self.load_current_prompt()

    def load_current_prompt(self):
        """Load and display current prompt, copy to clipboard"""
        if self.current_index >= self.total:
            self.show_completion()
            return

        sprite = SPRITE_QUEUE[self.current_index]

        # Update labels
        self.progress_label.config(text=f"Progress: {self.current_index + 1} / {self.total}")
        self.sprite_label.config(text=f"Current: {sprite['name']}.png ({sprite['frames']} frames expected)")

        # Display prompt
        self.prompt_text.delete(1.0, tk.END)
        self.prompt_text.insert(1.0, sprite['prompt'])

        # Copy to clipboard
        try:
            pyperclip.copy(sprite['prompt'])
            self.status_label.config(text="Prompt copied to clipboard! Paste into ChatGPT with Cover Photo attached.", fg="green")
        except:
            self.status_label.config(text="Prompt ready. Copy manually if needed.", fg="orange")

    def select_and_process(self):
        """Open file dialog and process selected image with frame validation"""
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
            self.root.update()

            # Move to next sprite
            self.current_index += 1
            self.root.after(1500, self.load_current_prompt)

        except Exception as e:
            messagebox.showerror("Processing Error", f"Error processing sprite:\n{str(e)}")
            self.status_label.config(text="Error! Try again.", fg="red")

    def process_sprite_with_validation(self, input_path, spec):
        """Process sprite with frame count validation"""
        img = Image.open(input_path).convert('RGBA')

        # Remove background
        data = np.array(img)
        r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]
        is_light_bg = (r > 200) & (g > 200) & (b > 200)
        is_dark_bg = (r > 50) & (r < 100) & (g > 50) & (g < 100) & (b > 50) & (b < 100)
        data[is_light_bg | is_dark_bg, 3] = 0
        img = Image.fromarray(data, 'RGBA')

        # Crop to content
        bbox = img.getbbox()
        if bbox:
            img = img.crop(bbox)

        # Frame detection and validation
        width, height = img.size
        expected_frames = spec['frames']
        expected_frame_width = spec['frame_size'][0]

        if expected_frames > 1:
            # Detect actual frame count
            detected_frames = round(width / expected_frame_width)

            # If mismatch, ask user
            actual_frames = expected_frames
            if abs(detected_frames - expected_frames) > 0:
                dialog = FrameCountDialog(self.root, detected_frames, expected_frames)
                if dialog.result is None:
                    raise Exception("Frame count validation cancelled")
                actual_frames = dialog.result

            # Extract frames based on ACTUAL count
            frame_width = width // actual_frames
            frames = []
            for i in range(actual_frames):
                left = i * frame_width
                right = (i + 1) * frame_width
                frame = img.crop((left, 0, right, height))
                frames.append(frame)

            # Handle frame count adjustments
            if actual_frames < expected_frames:
                # Duplicate last frame to reach expected
                while len(frames) < expected_frames:
                    frames.append(frames[-1].copy())
                self.status_label.config(text=f"Note: Duplicated frames to reach {expected_frames} frames", fg="orange")
            elif actual_frames > expected_frames:
                # Trim to expected
                frames = frames[:expected_frames]
                self.status_label.config(text=f"Note: Trimmed to {expected_frames} frames", fg="orange")

        else:
            frames = [img]

        # Handle 3-to-4 frame conversion for idles
        if spec['name'].endswith('_idle') and len(frames) == 3 and expected_frames == 4:
            frames = [frames[0], frames[1], frames[0], frames[2]]

        # Resize frames
        target_frame_size = spec['frame_size']
        resized_frames = [frame.resize(target_frame_size, Image.Resampling.NEAREST) for frame in frames]

        # Create final spritesheet
        final_width, final_height = spec['dims']
        final = Image.new('RGBA', (final_width, final_height), (0, 0, 0, 0))

        for i, frame in enumerate(resized_frames):
            x_offset = i * target_frame_size[0]
            final.paste(frame, (x_offset, 0))

        # Save
        output_dir = spec['dir']
        os.makedirs(output_dir, exist_ok=True)
        output_path = f"{output_dir}/{spec['name']}.png"
        final.save(output_path, 'PNG')

        return output_path

    def show_completion(self):
        """Show completion message"""
        self.prompt_text.delete(1.0, tk.END)
        self.prompt_text.insert(1.0, "ALL SPRITES COMPLETE!\n\nPhase 1 character sprites are done!")
        self.sprite_label.config(text="COMPLETE!")
        self.select_btn.config(state=tk.DISABLED)
        self.status_label.config(text="All Phase 1 sprites generated successfully!", fg="green")
        messagebox.showinfo("Complete!", "All Phase 1 character sprites have been generated!")

if __name__ == "__main__":
    root = tk.Tk()
    app = SpriteGeneratorGUI(root)
    root.mainloop()
