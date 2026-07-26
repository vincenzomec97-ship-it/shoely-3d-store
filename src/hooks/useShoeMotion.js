import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { MathUtils } from 'three'

const MAX_POINTER_YAW = 0.22
const MAX_POINTER_PITCH = 0.12
const MAX_POINTER_ROLL = 0.035
const POINTER_SMOOTHING = 2.8

function useShoeMotion({
  group,
  position,
  rotation,
  reducedMotion,
  isMobile,
  interactionActive,
}) {
  const targetRotation = useRef({ x: rotation[0], y: rotation[1], z: rotation[2] })

  useFrame((state, delta) => {
    if (!group.current) return

    if (reducedMotion) {
      group.current.position.y = position[1]
      group.current.rotation.set(...rotation)
      return
    }

    const elapsed = state.clock.elapsedTime
    const canFollowPointer = interactionActive.current && !isMobile
    const pointerX = canFollowPointer ? state.pointer.x : 0
    const pointerY = canFollowPointer ? state.pointer.y : 0
    const ambientYaw = Math.sin(elapsed * 0.24) * MathUtils.degToRad(isMobile ? 0.7 : 0.9)

    targetRotation.current.x =
      rotation[0] - pointerY * MAX_POINTER_PITCH
    targetRotation.current.y =
      rotation[1] + ambientYaw + pointerX * MAX_POINTER_YAW
    targetRotation.current.z =
      rotation[2] - pointerX * MAX_POINTER_ROLL

    group.current.position.y =
      position[1] + Math.sin(elapsed * 0.56) * (isMobile ? 0.035 : 0.055)
    group.current.rotation.x = MathUtils.damp(
      group.current.rotation.x,
      targetRotation.current.x,
      POINTER_SMOOTHING,
      delta,
    )
    group.current.rotation.y = MathUtils.damp(
      group.current.rotation.y,
      targetRotation.current.y,
      POINTER_SMOOTHING,
      delta,
    )
    group.current.rotation.z = MathUtils.damp(
      group.current.rotation.z,
      targetRotation.current.z,
      POINTER_SMOOTHING,
      delta,
    )
  })
}

export default useShoeMotion
