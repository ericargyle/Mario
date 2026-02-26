# Sprites & Audio (drop-in)

This repo starts with **placeholder, programmatically-generated textures** (no copyrighted assets).

You can replace them later by adding files into:

- `public/assets/`

and then updating `src/mario.js` to load them.

## Suggested filenames

- `public/assets/player.png` ✅ (wired up now)
- `public/assets/ground.png` (not wired yet)
- `public/assets/block.png` (not wired yet)
- `public/assets/coin.png` (not wired yet)
- `public/assets/flag.png` (not wired yet)

## Where to wire them in

- Player is already wired: `public/assets/player.png`
- Others: add `this.load.image(...)` in `preload()` and keep the same keys (`ground`, `block`, `coin`, `flag`).

## Audio

This prototype uses WebAudio oscillator tones for music + SFX.

Later you can add:
- `public/assets/music.mp3`
- `public/assets/jump.wav`
- `public/assets/coin.wav`
- `public/assets/win.wav`

and switch the `AudioBus` to play those instead.
