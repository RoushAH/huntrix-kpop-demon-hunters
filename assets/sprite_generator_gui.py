import tkinter as tk
from tkinter import filedialog, scrolledtext, messagebox
import pyperclip
from PIL import Image
import numpy as np
import os

# All Phase 1 sprite specifications with prompts
SPRITE_QUEUE = [
    {
        "name": "rumi_attack",
        "prompt": """### Character 1: Rumi (Purple Hunter)
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
        "dims": (240, 48),
        "frames": 5,
        "frame_size": (48, 48),
        "dir": "sprites/characters/rumi"
    },
    {
        "name": "rumi_hit",
        "prompt": """### Character 1: Rumi (Purple Hunter)
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
        "dims": (96, 48),
        "frames": 3,
        "frame_size": (32, 48),
        "dir": "sprites/characters/rumi"
    },
    {
        "name": "rumi_portrait",
        "prompt": """### Character 1: Rumi (Purple Hunter)
**Theme**: Balanced warrior, sword wielder, purple/gold color scheme

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `rumi_portrait.png` | 128×128px | 1 frame | Character select portrait, high detail |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)

**Color palette**: Purple (#9966ff), gold accents, white/cream for clothing""",
        "dims": (128, 128),
        "frames": 1,
        "frame_size": (128, 128),
        "dir": "sprites/characters/rumi"
    },
    {
        "name": "mira_idle",
        "prompt": """### Character 2: Mira (Red/Pink Hunter)
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
        "dims": (128, 48),
        "frames": 4,
        "frame_size": (32, 48),
        "dir": "sprites/characters/mira"
    },
    {
        "name": "mira_walk",
        "prompt": """### Character 2: Mira (Red/Pink Hunter)
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
        "dims": (192, 48),
        "frames": 6,
        "frame_size": (32, 48),
        "dir": "sprites/characters/mira"
    },
    {
        "name": "mira_attack",
        "prompt": """### Character 2: Mira (Red/Pink Hunter)
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
        "dims": (240, 48),
        "frames": 5,
        "frame_size": (48, 48),
        "dir": "sprites/characters/mira"
    },
    {
        "name": "mira_hit",
        "prompt": """### Character 2: Mira (Red/Pink Hunter)
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
        "dims": (96, 48),
        "frames": 3,
        "frame_size": (32, 48),
        "dir": "sprites/characters/mira"
    },
    {
        "name": "mira_portrait",
        "prompt": """### Character 2: Mira (Red/Pink Hunter)
**Theme**: Ranged attacker, throwing knives, red/pink/black color scheme

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `mira_portrait.png` | 128×128px | 1 frame | Character select portrait |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)

**Color palette**: Hot pink (#ff1493), red (#cc0033), black, gold accents""",
        "dims": (128, 128),
        "frames": 1,
        "frame_size": (128, 128),
        "dir": "sprites/characters/mira"
    },
    {
        "name": "zoey_idle",
        "prompt": """### Character 3: Zoey (Blue Hunter)
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
        "dims": (128, 48),
        "frames": 4,
        "frame_size": (32, 48),
        "dir": "sprites/characters/zoey"
    },
    {
        "name": "zoey_walk",
        "prompt": """### Character 3: Zoey (Blue Hunter)
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
        "dims": (192, 48),
        "frames": 6,
        "frame_size": (32, 48),
        "dir": "sprites/characters/zoey"
    },
    {
        "name": "zoey_attack",
        "prompt": """### Character 3: Zoey (Blue Hunter)
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
        "dims": (240, 48),
        "frames": 5,
        "frame_size": (48, 48),
        "dir": "sprites/characters/zoey"
    },
    {
        "name": "zoey_hit",
        "prompt": """### Character 3: Zoey (Blue Hunter)
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
        "dims": (96, 48),
        "frames": 3,
        "frame_size": (32, 48),
        "dir": "sprites/characters/zoey"
    },
    {
        "name": "zoey_portrait",
        "prompt": """### Character 3: Zoey (Blue Hunter)
**Theme**: Fast attacker, martial arts, blue/cyan/white color scheme

| File | Dimensions | Frames | Description |
|------|-----------|--------|-------------|
| `zoey_portrait.png` | 128×128px | 1 frame | Character select portrait |

### Format
- **File type**: PNG with transparency
- **Color mode**: Indexed color (256 colors max)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)

**Color palette**: Cyan (#00bfff), blue (#0066ff), white pants, gold accents""",
        "dims": (128, 128),
        "frames": 1,
        "frame_size": (128, 128),
        "dir": "sprites/characters/zoey"
    }
]

class SpriteGeneratorGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("HUNTRIX Sprite Generator")
        self.root.geometry("800x600")

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
        self.status_label = tk.Label(root, text="", font=("Arial", 10), fg="green")
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
        self.sprite_label.config(text=f"Current: {sprite['name']}.png")

        # Display prompt
        self.prompt_text.delete(1.0, tk.END)
        self.prompt_text.insert(1.0, sprite['prompt'])

        # Copy to clipboard
        try:
            pyperclip.copy(sprite['prompt'])
            self.status_label.config(text="Prompt copied to clipboard! Ready to paste into ChatGPT.", fg="green")
        except Exception as e:
            self.status_label.config(text=f"Note: Install pyperclip for auto-copy: pip install pyperclip", fg="orange")

    def select_and_process(self):
        """Open file dialog and process selected image"""
        file_path = filedialog.askopenfilename(
            title="Select ChatGPT Generated Image",
            filetypes=[("PNG files", "*.png"), ("All files", "*.*")]
        )

        if not file_path:
            return  # User cancelled

        self.status_label.config(text="Processing...", fg="blue")
        self.root.update()

        try:
            sprite = SPRITE_QUEUE[self.current_index]
            output_path = self.process_sprite(file_path, sprite)

            self.status_label.config(text=f"SUCCESS! Saved to {output_path}", fg="green")
            self.root.update()

            # Move to next sprite
            self.current_index += 1
            self.root.after(1500, self.load_current_prompt)  # Wait 1.5s then load next

        except Exception as e:
            messagebox.showerror("Processing Error", f"Error processing sprite:\n{str(e)}")
            self.status_label.config(text="Error! Try again.", fg="red")

    def process_sprite(self, input_path, spec):
        """Process sprite to exact specifications"""
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

        # Extract frames
        width, height = img.size
        expected_frames = spec['frames']

        if expected_frames > 1:
            frame_width = width // expected_frames
            frames = []
            for i in range(expected_frames):
                left = i * frame_width
                right = (i + 1) * frame_width
                frame = img.crop((left, 0, right, height))
                frames.append(frame)
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
