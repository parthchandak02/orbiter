import { Stars } from '@react-three/drei'
import { COLORS } from '../data/time'

interface BackgroundProps {
  reducedMotion?: boolean
}

export default function Background({ reducedMotion = false }: BackgroundProps) {
  return (
    <>
      <color attach="background" args={[COLORS.bg]} />
      <fog attach="fog" args={[COLORS.bg, 14, 32]} />
      <Stars
        radius={80}
        depth={40}
        count={reducedMotion ? 1200 : 3000}
        factor={3}
        saturation={0.15}
        fade
        speed={reducedMotion ? 0 : 0.25}
      />
      <mesh>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshBasicMaterial color={COLORS.glow} transparent opacity={0.35} />
      </mesh>
    </>
  )
}
