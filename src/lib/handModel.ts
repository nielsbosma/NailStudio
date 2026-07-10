export type HandId = 'left' | 'right'
export type FingerId = 'thumb' | 'index' | 'middle' | 'ring' | 'pinky'

export type Finger = {
  id: FingerId
  /** knuckle, in hand-local coords */
  base: [number, number]
  /** centre of the fingertip's rounded cap */
  tip: [number, number]
  /** finger thickness */
  width: number
}

/** Design canvas for one hand, before it is placed on the stage. */
export const HAND_W = 300
export const HAND_H = 390

/**
 * A right hand, back-of-hand toward the viewer, fingers up, thumb on the left.
 * The left hand is this same geometry mirrored on X, which puts both thumbs
 * toward the centre of the stage.
 */
export const FINGERS: Finger[] = [
  { id: 'thumb', base: [72, 258], tip: [18, 178], width: 50 },
  { id: 'index', base: [98, 186], tip: [86, 62], width: 42 },
  { id: 'middle', base: [143, 176], tip: [141, 36], width: 44 },
  { id: 'ring', base: [187, 182], tip: [196, 58], width: 42 },
  { id: 'pinky', base: [225, 200], tip: [244, 110], width: 36 },
]

export const PALM = { x: 56, y: 150, width: 196, height: 182, radius: [46, 46, 64, 64] }
export const WRIST = { x: 92, y: 300, width: 124, height: 78, radius: [10, 10, 24, 24] }

/** Nail bed width as a fraction of finger thickness. */
export const NAIL_WIDTH_RATIO = 0.82
/**
 * How far behind the fingertip centre the cuticle sits, as a fraction of finger
 * width. The fingertip's flesh ends 0.5 widths ahead of that centre, so this
 * places the cuticle just inside the knuckle and lets long shapes (stiletto,
 * coffin) overhang the finger the way they do in life.
 */
export const CUTICLE_INSET = 0.5

/** Rotation (deg) that points a nail's tip (local -Y) along the finger. */
export function fingerAngle(f: Finger): number {
  const dx = f.tip[0] - f.base[0]
  const dy = f.tip[1] - f.base[1]
  return (Math.atan2(dy, dx) * 180) / Math.PI + 90
}

export function nailId(hand: HandId, finger: FingerId): string {
  return `${hand}-${finger}`
}

export const HANDS: HandId[] = ['left', 'right']

export const SKIN_TONES = [
  '#f6d5c0',
  '#eec2a4',
  '#dda57f',
  '#c08457',
  '#96603c',
  '#5c3a26',
]
