import { useFrame, useThree } from '@react-three/fiber'
import { useCallback, useEffect, useRef } from 'react'
import { MathUtils } from 'three'

export const SHOE_INTERACTION_CONFIG = {
  dragSensitivityX: 0.008,
  dragSensitivityY: 0.005,
  verticalMin: -0.55,
  verticalMax: 0.55,
  damping: 0.93,
  inertiaMultiplier: 0.5,
  rotationSmoothing: 18,
  velocityBlend: 0.28,
  maxYawVelocity: 4.2,
  maxPitchVelocity: 2.2,
}

const FLOAT_RESUME_SMOOTHING = 4
const FLOAT_MOTION_SMOOTHING = 6
const MIN_VELOCITY = 0.002

function useShoeMotion({
  manualGroup,
  floatingGroup,
  reducedMotion,
  isMobile,
}) {
  const gl = useThree((state) => state.gl)
  const invalidate = useThree((state) => state.invalidate)
  const targetRotation = useRef({ x: 0, y: 0 })
  const velocity = useRef({ x: 0, y: 0 })
  const floatingStrength = useRef(reducedMotion ? 0 : 1)
  const drag = useRef({
    active: false,
    pointerId: null,
    pointerType: null,
    lastX: 0,
    lastY: 0,
    lastTime: 0,
  })

  const setCanvasInteraction = useCallback(
    ({ cursor = '', touchAction = '' }) => {
      const canvas = gl.domElement
      canvas.style.cursor = cursor
      canvas.style.touchAction = touchAction
    },
    [gl],
  )

  const stopDragging = useCallback(
    (event, cancelled = false) => {
      if (
        !drag.current.active
        || event.pointerId !== drag.current.pointerId
      ) {
        return
      }

      event.stopPropagation()

      if (event.target.hasPointerCapture?.(event.pointerId)) {
        event.target.releasePointerCapture(event.pointerId)
      }

      const releaseDelay = event.timeStamp - drag.current.lastTime
      if (cancelled || reducedMotion || releaseDelay > 80) {
        velocity.current.x = 0
        velocity.current.y = 0
      }

      const showGrabCursor = drag.current.pointerType === 'mouse'
      drag.current.active = false
      drag.current.pointerId = null
      drag.current.pointerType = null
      setCanvasInteraction({
        cursor: showGrabCursor ? 'grab' : '',
        touchAction: '',
      })
      invalidate()
    },
    [invalidate, reducedMotion, setCanvasInteraction],
  )

  const handlePointerOver = useCallback(
    (event) => {
      if (drag.current.active) return

      setCanvasInteraction({
        cursor: event.pointerType === 'mouse' ? 'grab' : '',
        touchAction: event.pointerType === 'touch' ? 'none' : '',
      })
    },
    [setCanvasInteraction],
  )

  const handlePointerOut = useCallback(() => {
    if (drag.current.active) return
    setCanvasInteraction({ cursor: '', touchAction: '' })
  }, [setCanvasInteraction])

  const handlePointerDown = useCallback(
    (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return

      event.stopPropagation()
      event.target.setPointerCapture?.(event.pointerId)

      drag.current.active = true
      drag.current.pointerId = event.pointerId
      drag.current.pointerType = event.pointerType
      drag.current.lastX = event.clientX
      drag.current.lastY = event.clientY
      drag.current.lastTime = event.timeStamp
      velocity.current.x = 0
      velocity.current.y = 0

      setCanvasInteraction({
        cursor: event.pointerType === 'mouse' ? 'grabbing' : '',
        touchAction: event.pointerType === 'touch' ? 'none' : '',
      })
      invalidate()
    },
    [invalidate, setCanvasInteraction],
  )

  const handlePointerMove = useCallback(
    (event) => {
      if (
        !drag.current.active
        || event.pointerId !== drag.current.pointerId
      ) {
        return
      }

      event.stopPropagation()

      const deltaX = event.clientX - drag.current.lastX
      const deltaY = event.clientY - drag.current.lastY
      const elapsedSeconds = MathUtils.clamp(
        (event.timeStamp - drag.current.lastTime) / 1000,
        1 / 120,
        0.05,
      )

      targetRotation.current.y +=
        deltaX * SHOE_INTERACTION_CONFIG.dragSensitivityX
      targetRotation.current.x = MathUtils.clamp(
        targetRotation.current.x
          + deltaY * SHOE_INTERACTION_CONFIG.dragSensitivityY,
        SHOE_INTERACTION_CONFIG.verticalMin,
        SHOE_INTERACTION_CONFIG.verticalMax,
      )

      const yawSample = MathUtils.clamp(
        (deltaX * SHOE_INTERACTION_CONFIG.dragSensitivityX) / elapsedSeconds,
        -SHOE_INTERACTION_CONFIG.maxYawVelocity,
        SHOE_INTERACTION_CONFIG.maxYawVelocity,
      )
      const pitchSample = MathUtils.clamp(
        (deltaY * SHOE_INTERACTION_CONFIG.dragSensitivityY) / elapsedSeconds,
        -SHOE_INTERACTION_CONFIG.maxPitchVelocity,
        SHOE_INTERACTION_CONFIG.maxPitchVelocity,
      )

      velocity.current.y = MathUtils.lerp(
        velocity.current.y,
        yawSample,
        SHOE_INTERACTION_CONFIG.velocityBlend,
      )
      velocity.current.x = MathUtils.lerp(
        velocity.current.x,
        pitchSample,
        SHOE_INTERACTION_CONFIG.velocityBlend,
      )

      drag.current.lastX = event.clientX
      drag.current.lastY = event.clientY
      drag.current.lastTime = event.timeStamp
      invalidate()
    },
    [invalidate],
  )

  const handlePointerUp = useCallback(
    (event) => stopDragging(event),
    [stopDragging],
  )

  const handlePointerCancel = useCallback(
    (event) => stopDragging(event, true),
    [stopDragging],
  )

  const handleLostPointerCapture = useCallback(
    (event) => stopDragging(event, true),
    [stopDragging],
  )

  useEffect(
    () => () => {
      setCanvasInteraction({ cursor: '', touchAction: '' })
    },
    [setCanvasInteraction],
  )

  useFrame((state, delta) => {
    const manualRig = manualGroup.current
    const floatingRig = floatingGroup.current
    if (!manualRig || !floatingRig) return

    if (reducedMotion) {
      velocity.current.x = 0
      velocity.current.y = 0
      floatingStrength.current = 0
      manualRig.rotation.x = targetRotation.current.x
      manualRig.rotation.y = targetRotation.current.y
      floatingRig.position.y = 0
      floatingRig.rotation.z = 0
      return
    }

    if (!drag.current.active) {
      const nextPitch =
        targetRotation.current.x
        + velocity.current.x
          * delta
          * SHOE_INTERACTION_CONFIG.inertiaMultiplier

      targetRotation.current.y +=
        velocity.current.y
        * delta
        * SHOE_INTERACTION_CONFIG.inertiaMultiplier
      targetRotation.current.x = MathUtils.clamp(
        nextPitch,
        SHOE_INTERACTION_CONFIG.verticalMin,
        SHOE_INTERACTION_CONFIG.verticalMax,
      )

      if (targetRotation.current.x !== nextPitch) {
        velocity.current.x = 0
      }

      const frameDamping = Math.pow(
        SHOE_INTERACTION_CONFIG.damping,
        delta * 60,
      )
      velocity.current.x *= frameDamping
      velocity.current.y *= frameDamping

      if (Math.abs(velocity.current.x) < MIN_VELOCITY) {
        velocity.current.x = 0
      }
      if (Math.abs(velocity.current.y) < MIN_VELOCITY) {
        velocity.current.y = 0
      }
    }

    manualRig.rotation.x = MathUtils.damp(
      manualRig.rotation.x,
      targetRotation.current.x,
      SHOE_INTERACTION_CONFIG.rotationSmoothing,
      delta,
    )
    manualRig.rotation.y = MathUtils.damp(
      manualRig.rotation.y,
      targetRotation.current.y,
      SHOE_INTERACTION_CONFIG.rotationSmoothing,
      delta,
    )

    floatingStrength.current = MathUtils.damp(
      floatingStrength.current,
      drag.current.active ? 0 : 1,
      FLOAT_RESUME_SMOOTHING,
      delta,
    )

    const elapsed = state.clock.elapsedTime
    const floatAmount = isMobile ? 0.025 : 0.04
    const targetFloatY =
      Math.sin(elapsed * 0.56) * floatAmount * floatingStrength.current
    const targetFloatRoll =
      Math.sin(elapsed * 0.42) * 0.006 * floatingStrength.current

    floatingRig.position.y = MathUtils.damp(
      floatingRig.position.y,
      targetFloatY,
      FLOAT_MOTION_SMOOTHING,
      delta,
    )
    floatingRig.rotation.z = MathUtils.damp(
      floatingRig.rotation.z,
      targetFloatRoll,
      FLOAT_MOTION_SMOOTHING,
      delta,
    )
  })

  return {
    onPointerOver: handlePointerOver,
    onPointerOut: handlePointerOut,
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
    onPointerCancel: handlePointerCancel,
    onLostPointerCapture: handleLostPointerCapture,
  }
}

export default useShoeMotion
