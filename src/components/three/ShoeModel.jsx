import { Center, Clone, useGLTF } from '@react-three/drei'
import { useRef } from 'react'
import useShoeMotion from '../../hooks/useShoeMotion.js'

function ShoeModel({
  url,
  reducedMotion,
  isMobile,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}) {
  const group = useRef()
  const { scene } = useGLTF(url)
  const pointerHandlers = useShoeMotion({
    group,
    position,
    rotation,
    reducedMotion,
    isMobile,
  })

  return (
    <group
      ref={group}
      position={position}
      rotation={rotation}
      scale={scale}
      {...pointerHandlers}
    >
      <Center>
        <Clone
          object={scene}
          deep="materialsOnly"
          castShadow
          receiveShadow
        />
      </Center>
    </group>
  )
}

export default ShoeModel
