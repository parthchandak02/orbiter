import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import type { Group, Mesh } from 'three'
import { COLORS, timeStore, updateInterpolatedTime } from '../data/time'

interface OrbitalSystemProps {
  reducedMotion?: boolean
  onSphereTap: () => void
}

const RINGS = [
  { radius: 3, color: COLORS.ringSeconds, sphereColor: COLORS.sphereSeconds, unit: 'seconds' as const },
  { radius: 5, color: COLORS.ringMinutes, sphereColor: COLORS.sphereMinutes, unit: 'minutes' as const },
  { radius: 7, color: COLORS.ringHours, sphereColor: COLORS.sphereHours, unit: 'hours' as const },
]

function angleForUnit(
  unit: 'seconds' | 'minutes' | 'hours',
  hour: number,
  minute: number,
  second: number,
): number {
  if (unit === 'seconds') return (second / 60) * Math.PI * 2 - Math.PI / 2
  if (unit === 'minutes') return ((minute + second / 60) / 60) * Math.PI * 2 - Math.PI / 2
  const h12 = hour % 12
  return ((h12 + minute / 60 + second / 3600) / 12) * Math.PI * 2 - Math.PI / 2
}

function RingWithSphere({
  radius,
  color,
  sphereColor,
  unit,
  reducedMotion,
  onSphereTap,
}: {
  radius: number
  color: string
  sphereColor: string
  unit: 'seconds' | 'minutes' | 'hours'
  reducedMotion: boolean
  onSphereTap: () => void
}) {
  const groupRef = useRef<Group>(null)
  const sphereRef = useRef<Mesh>(null)
  const angleRef = useRef(0)

  useFrame((_, delta) => {
    const t = updateInterpolatedTime()
    angleRef.current = angleForUnit(unit, t.hour, t.minute, t.second)

    if (sphereRef.current) {
      const a = angleRef.current
      sphereRef.current.position.set(
        Math.cos(a) * radius,
        Math.sin(a) * radius,
        0,
      )
    }

    if (!reducedMotion && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.04
    }
  })

  return (
    <group ref={groupRef} rotation={[Math.PI / 2, 0, 0]}>
      <mesh>
        <torusGeometry args={[radius, 0.04, 16, 96]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} />
      </mesh>
      <mesh
        ref={sphereRef}
        onClick={(e) => {
          e.stopPropagation()
          onSphereTap()
        }}
      >
        <sphereGeometry args={[0.15, 24, 24]} />
        <meshBasicMaterial color={sphereColor} transparent opacity={0.9} />
      </mesh>
    </group>
  )
}

export default function OrbitalSystem({ reducedMotion = false, onSphereTap }: OrbitalSystemProps) {
  const labelRef = useRef<Group>(null)

  useFrame(() => {
    updateInterpolatedTime()
    if (labelRef.current) {
      labelRef.current.rotation.y += reducedMotion ? 0 : 0.002
    }
  })

  const tzLabel = timeStore.timeZone.split('/').pop()?.replace(/_/g, ' ') ?? 'LA'

  return (
    <group>
      {RINGS.map((ring) => (
        <RingWithSphere
          key={ring.unit}
          radius={ring.radius}
          color={ring.color}
          sphereColor={ring.sphereColor}
          unit={ring.unit}
          reducedMotion={reducedMotion}
          onSphereTap={onSphereTap}
        />
      ))}
      <group ref={labelRef} position={[0, 0.3, 0]}>
        <Text
          fontSize={0.35}
          color={COLORS.glow}
          anchorX="center"
          anchorY="middle"
          fillOpacity={0.5}
        >
          {tzLabel}
        </Text>
      </group>
    </group>
  )
}
