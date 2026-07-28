import { Center, Clone, useGLTF } from '@react-three/drei'

const MODEL_SCALE = 15.1

function ShoeModel({ url }) {
  const { scene } = useGLTF(url)

  return (
    <Center>
      <group scale={MODEL_SCALE}>
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
