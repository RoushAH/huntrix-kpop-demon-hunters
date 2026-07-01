# Music Setup Instructions

The game currently has MIDI files but browsers cannot play MIDI natively.

## Current Files
- `Boss.mid`
- `Level1.mid`
- `Level2.mid`
- `Level3.mid`

## Convert MIDI to MP3

### Option 1: Online Converter (Easiest)
1. Go to https://www.zamzar.com/convert/midi-to-mp3/
2. Upload each MIDI file
3. Download the MP3 versions
4. Save them in this directory with the same names (Boss.mp3, Level1.mp3, etc.)

### Option 2: Use FluidSynth (Best Quality)
1. Install FluidSynth: https://github.com/FluidSynth/fluidsynth/releases
2. Download a soundfont (e.g., GeneralUser GS from https://schristiancollins.com/generaluser.php)
3. Convert each file:
   ```
   fluidsynth -ni soundfont.sf2 Level1.mid -F Level1.wav -r 44100
   ffmpeg -i Level1.wav -codec:a libmp3lame -qscale:a 2 Level1.mp3
   ```

### Option 3: Use Python Script
Run the included `convert_midi_to_mp3.py` (requires FluidSynth and ffmpeg)

## Music Mapping
- **Title Screen**: Level1.mp3
- **Level 1**: Level1.mp3 (continues from title)
- **Level 2**: Level2.mp3
- **Level 3**: Level3.mp3
- **Boss Fight**: Boss.mp3

## Fallback
If MP3 files are not found, the game falls back to synthesized 8-bit chiptune music using Web Audio API.
