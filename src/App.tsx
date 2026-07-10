import type Konva from 'konva'
import { useRef } from 'react'
import { Canvas } from './components/Canvas'
import { Toolbar } from './components/Toolbar'
import { useStore } from './store'

export default function App() {
  const stageRef = useRef<Konva.Stage>(null)

  const handleExport = () => {
    const stage = stageRef.current
    if (!stage) return
    const uri = stage.toDataURL({ pixelRatio: 3 })
    const { shape, length } = useStore.getState()
    const link = document.createElement('a')
    link.download = `nail-studio-${shape}-${length}.png`
    link.href = uri
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  return (
    <div className="app">
      <Toolbar onExport={handleExport} />
      <main className="stage-wrap">
        <Canvas stageRef={stageRef} />
        <p className="hint center">Click and drag on any nail to paint. Strokes stay inside the nail.</p>
      </main>
    </div>
  )
}
