import { useStore } from '../store'
import { SKIN_TONES } from '../lib/handModel'
import { LENGTHS, LENGTH_ORDER, SHAPES, SHAPE_ORDER } from '../lib/nailShapes'

const PALETTE = [
  '#ffffff',
  '#f8e1e7',
  '#e8a0b8',
  '#d6336c',
  '#a61e4d',
  '#ff8fab',
  '#ffd6a5',
  '#c9a227',
  '#b8b8ff',
  '#7048e8',
  '#4dabf7',
  '#20c997',
  '#495057',
  '#1a1a1a',
]

type Props = { onExport: () => void }

export function Toolbar({ onExport }: Props) {
  const s = useStore()

  return (
    <aside className="toolbar">
      <h1>Nail Studio</h1>

      <section>
        <label>Shape</label>
        <div className="pills">
          {SHAPE_ORDER.map((id) => (
            <button
              key={id}
              className={`pill${s.shape === id ? ' active' : ''}`}
              onClick={() => s.setShape(id)}
            >
              {SHAPES[id].label}
            </button>
          ))}
        </div>
      </section>

      <section>
        <label>Length</label>
        <div className="segmented">
          {LENGTH_ORDER.map((id) => (
            <button
              key={id}
              className={`segment${s.length === id ? ' active' : ''}`}
              onClick={() => s.setLength(id)}
            >
              {LENGTHS[id].label}
            </button>
          ))}
        </div>
      </section>

      <section>
        <label>Base coat</label>
        <Swatches value={s.baseColor} onChange={s.setBaseColor} />
      </section>

      <section>
        <label>Tool</label>
        <div className="segmented">
          <button
            className={`segment${s.tool === 'brush' ? ' active' : ''}`}
            onClick={() => s.setTool('brush')}
          >
            Brush
          </button>
          <button
            className={`segment${s.tool === 'eraser' ? ' active' : ''}`}
            onClick={() => s.setTool('eraser')}
          >
            Eraser
          </button>
        </div>
        <div className="row">
          <span className="hint">Size</span>
          <input
            type="range"
            min={1}
            max={16}
            step={1}
            value={s.brushSize}
            onChange={(e) => s.setBrushSize(Number(e.target.value))}
          />
          <span className="hint num">{s.brushSize}</span>
        </div>
      </section>

      <section>
        <label>Brush colour</label>
        <Swatches value={s.brushColor} onChange={s.setBrushColor} />
      </section>

      <section>
        <label>Skin tone</label>
        <div className="swatches">
          {SKIN_TONES.map((c) => (
            <button
              key={c}
              className={`swatch${s.skinTone === c ? ' active' : ''}`}
              style={{ background: c }}
              onClick={() => s.setSkinTone(c)}
              aria-label={c}
            />
          ))}
        </div>
      </section>

      <section className="actions">
        <button className="btn" onClick={s.undo} disabled={!s.history.length}>
          Undo
        </button>
        <button className="btn" onClick={s.clearAll} disabled={!s.history.length}>
          Clear
        </button>
        <button className="btn primary" onClick={onExport}>
          Export PNG
        </button>
        <label className="check">
          <input
            type="checkbox"
            checked={s.transparentBg}
            onChange={(e) => s.setTransparentBg(e.target.checked)}
          />
          Transparent background
        </label>
      </section>
    </aside>
  )
}

function Swatches({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  return (
    <div className="swatches">
      {PALETTE.map((c) => (
        <button
          key={c}
          className={`swatch${value === c ? ' active' : ''}`}
          style={{ background: c }}
          onClick={() => onChange(c)}
          aria-label={c}
        />
      ))}
      <label className="swatch custom" style={{ background: value }}>
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} />
      </label>
    </div>
  )
}
