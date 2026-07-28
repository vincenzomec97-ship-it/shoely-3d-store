import { Center, Clone, useGLTF } from '@react-three/drei'
import { useMemo } from 'react'
import { Box3, Vector3 } from 'three'

const MODEL_TARGET_EXTENT = 6.1

function ShoeModel({ url }) {
  const { scene } = useGLTF(url)
  const modelScale = useMemo(() => {
    const size = new Box3().setFromObject(scene).getSize(new Vector3())
    const largestDimension = Math.max(size.x, size.y, size.z)

    return largestDimension > 0
      ? MODEL_TARGET_EXTENT / largestDimension
      : 1
  }, [scene])

  return (
    <Center>
      <group scale={modelScale}>
        <Clone
          object={scene}
          deep="materialsOnly"
          castShadow
          receiveShadow
        />
      </group>
    </Center>
  )
}

export default ShoeModel
