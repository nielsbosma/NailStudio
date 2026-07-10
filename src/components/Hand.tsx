import { Group, Line, Rect } from 'react-konva'
import { useStore } from '../store'
import { FINGERS, HAND_W, PALM, WRIST, type HandId, nailId } from '../lib/handModel'
import { Nail } from './Nail'

type Props = { hand: HandId; x: number; y: number }

export function Hand({ hand, x, y }: Props) {
  const skinTone = useStore((s) => s.skinTone)
  const mirrored = hand === 'left'

  return (
    <Group x={mirrored ? x + HAND_W : x} y={y} scaleX={mirrored ? -1 : 1}>
      {/* Silhouette: flat fills of one colour, so overlaps read as a single shape. */}
      <Rect {...WRIST} fill={skinTone} cornerRadius={WRIST.radius} listening={false} />
      <Rect {...PALM} fill={skinTone} cornerRadius={PALM.radius} listening={false} />
      {FINGERS.map((f) => (
        <Line
          key={f.id}
          points={[f.base[0], f.base[1], f.tip[0], f.tip[1]]}
          stroke={skinTone}
          strokeWidth={f.width}
          lineCap="round"
          listening={false}
        />
      ))}

      {FINGERS.map((f) => (
        <Nail key={f.id} nailId={nailId(hand, f.id)} finger={f} />
      ))}
    </Group>
  )
}
