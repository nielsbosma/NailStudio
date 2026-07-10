import { create } from 'zustand'
import type { LengthId, ShapeId } from './lib/nailShapes'

export type Tool = 'brush' | 'eraser'

export type Stroke = {
  tool: Tool
  /** ignored for eraser strokes, which always repaint the current base colour */
  color: string
  size: number
  /** flat [x0, y0, x1, y1, ...] in nail-local coords */
  points: number[]
}

type State = {
  shape: ShapeId
  length: LengthId
  baseColor: string
  brushColor: string
  brushSize: number
  tool: Tool
  skinTone: string
  transparentBg: boolean

  strokes: Record<string, Stroke[]>
  /** nail ids in paint order, so undo can pop the globally-last stroke */
  history: string[]
  activeNail: string | null

  setShape: (s: ShapeId) => void
  setLength: (l: LengthId) => void
  setBaseColor: (c: string) => void
  setBrushColor: (c: string) => void
  setBrushSize: (n: number) => void
  setTool: (t: Tool) => void
  setSkinTone: (c: string) => void
  setTransparentBg: (v: boolean) => void

  beginStroke: (nailId: string, x: number, y: number) => void
  extendStroke: (x: number, y: number) => void
  endStroke: () => void
  undo: () => void
  clearNail: (nailId: string) => void
  clearAll: () => void
}

export const useStore = create<State>((set) => ({
  shape: 'almond',
  length: 'medium',
  baseColor: '#e8a0b8',
  brushColor: '#ffffff',
  brushSize: 4,
  tool: 'brush',
  skinTone: '#eec2a4',
  transparentBg: false,

  strokes: {},
  history: [],
  activeNail: null,

  setShape: (shape) => set({ shape }),
  setLength: (length) => set({ length }),
  setBaseColor: (baseColor) => set({ baseColor }),
  setBrushColor: (brushColor) => set({ brushColor }),
  setBrushSize: (brushSize) => set({ brushSize }),
  setTool: (tool) => set({ tool }),
  setSkinTone: (skinTone) => set({ skinTone }),
  setTransparentBg: (transparentBg) => set({ transparentBg }),

  beginStroke: (nailId, x, y) =>
    set((s) => {
      const stroke: Stroke = {
        tool: s.tool,
        color: s.brushColor,
        size: s.brushSize,
        points: [x, y],
      }
      return {
        strokes: { ...s.strokes, [nailId]: [...(s.strokes[nailId] ?? []), stroke] },
        history: [...s.history, nailId],
        activeNail: nailId,
      }
    }),

  extendStroke: (x, y) =>
    set((s) => {
      const id = s.activeNail
      if (!id) return s
      const list = s.strokes[id]
      if (!list?.length) return s
      const last = list[list.length - 1]
      const updated: Stroke = { ...last, points: [...last.points, x, y] }
      return { strokes: { ...s.strokes, [id]: [...list.slice(0, -1), updated] } }
    }),

  endStroke: () => set({ activeNail: null }),

  undo: () =>
    set((s) => {
      const history = [...s.history]
      const id = history.pop()
      if (!id) return s
      const list = (s.strokes[id] ?? []).slice(0, -1)
      return { history, strokes: { ...s.strokes, [id]: list } }
    }),

  clearNail: (nailId) =>
    set((s) => ({
      strokes: { ...s.strokes, [nailId]: [] },
      history: s.history.filter((h) => h !== nailId),
    })),

  clearAll: () => set({ strokes: {}, history: [] }),
}))
