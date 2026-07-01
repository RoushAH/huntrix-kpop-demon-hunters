import tkinter as tk
from tkinter import filedialog, scrolledtext, messagebox
import pyperclip
from PIL import Image
import os

# Phase 4 Queue: Background Art
BACKGROUND_QUEUE = [
    # Level 1: Seoul Cityscape Night
    {"name": "bg_level1_layer1", "prompt": """### Level 1: Seoul Cityscape Night - Layer 1 (Far)
**Theme**: Modern Seoul at night, neon signs, skyscrapers, purple sky

| File | Dimensions | Layer | Description |
|------|-----------|--------|-------------|
| `bg_level1_layer1.png` | 800×450px | Far | Distant buildings, moon, purple sky |

### Format
- **File type**: PNG
- **Dimensions**: 800×450px (16:9 aspect ratio)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layer**: Background/Far layer (slowest parallax movement)

**Color palette**: Purple sky, pink/blue neon, dark buildings
**Details**: Night sky with moon, distant Seoul skyline silhouettes""",
        "dims": (800, 450), "dir": "backgrounds/level1"},
    {"name": "bg_level1_layer2", "prompt": """### Level 1: Seoul Cityscape Night - Layer 2 (Mid)
**Theme**: Modern Seoul at night, neon signs, skyscrapers, purple sky

| File | Dimensions | Layer | Description |
|------|-----------|--------|-------------|
| `bg_level1_layer2.png` | 800×450px | Mid | Mid-distance buildings with neon signs |

### Format
- **File type**: PNG
- **Dimensions**: 800×450px (16:9 aspect ratio)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layer**: Mid-ground layer (medium parallax movement)

**Color palette**: Purple sky, pink/blue neon, dark buildings
**Details**: Buildings with glowing neon signs in Korean and English, more detail than layer 1""",
        "dims": (800, 450), "dir": "backgrounds/level1"},
    {"name": "bg_level1_layer3", "prompt": """### Level 1: Seoul Cityscape Night - Layer 3 (Near)
**Theme**: Modern Seoul at night, neon signs, skyscrapers, purple sky

| File | Dimensions | Layer | Description |
|------|-----------|--------|-------------|
| `bg_level1_layer3.png` | 800×450px | Near | Street level, sidewalk, close buildings |

### Format
- **File type**: PNG with transparency (for parallax effect)
- **Dimensions**: 800×450px (16:9 aspect ratio)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layer**: Foreground layer (fastest parallax movement)

**Color palette**: Purple sky, pink/blue neon, dark buildings
**Details**: Street level view, sidewalk, lamp posts, close building facades with detail""",
        "dims": (800, 450), "dir": "backgrounds/level1"},

    # Level 2: Neon District
    {"name": "bg_level2_layer1", "prompt": """### Level 2: Neon District - Layer 1 (Far)
**Theme**: Dense urban neon district, more vibrant and energetic

| File | Dimensions | Layer | Description |
|------|-----------|--------|-------------|
| `bg_level2_layer1.png` | 800×450px | Far | Distant neon skyline, stars |

### Format
- **File type**: PNG
- **Dimensions**: 800×450px (16:9 aspect ratio)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layer**: Background/Far layer (slowest parallax movement)

**Color palette**: Hot pink, cyan, yellow neon, dark blue sky
**Details**: Night sky with stars, distant neon-lit buildings, more colorful than Level 1""",
        "dims": (800, 450), "dir": "backgrounds/level2"},
    {"name": "bg_level2_layer2", "prompt": """### Level 2: Neon District - Layer 2 (Mid)
**Theme**: Dense urban neon district, more vibrant and energetic

| File | Dimensions | Layer | Description |
|------|-----------|--------|-------------|
| `bg_level2_layer2.png` | 800×450px | Mid | Bright neon signs, billboards |

### Format
- **File type**: PNG
- **Dimensions**: 800×450px (16:9 aspect ratio)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layer**: Mid-ground layer (medium parallax movement)

**Color palette**: Hot pink, cyan, yellow neon, dark blue sky
**Details**: Large neon billboards, bright signs, advertisements, K-pop imagery""",
        "dims": (800, 450), "dir": "backgrounds/level2"},
    {"name": "bg_level2_layer3", "prompt": """### Level 2: Neon District - Layer 3 (Near)
**Theme**: Dense urban neon district, more vibrant and energetic

| File | Dimensions | Layer | Description |
|------|-----------|--------|-------------|
| `bg_level2_layer3.png` | 800×450px | Near | Street with shop fronts, neon reflections |

### Format
- **File type**: PNG with transparency (for parallax effect)
- **Dimensions**: 800×450px (16:9 aspect ratio)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layer**: Foreground layer (fastest parallax movement)

**Color palette**: Hot pink, cyan, yellow neon, dark blue sky
**Details**: Shop fronts with neon signs, reflections on wet street, very colorful and energetic""",
        "dims": (800, 450), "dir": "backgrounds/level2"},

    # Level 3: Demonic Realm
    {"name": "bg_level3_layer1", "prompt": """### Level 3: Demonic Realm - Layer 1 (Far)
**Theme**: Twisted nightmare version of Seoul, purple/red sky, warped buildings

| File | Dimensions | Layer | Description |
|------|-----------|--------|-------------|
| `bg_level3_layer1.png` | 800×450px | Far | Purple sky, blood moon, dark clouds |

### Format
- **File type**: PNG
- **Dimensions**: 800×450px (16:9 aspect ratio)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layer**: Background/Far layer (slowest parallax movement)

**Color palette**: Dark purple, blood red, black, sickly green
**Details**: Ominous blood moon, swirling dark clouds, purple nightmare sky""",
        "dims": (800, 450), "dir": "backgrounds/level3"},
    {"name": "bg_level3_layer2", "prompt": """### Level 3: Demonic Realm - Layer 2 (Mid)
**Theme**: Twisted nightmare version of Seoul, purple/red sky, warped buildings

| File | Dimensions | Layer | Description |
|------|-----------|--------|-------------|
| `bg_level3_layer2.png` | 800×450px | Mid | Twisted demonic architecture |

### Format
- **File type**: PNG
- **Dimensions**: 800×450px (16:9 aspect ratio)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layer**: Mid-ground layer (medium parallax movement)

**Color palette**: Dark purple, blood red, black, sickly green
**Details**: Warped buildings, demonic architecture, Seoul buildings twisted into nightmare shapes""",
        "dims": (800, 450), "dir": "backgrounds/level3"},
    {"name": "bg_level3_layer3", "prompt": """### Level 3: Demonic Realm - Layer 3 (Near)
**Theme**: Twisted nightmare version of Seoul, purple/red sky, warped buildings

| File | Dimensions | Layer | Description |
|------|-----------|--------|-------------|
| `bg_level3_layer3.png` | 800×450px | Near | Cracked ground, demon portals |

### Format
- **File type**: PNG with transparency (for parallax effect)
- **Dimensions**: 800×450px (16:9 aspect ratio)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layer**: Foreground layer (fastest parallax movement)

**Color palette**: Dark purple, blood red, black, sickly green
**Details**: Cracked ground with lava, demon portals glowing, ominous foreground elements""",
        "dims": (800, 450), "dir": "backgrounds/level3"},

    # Boss Arena
    {"name": "bg_boss_layer1", "prompt": """### Boss Arena: Concert Stage - Layer 1 (Far)
**Theme**: Concert/idol stage for final showdown

| File | Dimensions | Layer | Description |
|------|-----------|--------|-------------|
| `bg_boss_layer1.png` | 800×450px | Far | Stage back wall with "SAJA" logo |

### Format
- **File type**: PNG
- **Dimensions**: 800×450px (16:9 aspect ratio)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layer**: Background/Far layer (slowest parallax movement)

**Color palette**: Dark stage, dramatic spotlights, gold/red accents
**Details**: Large "SAJA" logo on back wall, idol concert stage aesthetic""",
        "dims": (800, 450), "dir": "backgrounds/boss"},
    {"name": "bg_boss_layer2", "prompt": """### Boss Arena: Concert Stage - Layer 2 (Mid)
**Theme**: Concert/idol stage for final showdown

| File | Dimensions | Layer | Description |
|------|-----------|--------|-------------|
| `bg_boss_layer2.png` | 800×450px | Mid | Stage lighting rigs, spotlights |

### Format
- **File type**: PNG
- **Dimensions**: 800×450px (16:9 aspect ratio)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layer**: Mid-ground layer (medium parallax movement)

**Color palette**: Dark stage, dramatic spotlights, gold/red accents
**Details**: Overhead lighting rigs, spotlights beaming down, concert equipment""",
        "dims": (800, 450), "dir": "backgrounds/boss"},
    {"name": "bg_boss_layer3", "prompt": """### Boss Arena: Concert Stage - Layer 3 (Near)
**Theme**: Concert/idol stage for final showdown

| File | Dimensions | Layer | Description |
|------|-----------|--------|-------------|
| `bg_boss_layer3.png` | 800×450px | Near | Stage floor with light effects |

### Format
- **File type**: PNG with transparency (for parallax effect)
- **Dimensions**: 800×450px (16:9 aspect ratio)
- **Style**: 8-bit pixel art, clean pixels (no anti-aliasing)
- **Layer**: Foreground layer (fastest parallax movement)

**Color palette**: Dark stage, dramatic spotlights, gold/red accents
**Details**: Stage floor with light effects, speaker stacks at edges, concert stage ground""",
        "dims": (800, 450), "dir": "backgrounds/boss"}
]

