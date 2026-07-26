import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { Color } from 'three'

function SceneLights({ isMobile, accentColor }) {
  const rimLight = useRef()
  const targetColor = useMemo(() => new Color(accentColor), [accentColor])

  useFrame((_, delta) => {
    if (!rimLight.current) return
    rimLight.current.color.lerp(targetColor, 1 - Math.exp(-delta * 3))
  })

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight
        castShadow={!isMobile}
        color="#fff4e8"
        intensity={3.2}
        position={[4.5, 5.5, 5]}
        shadow-mapSize={[512, 512]}
        shadow-bias={-0.0005}
      />
      <directionalLight
        color="#8adff0"
        intensity={1.5}
        position={[-4, 1.5, 3]}
      />
      <spotLight
        ref={rimLight}
        color={accentColor}
        intensity={4}
        angle={0.6}
        penumbra={0.85}
        position={[2, 3.5, -4]}
      />
    </>
  )
}

export default SceneLights
