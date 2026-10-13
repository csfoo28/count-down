# Countdown

A precise, installable countdown timer web app. No build step, no dependencies to install.

## Features

- Run up to 8 timers at once, each up to 23:59:59
- Presets (10 s to 1 h) and a custom hours/minutes/seconds form, with optional names
- Six display styles: Digital, Flip, Ring, Clock, Hourglass, Bar
- Repeat mode with round counter
- Alarm, optional ticking sound, mute, vibration and a system notification when a timer finishes in the background
- Timers survive reloads and closing the tab; ones that finish while you are away are reported on return
- Screen wake lock while a timer runs
- Dark and light themes, reduced-motion support
- Installable PWA that works offline (GSAP and fonts are self-hosted in `vendor/`)

## Run locally

```sh
npx serve -p 3000 .
```

Then open <http://localhost:3000>. A service worker only registers on `localhost` or HTTPS.

## Keyboard shortcuts

| Key | Action |
| --- | --- |
| `Space` | Pause / resume |
| `R` | Restart |
| `[` `]` | Switch timer |
| `Esc` | Add timer / back to timers |
| `M` | Mute |
| `T` | Ticking sound on/off |

## Releasing

Bump `CACHE` in `sw.js` (for example `countdown-v3`) whenever you change a precached file, so installed copies pick up the update.

## Layout

```
index.html        app (markup, styles, script)
sw.js             service worker (offline cache)
manifest.json     PWA manifest
vendor/           self-hosted GSAP and fonts
assets/ icons/    favicons and app icons
```
