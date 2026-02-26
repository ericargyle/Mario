# Sprites & Audio (drop-in)

This repo starts with **placeholder, programmatically-generated textures** (no copyrighted assets).

You can replace them later by adding files into:

- `public/assets/`

and then updating `src/mario.js` to load them.

## Suggested filenames

- `public/assets/player.png`
- `public/assets/ground.png`
- `public/assets/block.png`
- `public/assets/coin.png`
- `public/assets/flag.png`

## Where to wire them in

In `src/mario.js`, replace `makePlaceholderTextures(scene)` with `scene.load.image(...)` calls in a preload step.

## Audio

This prototype uses WebAudio oscillator tones for music + SFX.

Later you can add:
- `public/assets/music.mp3`
- `public/assets/jump.wav`
- `public/assets/coin.wav`
- `public/assets/win.wav`

and switch the `AudioBus` to play those instead.
