import { useEffect, useRef } from 'react'
import { cityFromTimeZone, formatHHMMSS, updateInterpolatedTime } from '../data/time'

export default function DataStamp() {
  const elRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frame = 0
    const tick = () => {
      const t = updateInterpolatedTime()
      if (elRef.current) {
        const sourceLabel = t.source === 'timeapi' ? 'TimeAPI' : 'fallback'
        const city = cityFromTimeZone(t.timeZone)
        const clock = formatHHMMSS(t.hour, t.minute, t.second)
        const ago = Math.floor(t.secondsAgo)
        elRef.current.textContent = `${sourceLabel} · ${city} · ${clock} · updated ${ago}s ago`
      }
      frame = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(frame)
  }, [])

  return <div id="stamp" ref={elRef} />
}
