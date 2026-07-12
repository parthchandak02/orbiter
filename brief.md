# orbiter — 3D Celestial Orrery Clock

## Concept
Three concentric glowing rings orbit in deep space — seconds (cyan, innermost), minutes (amber, middle), hours (gold, outermost). A single glowing sphere travels each ring at the current time value. The hero time number glows at center. Tap any ring to see timezone data.

**Metaphor family:** mechanical/orrery (celestial clock mechanism)
**Narrative pattern:** Flow (time as orbital motion) + Annotation (hero number at center)
**Tier 2 Patterns:** Hero Number (C) + Quiet Zone (A)

## Data Source
- API: `https://timeapi.io/api/Time/current/zone?timeZone=America/Los_Angeles`
- Poll: fetch once on load, then interpolate locally via performance.now() delta. Re-fetch every 60s for accuracy.
- Fields used: hour, minute, seconds, timeZone, dayOfWeek, dateTime
- Fallback: if API fails, start from Date.now() local time, labeled "fallback"

### Fetch pattern (poll on load, then interpolate):
```ts
async function fetchTime(): Promise<TimeData> {
  const res = await fetch(TIME_API_URL)
  if (!res.ok) throw new Error('API failed')
  return res.json()
}
// Store fetchTimestamp + serverTime on success
// On each frame: elapsed = (performance.now() - fetchTimestamp) / 1000
// currentTime = serverTime + elapsed (in seconds)
// Update hour/minute/second from currentTime
```

## Visual Style
**Preset:** Dark — Void adapted (celestial/mechanical with warm gold accents)

**Palette (JS const):**
```ts
const COLORS = {
  bg: '#0a0a0f',         // deep space black-blue
  ringSeconds: '#4dd0e1', // cyan
  ringMinutes: '#ffab40', // amber
  ringHours: '#ffd54f',   // warm gold
  sphereSeconds: '#80deea', // light cyan
  sphereMinutes: '#ffcc80', // light amber
  sphereHours: '#fff9c4',   // pale gold
  glow: '#fff9c4',        // pale gold glow
  text: 'rgba(255,255,255,0.6)',
  textBright: 'rgba(255,255,255,0.9)',
  dimGlow: 'rgba(255,255,255,0.08)',
}
```

**Coherence tokens:**
- strokeWeightScale: { hair: 0.5, fine: 1, medium: 2 }
- alphaHierarchy: { bg: 1, ring: 0.7, sphere: 0.9, chrome: 0.5 }
- shapeLanguage: geometric (circles, arcs, rings — no organic curves)
- glowBudget: 1 glow color (pale gold), blur ≤ 30px, max 3 glowing elements/frame
- accent color: ONE (warm gold). Cyan/amber are data encodings, not accents.

## Three Dials
- DESIGN_VARIANCE: 2 (perfect concentric symmetry, ordered ring positions, angular precision)
- MOTION_INTENSITY: 3 (gentle — spheres orbit at their time pace, ambient ring rotation)
- VISUAL_DENSITY: 2 (sparse — 3 rings, 3 spheres, hero number, chrome)

## Encoding Contract
| Data Field | Visual Channel | Range | Inverse Function | "Bigger/faster means..." | Legend? |
|---|---|---|---|---|---|
| hour (0-23) | outer ring sphere angular position | 0-2π (remapped to 12h clock) | angle→(angle/(2π))*12 | later in the day | no (physical — sphere position = hour) |
| minute (0-59) | middle ring sphere angular position | 0-2π | angle→(angle/(2π))*60 | later in the minute | no (physical) |
| second (0-59) | inner ring sphere angular position | 0-2π | angle→(angle/(2π))*60 | later in the second | no (physical) |
| time of day (hour) | ring color temperature | midnight cool blue → dawn warm gold → noon bright white → dusk amber → midnight cool blue | colorToHour(h) | midday is brightest, midnight is coolest | yes (mini legend showing color→time) |

