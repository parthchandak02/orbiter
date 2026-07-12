import { useEffect, useRef } from 'react'
import { COLORS, formatHHMMSS, timeStore, updateInterpolatedTime } from '../data/time'

export default function HeroTime() {
  const elRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frame = 0
    const tick = () => {
      const t = updateInterpolatedTime()
      if (elRef.current) {
        elRef.current.textContent = formatHHMMSS(t.hour, t.minute, t.second)
      }
      frame = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(frame)
  }, [])

  const initial = formatHHMMSS(
    timeStore.current.hour,
    timeStore.current.minute,
    timeStore.current.second,
  )

  return (
    <div
      id="hero"
      ref={elRef}
      style={{
        fontSize: 56,
        fontWeight: 700,
        color: COLORS.textBright,
        lineHeight: 1,
        letterSpacing: '-0.02em',
        textShadow: `0 0 30px ${COLORS.dimGlow}`,
      }}
    >
      {initial}
    </div>
  )
}
