import { useEffect, useRef } from 'react'
import { COLORS, TIME_API_URL, timeStore } from '../data/time'

interface QuietZoneProps {
  visible: boolean
  onHide: () => void
}

export default function QuietZone({ visible, onHide }: QuietZoneProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (visible) {
      timerRef.current = setTimeout(onHide, 4000)
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [visible, onHide])

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 20,
    fontSize: 13,
    marginBottom: 8,
  }

  const labelStyle: React.CSSProperties = {
    opacity: 0.5,
  }

  const valueStyle: React.CSSProperties = {
    fontWeight: 600,
    color: COLORS.glow,
    textAlign: 'right',
  }

  return (
    <div
      id="quietzone"
      style={{ opacity: visible ? 1 : 0 }}
      aria-hidden={!visible}
    >
      <div style={rowStyle}>
        <span style={labelStyle}>Timezone</span>
        <span style={valueStyle}>{timeStore.timeZone}</span>
      </div>
      <div style={rowStyle}>
        <span style={labelStyle}>Day</span>
        <span style={valueStyle}>{timeStore.dayOfWeek}</span>
      </div>
      <div style={{ ...rowStyle, marginBottom: 12 }}>
        <span style={labelStyle}>DateTime</span>
        <span style={valueStyle}>{timeStore.dateTime}</span>
      </div>
      <a
        href={TIME_API_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontSize: 12,
          color: COLORS.textBright,
          textDecoration: 'none',
          pointerEvents: visible ? 'auto' : 'none',
        }}
      >
        View on TimeAPI →
      </a>
    </div>
  )
}
