export type ShapeId =
  | 'round'
  | 'square'
  | 'oval'
  | 'almond'
  | 'stiletto'
  | 'coffin'
  | 'squoval'

export type LengthId = 'short' | 'medium' | 'long' | 'xlong'

type ShapeDef = {
  label: string
  /** width of the free edge as a fraction of the nail bed width */
  tipWidth: number
  /**
   * The sidewall runs from the cuticle straight to the free-edge corner as one
   * cubic. Its two control points set the whole silhouette:
   *  - sideBase (y, fraction of length): holds the wall vertical near the cuticle
   *  - sideCpX (fraction of the corner's x) + sideCpY (fraction of length):
   *    the direction the wall arrives from. Arriving vertically gives a square
   *    corner; arriving diagonally gives a taper, and a taper plus a hairline
   *    free edge gives a point. No separate "shoulder" to kink against.
   */
  sideBase: number
  sideCpX: number
  sideCpY: number
  /** how far the free edge domes forward, as a fraction of length */
  edgeArc: number
  /** nail length / nail width at "medium" length */
  aspect: number
}

export const SHAPES: Record<ShapeId, ShapeDef> = {
  square: { label: 'Square', tipWidth: 0.92, sideBase: 0.62, sideCpX: 0.95, sideCpY: 0.1, edgeArc: 0, aspect: 1.2 },
  squoval: { label: 'Squoval', tipWidth: 0.84, sideBase: 0.62, sideCpX: 0.85, sideCpY: 0.16, edgeArc: 0.025, aspect: 1.22 },
  round: { label: 'Round', tipWidth: 0.6, sideBase: 0.62, sideCpX: 0.7, sideCpY: 0.26, edgeArc: 0.1, aspect: 1.12 },
  oval: { label: 'Oval', tipWidth: 0.34, sideBase: 0.62, sideCpX: 0.55, sideCpY: 0.34, edgeArc: 0.09, aspect: 1.3 },
  almond: { label: 'Almond', tipWidth: 0.12, sideBase: 0.6, sideCpX: 0.38, sideCpY: 0.42, edgeArc: 0.05, aspect: 1.45 },
  stiletto: { label: 'Stiletto', tipWidth: 0.03, sideBase: 0.55, sideCpX: 0.28, sideCpY: 0.56, edgeArc: 0.02, aspect: 1.8 },
  // straight tapering walls: pull the cuticle-side control down so it stops bowing
  coffin: { label: 'Coffin', tipWidth: 0.5, sideBase: 0.4, sideCpX: 0.92, sideCpY: 0.3, edgeArc: 0, aspect: 1.55 },
}

export const SHAPE_ORDER: ShapeId[] = [
  'round',
  'square',
  'oval',
  'almond',
  'stiletto',
  'coffin',
  'squoval',
]

export const LENGTHS: Record<LengthId, { label: string; scale: number }> = {
  short: { label: 'Short', scale: 0.72 },
  medium: { label: 'Medium', scale: 1 },
  long: { label: 'Long', scale: 1.3 },
  xlong: { label: 'Extra Long', scale: 1.62 },
}

export const LENGTH_ORDER: LengthId[] = ['short', 'medium', 'long', 'xlong']

/** How far the cuticle arc bulges past the nail box, as a fraction of length. */
export const CUTICLE_BULGE = 0.05

export function nailLength(width: number, shape: ShapeId, length: LengthId): number {
  return width * SHAPES[shape].aspect * LENGTHS[length].scale
}

/** The path-command subset shared by CanvasRenderingContext2D and Konva.Context. */
export interface PathSink {
  moveTo(x: number, y: number): void
  bezierCurveTo(a: number, b: number, c: number, d: number, e: number, f: number): void
  quadraticCurveTo(a: number, b: number, c: number, d: number): void
  closePath(): void
}

/**
 * Traces a nail outline into `ctx` inside the box (0,0)-(w,h).
 * The free edge (tip) is at y=0, the cuticle at y=h.
 * Only issues path commands: no beginPath/fill — callers decide.
 */
export function traceNail(ctx: PathSink, w: number, h: number, shape: ShapeId): void {
  const { tipWidth, sideBase, sideCpX, sideCpY, edgeArc } = SHAPES[shape]
  const tw = tipWidth * w
  const lx = (w - tw) / 2
  const rx = (w + tw) / 2

  // Corners sit at +edgeArc so the domed edge peaks at exactly y = 0: every
  // shape fills its box, and `h` really is the nail's length.
  const cornerY = edgeArc * h

  ctx.moveTo(0, h)
  // left sidewall: vertical at the cuticle, running into the free-edge corner
  ctx.bezierCurveTo(0, h * sideBase, lx * sideCpX, h * sideCpY, lx, cornerY)
  // free edge
  ctx.quadraticCurveTo(w / 2, -cornerY, rx, cornerY)
  // right sidewall (mirror of the left)
  ctx.bezierCurveTo(w - lx * sideCpX, h * sideCpY, w, h * sideBase, w, h)
  // cuticle arc
  ctx.quadraticCurveTo(w / 2, h * (1 + CUTICLE_BULGE * 2), 0, h)
  ctx.closePath()
}
