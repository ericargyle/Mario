# Mario (prototype)

A mobile-friendly browser platformer prototype (4 levels) that will evolve over time.

- Uses **Phaser 3**
- Ships with **placeholder textures** (no copyrighted assets)
- Has **placeholder music + SFX** using WebAudio oscillator tones
- Designed so you can upload/replace sprites later

## Local dev

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy (GitHub Pages)

This repo includes a GitHub Actions workflow that deploys `dist/` to GitHub Pages on every push to `main`.

After the first successful run:
- Repo → Settings → Pages → Source: **GitHub Actions**

Expected URL:
- https://ericargyle.github.io/Mario/

## Replacing sprites

See `SPRITES.md`.
