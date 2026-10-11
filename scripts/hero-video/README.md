# Home hero animation

`public/videos/hero-wide.mp4` (desktop, swirl on the left) and `hero-square.mp4` (phones and tablets, swirl centered) are rendered from `scene.js`
with three.js. Each is a 12-second loop that ends exactly where it starts.

To render again (for example after changing colors or objects):

1. In this folder: `npm i --no-save three@0.170.0`, copy `src/assets/brand/anoka-mark.png` here as
   `mark.png`, then `node server.mjs` (serves http://localhost:4173).
2. Open `http://localhost:4173/?w=1920&h=1080&mode=desktop&frames=360` (or
   `?w=900&h=900&mode=mobile&frames=360`) in a browser window of exactly that size, call
   `renderFrame(n)` for n = 0 to 359 and screenshot each frame (Playwright works well).
3. Encode with ffmpeg:
   `ffmpeg -framerate 30 -i f%04d.jpg -vf scale=1600:900 -c:v libx264 -preset slow -crf 25 -pix_fmt yuv420p -movflags +faststart -an hero-wide.mp4`
   (no scale for the square version, saved as hero-square.mp4), and save frame 0 as the `.webp` poster.
