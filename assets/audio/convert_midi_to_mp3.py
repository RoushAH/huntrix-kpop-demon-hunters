"""
Convert MIDI files to MP3 using FluidSynth and a soundfont.

Requirements:
    pip install mido
    pip install pydub

You'll also need:
    - FluidSynth: https://github.com/FluidSynth/fluidsynth/releases
    - A soundfont file (e.g., GeneralUser GS.sf2)

Usage:
    python convert_midi_to_mp3.py
"""

import os
import subprocess
from pathlib import Path

# Configuration
MUSIC_DIR = Path(__file__).parent / "music"
SOUNDFONT = "soundfont.sf2"  # Place a soundfont file here or use full path
FLUIDSYNTH = "fluidsynth"  # Or full path to fluidsynth executable

def convert_midi_to_wav(midi_file, wav_file):
    """Convert MIDI to WAV using FluidSynth"""
    cmd = [
        FLUIDSYNTH,
        "-ni",  # No interactive shell
        SOUNDFONT,
        midi_file,
        "-F", wav_file,
        "-r", "44100"  # Sample rate
    ]

    print(f"Converting {midi_file.name} to WAV...")
    subprocess.run(cmd, check=True)

def convert_wav_to_mp3(wav_file, mp3_file):
    """Convert WAV to MP3 using ffmpeg"""
    cmd = [
        "ffmpeg",
        "-i", wav_file,
        "-codec:a", "libmp3lame",
        "-qscale:a", "2",  # High quality
        mp3_file,
        "-y"  # Overwrite
    ]

    print(f"Converting {wav_file.name} to MP3...")
    subprocess.run(cmd, check=True)

def main():
    # Find all MIDI files
    midi_files = list(MUSIC_DIR.glob("*.mid"))

    if not midi_files:
        print("No MIDI files found in", MUSIC_DIR)
        return

    print(f"Found {len(midi_files)} MIDI files")

    for midi_file in midi_files:
        wav_file = midi_file.with_suffix(".wav")
        mp3_file = midi_file.with_suffix(".mp3")

        try:
            # Step 1: MIDI -> WAV
            convert_midi_to_wav(str(midi_file), str(wav_file))

            # Step 2: WAV -> MP3
            convert_wav_to_mp3(str(wav_file), str(mp3_file))

            # Clean up WAV
            wav_file.unlink()

            print(f"✓ Created {mp3_file.name}")

        except subprocess.CalledProcessError as e:
            print(f"✗ Failed to convert {midi_file.name}: {e}")
        except Exception as e:
            print(f"✗ Error: {e}")

    print("\nDone!")

if __name__ == "__main__":
    main()
