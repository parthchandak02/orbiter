import { hourToColor } from '../data/time'

const ITEMS = [
  { label: 'midnight', hour: 0 },
  { label: 'dawn', hour: 6 },
  { label: 'noon', hour: 12 },
  { label: 'dusk', hour: 18 },
]

export default function Legend() {
  return (
    <div id="legend" aria-hidden>
      {ITEMS.map((item) => (
        <span key={item.label} className="legend-item">
          <span
            className="legend-dot"
            style={{ background: hourToColor(item.hour) }}
          />
          {item.label}
        </span>
      ))}
    </div>
  )
}
