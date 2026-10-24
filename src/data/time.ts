export const TIME_ZONE = 'America/Los_Angeles'

export const TIME_API_URL =
  `https://timeapi.io/api/Time/current/zone?timeZone=${TIME_ZONE}`

/** "America/Los_Angeles" -> "Los Angeles"; anything without a slash is returned as-is. */
export function cityFromTimeZone(timeZone: string): string {
  return timeZone.split('/').pop()?.replace(/_/g, ' ') || timeZone
}

export const COLORS = {
  bg: '#0a0a0f',
  ringSeconds: '#4dd0e1',
  ringMinutes: '#ffab40',
  ringHours: '#ffd54f',
  sphereSeconds: '#80deea',
  sphereMinutes: '#ffcc80',
  sphereHours: '#fff9c4',
  glow: '#fff9c4',
  text: 'rgba(255,255,255,0.6)',
  textBright: 'rgba(255,255,255,0.9)',
  dimGlow: 'rgba(255,255,255,0.08)',
} as const

export interface TimeData {
  hour: number
  minute: number
  seconds: number
  timeZone: string
  dayOfWeek: string
  dateTime: string
}

export type TimeSource = 'timeapi' | 'fallback'

export interface InterpolatedTime {
  hour: number
  minute: number
  second: number
  timeZone: string
  dayOfWeek: string
  dateTime: string
  source: TimeSource
  secondsAgo: number
}

export const timeStore: {
  fetchPerfMs: number
  baseTotalSeconds: number
  timeZone: string
  dayOfWeek: string
  dateTime: string
  source: TimeSource
  current: InterpolatedTime
} = {
  fetchPerfMs: performance.now(),
  baseTotalSeconds: 0,
  timeZone: TIME_ZONE,
  dayOfWeek: '',
  dateTime: '',
  source: 'fallback',
  current: {
    hour: 0,
    minute: 0,
    second: 0,
    timeZone: TIME_ZONE,
    dayOfWeek: '',
    dateTime: '',
    source: 'fallback',
    secondsAgo: 0,
  },
}

function totalSecondsFromParts(hour: number, minute: number, seconds: number): number {
  return hour * 3600 + minute * 60 + seconds
}

function partsFromTotalSeconds(total: number): { hour: number; minute: number; second: number } {
  const wrapped = ((total % 86400) + 86400) % 86400
  const hour = Math.floor(wrapped / 3600)
  const minute = Math.floor((wrapped % 3600) / 60)
  const second = wrapped % 60
  return { hour, minute, second }
}

// Browser clock converted to the same zone the API is asked for, so the
// fallback shows the same place the stamp and centre label name.
function fallbackTimeData(): TimeData {
  const now = new Date()
  const parts: Record<string, string> = {}
  for (const p of new Intl.DateTimeFormat('en-US', {
    timeZone: TIME_ZONE,
    hourCycle: 'h23',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    weekday: 'long',
  }).formatToParts(now)) {
    parts[p.type] = p.value
  }
  return {
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    seconds: Number(parts.second) + now.getMilliseconds() / 1000,
    timeZone: TIME_ZONE,
    dayOfWeek: parts.weekday,
    dateTime: now.toISOString(),
  }
}

export async function fetchTime(): Promise<{
  data: TimeData
  source: TimeSource
}> {
  try {
    const res = await fetch(TIME_API_URL)
    if (!res.ok) throw new Error('API failed')
    const json = (await res.json()) as TimeData
    return { data: json, source: 'timeapi' }
  } catch {
    return { data: fallbackTimeData(), source: 'fallback' }
  }
}

export function applyTimeSnapshot(data: TimeData, source: TimeSource): void {
  timeStore.fetchPerfMs = performance.now()
  timeStore.baseTotalSeconds = totalSecondsFromParts(data.hour, data.minute, data.seconds)
  timeStore.timeZone = data.timeZone
  timeStore.dayOfWeek = data.dayOfWeek
  timeStore.dateTime = data.dateTime
  timeStore.source = source
  updateInterpolatedTime()
}

export function updateInterpolatedTime(): InterpolatedTime {
  const elapsed = (performance.now() - timeStore.fetchPerfMs) / 1000
  const total = timeStore.baseTotalSeconds + elapsed
  const { hour, minute, second } = partsFromTotalSeconds(total)

  timeStore.current = {
    hour,
    minute,
    second,
    timeZone: timeStore.timeZone,
    dayOfWeek: timeStore.dayOfWeek,
    dateTime: timeStore.dateTime,
    source: timeStore.source,
    secondsAgo: elapsed,
  }

  return timeStore.current
}

export function formatHHMMSS(hour: number, minute: number, second: number): string {
  const h = Math.floor(hour).toString().padStart(2, '0')
  const m = Math.floor(minute).toString().padStart(2, '0')
  const s = Math.floor(second).toString().padStart(2, '0')
  return `${h}:${m}:${s}`
}

export function hourToColor(hour: number): string {
  const h = hour % 24
  if (h < 5) return '#5c6bc0'
  if (h < 8) return '#ffd54f'
  if (h < 12) return '#fffde7'
  if (h < 17) return '#ffffff'
  if (h < 20) return '#ffab40'
  return '#5c6bc0'
}