## Creative Scene (R3F)
- **Primary metaphor:** Three orbital rings in deep space — a celestial clock mechanism
- **drei components:** TorusGeometry for rings, SphereGeometry for orbiting spheres, Stars for background, OrbitControls
- **Stars background:** `@react-three/drei Stars` component for space atmosphere
- **Ring structure:** Three Torus geometries at increasing radius (3, 5, 7 units). Each has thin glowing cross-section (tube radius 0.04). MeshBasicMaterial with respective colors and opacity 0.5.
- **Orbiting spheres:** Small SphereGeometry (radius 0.15) on each ring path. Position computed from current time value mapped to angle.
- **Center glow:** Subtle point light or small glowing sphere at origin
- **Hero number:** `drei Text` component showing current time in large font at center or top
- **Default camera:** Position (0, 4, 10), looking at origin. Angled slightly down to see all rings.
- **Interaction:** Tap any ring sphere → Quiet Zone shows timezone data. OrbitControls for free orbit.

## UX Chrome (positioned via CSS, not inside Canvas)
- `#hero` — top-left; 56px; color COLORS.textBright; shows HH:MM:SS
- `#desc` — bottom: 68px; center; max-width 65ch; 11px; color COLORS.text
- `#legend` — bottom: 44px; center; 9px; color COLORS.text
- `#stamp` — bottom: 20px; left: 16px; 10px; color COLORS.text
- `#quietzone` — floating detail panel, fades after 4s idle, positioned center-screen

Font: `system-ui, sans-serif` on all chrome. No em-dashes — use hyphens.

## Component structure (Stellar pattern — replicate this EXACTLY)
```
src/
  App.tsx          — Canvas → Suspense → Background → OrbitalSystem → OrbitControls + Chrome overlay
  main.tsx         — ReactDOM render
  styles.css       — fullscreen styles + chrome positioning
  components/
    OrbitalSystem.tsx  — Three rings + orbiting spheres + time interpolation
    Background.tsx     — Stars backdrop + ambient glow
    HeroTime.tsx       — Hero number (HH:MM:SS) DOM overlay
    DataStamp.tsx      — Source + freshness stamp
    Description.tsx    — #desc text
    Legend.tsx         — color→time legend mini
    QuietZone.tsx      — detail panel, fades after 4s
  data/
    time.ts            — fetchTime() + interpolation logic
```

## Interaction
- **Tap on sphere** — Quiet Zone shows timezone, dayOfWeek, dateTime, and "View on TimeAPI →" link
- **OrbitControls** — free orbit, pinch zoom, touch drag
- **Auto-animation** — spheres orbit continuously, controlled by useRef (not useState)
- **Reduced motion** — static frame shows current sphere positions, no rotation animation

## Communication Requirements
**Tier 1 (mandatory):**
1. Data stamp: "TimeAPI · Los Angeles · HH:MM:SS · updated Xs ago"
2. Data honesty: fallback labeled "fallback", never "live"
3. Physical metaphor: rings = time units, sphere position = current value

**Tier 2 (pick 2):**
4. ✅ Hero Number (56px HH:MM:SS at top-left)
5. ✅ Quiet Zone (tap ring sphere → timezone detail panel, fades 4s)

## Build Requirements (R3F)
1. Vite + React + TypeScript scaffold
2. `npm install three @react-three/fiber @react-three/drei @types/three maath`
3. Delete src/index.css and src/App.css after scaffold (Vite default breaks fullscreen)
4. Single styles.css with fullscreen Canvas + chrome positioning
5. DPR: `gl.setPixelRatio(Math.min(window.devicePixelRatio, 2))`
6. Mobile: `<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">`
7. Canvas: `<Canvas dpr={[1, 2]} gl={{ antialias: true }}>`
8. Use refs, not state, in useFrame for animation values
9. MeshBasicMaterial for all colored elements (no lights needed)
10. Reduced motion: `frameloop='demand'` when `prefers-reduced-motion: reduce`
11. .nojekyll file at project root
12. No em-dashes in any text

## Cursor Prompt
```
FIRST: Read ~/projects/stellar/src/App.tsx, ~/projects/stellar/src/main.tsx,
~/projects/stellar/src/styles.css -- understand the exact component structure,
data fetching pattern, overlay chrome pattern.

THEN: Read brief.md in this workspace.

BUILD: Create the orbiter app matching brief.md using the SAME architecture as Stellar.
The app is a 3D celestial orrery clock with three concentric rings for hours/minutes/seconds.
Use drei OrbitControls, Stars, TorusGeometry for rings, SphereGeometry for spheres.
Hero number (HH:MM:SS) as DOM overlay. Quiet Zone on tap. No controls panel.
npm run build must succeed.
```

## Deploy
- Slug: orbiter
- URL: https://orbiter.parthchandak.info
