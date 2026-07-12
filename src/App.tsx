import { Suspense, useCallback, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Background from './components/Background'
import DataStamp from './components/DataStamp'
import Description from './components/Description'
import HeroTime from './components/HeroTime'
import Legend from './components/Legend'
import OrbitalSystem from './components/OrbitalSystem'
import QuietZone from './components/QuietZone'
import { applyTimeSnapshot, fetchTime } from './data/time'
import './styles.css'

const POLL_MS = 60_000

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = () => setReduced(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return reduced
}

export default function App() {
  const [quietVisible, setQuietVisible] = useState(false)
  const reducedMotion = useReducedMotion()

  const loadTime = useCallback(async () => {
    const result = await fetchTime()
    applyTimeSnapshot(result.data, result.source)
  }, [])

  useEffect(() => {
    void loadTime()
    const poll = setInterval(() => void loadTime(), POLL_MS)
    return () => clearInterval(poll)
  }, [loadTime])

  const handleSphereTap = useCallback(() => {
    setQuietVisible(true)
  }, [])

  const handleBackgroundTap = useCallback(() => {
    setQuietVisible(false)
  }, [])

  const handleHideQuiet = useCallback(() => {
    setQuietVisible(false)
  }, [])

  return (
    <>
      <Canvas
        className="orbiter-canvas"
        dpr={[1, 2]}
        camera={{ position: [0, 4, 10], fov: 50, near: 0.1, far: 100 }}
        gl={{ antialias: true }}
        onCreated={({ gl }) => {
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        }}
        frameloop={reducedMotion ? 'demand' : 'always'}
        onPointerMissed={handleBackgroundTap}
      >
        <Suspense fallback={null}>
          <Background reducedMotion={reducedMotion} />
          <OrbitalSystem
            reducedMotion={reducedMotion}
            onSphereTap={handleSphereTap}
          />
          <OrbitControls
            enablePan={false}
            enableZoom
            minDistance={4}
            maxDistance={20}
          />
        </Suspense>
      </Canvas>

      <HeroTime />
      <DataStamp />
      <Description />
      <Legend />
      <QuietZone visible={quietVisible} onHide={handleHideQuiet} />
    </>
  )
}
