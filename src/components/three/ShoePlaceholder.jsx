import { RoundedBox } from '@react-three/drei'
import { useMemo } from 'react'
import { Shape } from 'three'

function ShoePlaceholder({
  accentColor = '#ff5a0a',
}) {
  const upperShape = useMemo(() => {
    const shape = new Shape()
    shape.moveTo(-1.95, -0.38)
    shape.quadraticCurveTo(-2.15, -0.1, -1.78, 0.12)
    shape.quadraticCurveTo(-1.25, 0.38, -0.62, 0.48)
    shape.lineTo(0.25, 0.62)
    shape.lineTo(0.72, 0.98)
    shape.quadraticCurveTo(0.9, 1.18, 1.2, 1.08)
    shape.lineTo(1.7, 0.9)
    shape.quadraticCurveTo(1.92, 0.82, 1.96, 0.52)
    shape.lineTo(2.02, -0.18)
    shape.quadraticCurveTo(1.68, -0.42, 1.08, -0.42)
    shape.closePath()
    return shape
  }, [])

  const extrudeSettings = useMemo(
    () => ({
      depth: 1.02,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.08,
      bevelThickness: 0.08,
      curveSegments: 8,
      steps: 1,
    }),
    [],
  )

  return (
    <group>
      <RoundedBox
        args={[4.55, 0.5, 1.3]}
        radius={0.22}
        smoothness={3}
        position={[0, -0.68, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#faf8f2" roughness={0.34} metalness={0.04} />
      </RoundedBox>

      <mesh position={[0, -0.08, -0.51]} castShadow receiveShadow>
        <extrudeGeometry args={[upperShape, extrudeSettings]} />
        <meshStandardMaterial color="#e8e4dc" roughness={0.43} />
      </mesh>

      <mesh position={[-0.25, 0.14, 0.62]} rotation={[0, 0, -0.03]} castShadow>
        <planeGeometry args={[2.7, 0.46]} />
        <meshStandardMaterial color={accentColor} roughness={0.32} />
      </mesh>

      <mesh position={[1.4, 0.4, 0.63]} castShadow>
        <planeGeometry args={[0.64, 0.72]} />
        <meshStandardMaterial color="#75d9e8" roughness={0.4} />
      </mesh>

      {[-0.82, -0.42, -0.02, 0.38].map((x) => (
        <mesh key={x} position={[x, 0.58, 0.66]} rotation={[0, 0, 1.08]} castShadow>
          <capsuleGeometry args={[0.035, 0.58, 4, 8]} />
          <meshStandardMaterial color="#ffffff" roughness={0.28} />
        </mesh>
      ))}
    </group>
  )
}

export default ShoePlaceholder
