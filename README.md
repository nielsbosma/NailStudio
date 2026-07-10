# NailStudio

A nail-art sketchpad. Pick a nail shape and length, paint the ten nails, export a PNG.

Built with React, react-konva and Zustand.

```bash
npm install
npm run dev
```

## How it works

Both hands are generated, not drawn as assets. `src/lib/handModel.ts` defines one
right hand (palm, wrist, and five fingers as round-capped strokes); the left hand
is the same geometry mirrored on X, which puts both thumbs toward the centre.

`src/lib/nailShapes.ts` traces a nail into the box `(0,0)-(w,h)` with the free edge
at `y=0` and the cuticle at `y=h`. Each shape is one cubic sidewall running from the
cuticle straight into the free-edge corner, mirrored, and closed with a cuticle arc.
Where the sidewall *arrives* is what makes the shape: vertically for a square corner,
diagonally for a taper, and a taper plus a hairline free edge for a point. Length
scales `h` only, so an extra-long stiletto overhangs the fingertip the way it does
in life.

That same path is used three ways per nail (`src/components/Nail.tsx`):

- as a Konva `clipFunc`, so brush strokes are masked to the nail — you can drag well
  past the edge and only the nail is painted;
- as the outline stroke;
- as a `hitFunc`, so clicks register on the nail silhouette rather than its bounding box.

The base coat lives in its own clipped group *below* the paint layer, so the eraser
simply repaints the current base colour and stays correct when you change it later.

Strokes are stored in Zustand in nail-local coordinates, keyed by nail id
(`left-index`, `right-thumb`, …), so they follow the nail when you switch shape or
length. `history` records paint order so Undo pops the globally-last stroke.

## Export

**Export PNG** downloads the stage at 3x pixel ratio. Tick **Transparent background**
to drop the white backdrop and get the hands on alpha.
