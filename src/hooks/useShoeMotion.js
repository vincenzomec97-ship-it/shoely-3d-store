import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { MathUtils } from 'three'

const MAX_POINTER_YAW = MathUtils.degToRad(5)
const MAX_POINTER_PITCH = MathUtils.degToRad(3)
const MAX_POINTER_ROLL = MathUtils.degToRad(1)
const RETURN_SPEED = 3.2

function useShoeMotion({
  group,
  position,
  rotation,
  reducedMotion,
  isMobile,
}) {
  const isPointerOver = useRef(false)

  useFrame((state, delta) => {
    if (!group.current) return

    if (reducedMotion) {
      group.current.position.y = position[1]
      group.current.rotation.set(...rotation)
      return
    }

    const elapsed = state.clock.elapsedTime
    const canFollowPointer = isPointerOver.current && !isMobile
    const pointerX = canFollowPointer ? state.pointer.x : 0
    const pointerY = canFollowPointer ? state.pointer.y : 0
    const ambientYaw = Math.sin(elapsed * 0.32) * MathUtils.degToRad(1.1)

    group.current.position.y =
      position[1] + Math.sin(elapsed * 0.72) * 0.06
    group.current.rotation.x = MathUtils.damp(
      group.current.rotation.x,
      rotation[0] - pointerY * MAX_POINTER_PITCH,
      RETURN_SPEED,
      delta,
    )
    group.current.rotation.y = MathUtils.damp(
      group.current.rotation.y,
      rotation[1] + ambientYaw + pointerX * MAX_POINTER_YAW,
      RETURN_SPEED,
      delta,
    )
    group.current.rotation.z = MathUtils.damp(
      group.current.rotation.z,
      rotation[2] - pointerX * MAX_POINTER_ROLL,
      RETURN_SPEED,
      delta,
    )
  })

  return {
    onPointerOver(event) {
      if (isMobile || reducedMotion) return
      event.stopPropagation()
      isPointerOver.current = true
    },
    onPointerOut() {
      isPointerOver.current = false
    },
  }
}

export default useShoeMotion