def find_resume_point():
    """Find the first incomplete background"""
    for i, bg in enumerate(BACKGROUND_QUEUE):
        bg_path = f"{bg['dir']}/{bg['name']}.png"
        if not os.path.exists(bg_path):
            return i
    return len(BACKGROUND_QUEUE)

class BackgroundGeneratorGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("HUNTRIX Background Generator - Phase 4")
        self.root.geometry("800x700")

        resume_index = find_resume_point()
        self.current_index = resume_index
        self.total = len(BACKGROUND_QUEUE)
        self.completed_count = resume_index

        tk.Label(root, text="HUNTRIX Phase 4 Background Generator", font=("Arial", 16, "bold")).pack(pady=10)
        tk.Label(root, text="Parallax Background Layers", font=("Arial", 12), fg="blue").pack()

        self.progress_label = tk.Label(root, text="", font=("Arial", 14, "bold"))
        self.progress_label.pack(pady=5)

        self.bg_label = tk.Label(root, text="", font=("Arial", 12))
        self.bg_label.pack(pady=5)

        if self.completed_count > 0:
            completed_frame = tk.LabelFrame(root, text=f"Already Completed ({self.completed_count})", font=("Arial", 10))
            completed_frame.pack(pady=5, padx=10, fill=tk.X)
            completed_names = [BACKGROUND_QUEUE[i]['name'] for i in range(self.completed_count)]
            tk.Label(completed_frame, text=", ".join(completed_names), font=("Arial", 9), fg="green", wraplength=700).pack(pady=5, padx=5)

        tk.Label(root, text="Prompt (auto-copied to clipboard):", font=("Arial", 10)).pack(pady=5)
        self.prompt_text = scrolledtext.ScrolledText(root, height=12, width=90, wrap=tk.WORD)
        self.prompt_text.pack(pady=5, padx=10)

        instructions_text = "1. Prompt is already copied - paste into ChatGPT\n2. Attach Cover Photo.png for style reference\n3. Download generated image (800×450px)\n4. Click button below to select it"
        tk.Label(root, text=instructions_text, font=("Arial", 9), fg="blue", justify=tk.LEFT).pack(pady=5)

        self.select_btn = tk.Button(root, text="Select Downloaded Background", command=self.select_and_process,
                                    font=("Arial", 12, "bold"), bg="#4CAF50", fg="white", padx=20, pady=10)
        self.select_btn.pack(pady=10)

        self.skip_btn = tk.Button(root, text="Skip This Background", command=self.skip_background,
                                  font=("Arial", 10), bg="#FF9800", fg="white", padx=10, pady=5)
        self.skip_btn.pack(pady=5)

        self.status_label = tk.Label(root, text="", font=("Arial", 10), fg="green", wraplength=750)
        self.status_label.pack(pady=5)

        self.load_current_prompt()

    def skip_background(self):
        if messagebox.askyesno("Skip Background", f"Skip {BACKGROUND_QUEUE[self.current_index]['name']}?"):
            self.current_index += 1
            self.load_current_prompt()

    def load_current_prompt(self):
        if self.current_index >= self.total:
            self.show_completion()
            return

        bg = BACKGROUND_QUEUE[self.current_index]
        remaining = self.total - self.current_index

        self.progress_label.config(text=f"Progress: {self.completed_count} complete, {remaining} remaining")
        self.bg_label.config(text=f"Current: {bg['name']}.png ({bg['dims'][0]}×{bg['dims'][1]}px)")

        self.prompt_text.delete(1.0, tk.END)
        self.prompt_text.insert(1.0, bg['prompt'])

        try:
            pyperclip.copy(bg['prompt'])
            self.status_label.config(text="✓ Prompt copied to clipboard! Paste into ChatGPT with Cover Photo.", fg="green")
        except:
            self.status_label.config(text="Prompt ready (install pyperclip for auto-copy)", fg="orange")

    def select_and_process(self):
        file_path = filedialog.askopenfilename(
            title="Select ChatGPT Generated Background",
            filetypes=[("PNG files", "*.png"), ("All files", "*.*")]
        )
        if not file_path:
            return

        self.status_label.config(text="Processing...", fg="blue")
        self.root.update()

        try:
            bg = BACKGROUND_QUEUE[self.current_index]
            output_path = self.process_background(file_path, bg)
            self.status_label.config(text=f"SUCCESS! Saved to {output_path}", fg="green")
            self.completed_count += 1
            self.current_index += 1
            self.root.after(1500, self.load_current_prompt)
        except Exception as e:
            messagebox.showerror("Error", f"Processing failed:\n{str(e)}")
            self.status_label.config(text="Error! Try again or skip.", fg="red")

    def process_background(self, input_path, spec):
        """Process background image - validate dimensions and save"""
        img = Image.open(input_path)

        # Convert to RGB or RGBA as appropriate
        if img.mode not in ('RGB', 'RGBA'):
            img = img.convert('RGBA')

        # Check dimensions
        if img.size != spec['dims']:
            # Offer to resize
            response = messagebox.askyesno(
                "Dimension Mismatch",
                f"Image is {img.size[0]}×{img.size[1]}px\n"
                f"Expected: {spec['dims'][0]}×{spec['dims'][1]}px\n\n"
                f"Resize to correct dimensions?"
            )
            if response:
                img = img.resize(spec['dims'], Image.Resampling.LANCZOS)
            else:
                raise Exception(f"Incorrect dimensions: {img.size}, expected {spec['dims']}")

        # Save
        output_dir = spec['dir']
        os.makedirs(output_dir, exist_ok=True)
        output_path = f"{output_dir}/{spec['name']}.png"
        img.save(output_path, 'PNG')
        return output_path

    def show_completion(self):
        self.prompt_text.delete(1.0, tk.END)
        self.prompt_text.insert(1.0, "🎉 ALL PHASE 4 BACKGROUNDS COMPLETE! 🎉\n\nAll parallax background layers generated successfully!")
        self.bg_label.config(text="COMPLETE!")
        self.select_btn.config(state=tk.DISABLED)
        self.skip_btn.config(state=tk.DISABLED)
        self.status_label.config(text="Phase 4 done! All backgrounds complete!", fg="green")
        messagebox.showinfo("Complete!", "All Phase 4 backgrounds generated!")

if __name__ == "__main__":
    root = tk.Tk()
    app = BackgroundGeneratorGUI(root)
    root.mainloop()
