# Rumi Sprite Generation Experiment Log

## Goal
Generate a chibi arcade beat-em-up style sprite of Rumi matching the HUNTRIX Cover Photo aesthetic.

## Target Characteristics (from Cover Photo)
- **Proportions**: Chibi/super-deformed (big head, short legs) like Streets of Rage/Final Fight
- **Hair**: ONE massive thick purple braid hanging down from high ponytail
- **Outfit**: Bright golden yellow jacket, black shorts, platform boots with gold accents
- **Weapon**: Large glowing purple energy sword - very prominent
- **Style**: Cute K-pop idol anime aesthetic, vibrant colors

## Models Tested
1. **Stability AI Stable Image Ultra v1:1** (us-west-2)
   - Better at artistic quality, smooth rendering
   - Poor at following specific instructions (kept changing jacket color, missing sword)
   
2. **Stability AI Stable Image Core v1:1** (us-west-2) ✅ WINNER
   - Much better at prompt adherence
   - Reliably generates yellow jacket and sword when specified
   - Still struggles with "ONE braid" vs "two braids/ponytails"

## Best Results

### Top Candidate: `rumi_test_p1_core_s42.png`
✅ Yellow jacket (bright and bold)
✅ Glowing purple/yellow sword (very prominent)
✅ Chibi proportions (correct arcade style)
✅ Purple hair (vibrant)
✅ Cute K-pop aesthetic
✅ Platform boots with gold/yellow
❌ TWO ponytails instead of ONE braid

**Assessment**: 85% match to target. Only issue is hairstyle.

### Runner-up: `rumi_final_candidate.png` (if it resolves the hair)
Similar quality, testing different hair description approach.

## Key Learnings

1. **Stable Image Core > Ultra for prompt adherence** in this use case
2. **Explicit color negatives help**: "Jacket must be YELLOW, NOT purple, NOT pink"
3. **Chibi proportions require multiple references**: "Final Fight", "River City Girls", "super-deformed"
4. **The model really wants to make two ponytails/braids** - may need post-processing fix
5. **Seed variation matters** - same prompt, different seeds = different results

## Workflow Established

1. Generate high-res concept art with Stable Image Core (1024x1024)
2. Remove background programmatically
3. Crop to character bounds
4. Pixelate down to target dimensions (32x48px for single frame)
5. Create 4-frame idle animation with 1px vertical shifts

## Next Steps

- Either accept best candidate and manually adjust hair in pixel editor
- OR try image editing models to modify the hairstyle
- OR try using the Cover Photo as a more direct reference somehow

## Files Generated
- `rumi_test_p1_core_s42.png` - BEST CANDIDATE
- `rumi_test_p1_core_s123.png` - Good alternate
- `rumi_test_p1_core_s999.png` - Has demon horns (creative!)
- `rumi_final_candidate.png` - Testing refined hair prompt
- Multiple other variations in test files
