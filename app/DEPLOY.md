# Cole's Mobile Detailing v2.9

## Performance-first media delivery

This version keeps the original high-quality MP4 files but changes when they are requested:

- Video sources are not attached during initial page load.
- A video becomes eligible to download only when its card approaches the viewport.
- Only the centered video plays on mobile.
- Other mobile videos pause and release their source from memory.
- Posters are resized WebP files instead of oversized JPEGs.
- The Three.js/Porsche code is not requested until the visitor approaches the immersive section.
- The external HDR environment download was removed; the scene uses local lights.

## Deploy

Replace the files in the local GitHub Desktop repository with this project's contents, commit, and push.

Required model path:

`public/models/porsche/scene-optimized.glb`
