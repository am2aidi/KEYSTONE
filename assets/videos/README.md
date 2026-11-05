# Keystone Architects Video Directory

Place your video files in this folder to have them automatically stream in the top video header reel:

- `video1.mp4` : Slide 01 (e.g. Modern Residential Villa / Pergola Villa)
- `video2.mp4` : Slide 02 (e.g. Nyarutarama Glass Atrium / Spatial Light)
- `video3.mp4` : Slide 03 (e.g. Commercial High-Rise Tower / Construction Site)
- `video4.mp4` : Slide 04 (e.g. Bespoke Luxury Interior & Lighting)

### How It Works:
The video header automatically detects when one video finishes (`ended` event) and smoothly scrolls to the right to the next video slide.
You can also use external MP4 URLs in `js/app.js` under `window.headerVideoSlides`.
