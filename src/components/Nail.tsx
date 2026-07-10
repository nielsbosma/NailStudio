import type Konva from 'konva'
import { Ellipse, Group, Line, Rect, Shape } from 'react-konva'
import { useStore } from '../store'
import { CUTICLE_INSET, NAIL_WIDTH_RATIO, fingerAngle, type Finger } from '../lib/handModel'
import { CUTICLE_BULGE, nailLength, traceNail } from '../lib/nailShapes'

export const NAIL_HIT_PREFIX = 'nail:'

type Props = { nailId: string; finger: Finger }

export function Nail({ nailId, finger }: Props) {
  const shape = useStore((s) => s.shape)
  const length = useStore((s) => s.length)
  const baseColor = useStore((s) => s.baseColor)
  const strokes = useStore((s) => s.strokes[nailId])

  const w = finger.width * NAIL_WIDTH_RATIO
  const h = nailLength(w, shape, length)

  // Inside this group the nail box is (0,0)-(w,h): tip at y=0, cuticle at y=h.
  const boxX = -w / 2
  const boxY = CUTICLE_INSET * finger.width - h

  const clip = (ctx: Konva.Context) => traceNail(ctx, w, h, shape)

  return (
    <Group x={finger.tip[0]} y={finger.tip[1]} rotation={fingerAngle(finger)}>
      <Group x={boxX} y={boxY}>
        {/* Base coat. Separate from the paint layer so the eraser can expose it. */}
        <Group clipFunc={clip} listening={false}>
          <Rect x={0} y={0} width={w} height={h * (1 + CUTICLE_BULGE * 2)} fill={baseColor} />
        </Group>

        {/* Hand-drawn paint, masked to the nail. */}
        <Group clipFunc={clip} listening={false}>
          {strokes?.map((stroke, i) => (
            <Line
              key={i}
              points={stroke.points}
              stroke={stroke.tool === 'eraser' ? baseColor : stroke.color}
              strokeWidth={stroke.size}
              lineCap="round"
              lineJoin="round"
              tension={0.35}
            />
          ))}
        </Group>

        {/* Gloss. */}
        <Group clipFunc={clip} listening={false}>
          <Ellipse
            x={w * 0.32}
            y={h * 0.3}
            radiusX={w * 0.16}
            radiusY={h * 0.22}
            fill="#ffffff"
            opacity={0.14}
            rotation={-12}
          />
        </Group>

        {/* Outline. */}
        <Shape
          listening={false}
          stroke="rgba(0,0,0,0.18)"
          strokeWidth={1}
          sceneFunc={(ctx, s) => {
            // Konva does not reset the path before sceneFunc; without this the
            // preceding clip path gets stroked too.
            ctx.beginPath()
            traceNail(ctx, w, h, shape)
            ctx.fillStrokeShape(s)
          }}
        />

        {/* Hit target: exact nail silhouette, painted only on the hit canvas. */}
        <Shape
          name={NAIL_HIT_PREFIX + nailId}
          fill="#000"
          sceneFunc={() => {}}
          hitFunc={(ctx, s) => {
            ctx.beginPath()
            traceNail(ctx, w, h, shape)
            ctx.fillStrokeShape(s)
          }}
        />
      </Group>
    </Group>
  )
}
