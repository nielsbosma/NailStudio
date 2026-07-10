import type Konva from 'konva'
import { useRef } from 'react'
import { Layer, Rect, Stage } from 'react-konva'
import { useStore } from '../store'
import { HANDS } from '../lib/handModel'
import { Hand } from './Hand'
import { NAIL_HIT_PREFIX } from './Nail'

export const STAGE_W = 720
export const STAGE_H = 480
/** Headroom above the fingertips so extra-long stiletto tips aren't clipped. */
const HAND_TOP = 68

type Props = { stageRef: React.RefObject<Konva.Stage | null> }

export function Canvas({ stageRef }: Props) {
  const transparentBg = useStore((s) => s.transparentBg)
  const beginStroke = useStore((s) => s.beginStroke)
  const extendStroke = useStore((s) => s.extendStroke)
  const endStroke = useStore((s) => s.endStroke)

  /** The nail's hit shape we're painting into, so strokes can run past its edge. */
  const target = useRef<Konva.Shape | null>(null)

  const toNailLocal = (shape: Konva.Shape, pos: Konva.Vector2d) =>
    shape.getAbsoluteTransform().copy().invert().point(pos)

  const handleDown = (e: Konva.KonvaEventObject<PointerEvent>) => {
    const stage = e.target.getStage()
    const pos = stage?.getPointerPosition()
    if (!stage || !pos) return
    const shape = stage.getIntersection(pos)
    const name = shape?.name() ?? ''
    if (!shape || !name.startsWith(NAIL_HIT_PREFIX)) return

    target.current = shape
    const p = toNailLocal(shape, pos)
    beginStroke(name.slice(NAIL_HIT_PREFIX.length), p.x, p.y)
  }

  const handleMove = (e: Konva.KonvaEventObject<PointerEvent>) => {
    const shape = target.current
    if (!shape) return
    const pos = e.target.getStage()?.getPointerPosition()
    if (!pos) return
    const p = toNailLocal(shape, pos)
    extendStroke(p.x, p.y)
  }

  const handleUp = () => {
    if (!target.current) return
    target.current = null
    endStroke()
  }

  return (
    <Stage
      ref={stageRef}
      width={STAGE_W}
      height={STAGE_H}
      onPointerDown={handleDown}
      onPointerMove={handleMove}
      onPointerUp={handleUp}
      onPointerLeave={handleUp}
      style={{ cursor: 'crosshair' }}
    >
      <Layer>
        {!transparentBg && (
          <Rect x={0} y={0} width={STAGE_W} height={STAGE_H} fill="#ffffff" listening={false} />
        )}
        {HANDS.map((hand, i) => (
          <Hand key={hand} hand={hand} x={20 + i * 380} y={HAND_TOP} />
        ))}
      </Layer>
    </Stage>
  )
}
