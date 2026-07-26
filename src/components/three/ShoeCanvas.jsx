import { Canvas } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import useReducedMotion from '../../hooks/useReducedMotion.js'
import useResponsiveThree from '../../hooks/useResponsiveThree.js'
import SceneLoader from './SceneLoader.jsx'
import ShoeScene from './ShoeScene.jsx'
import { assetUrl } from '../../utils/assetUrl.js'

const MODEL_URL = '/models/sneaker.glb'
const PERFORMANCE_CONFIG = { min: 0.6 }

function ShoeCanvas({ product }) {
  const containerRef = useRef(null)
  const interactionActive = useRef(false)
  const [isSceneVisible, setIsSceneVisible] = useState(true)
  const reducedMotion = useReducedMotion()
  const { camera, dpr, isMobile } = useResponsiveThree()
  const productModelAvailable = __SHOE_MODEL_AVAILABILITY__[product.model]
  const sharedModelAvailable = __SHOE_MODEL_AVAILABILITY__[MODEL_URL]
  const resolvedModelUrl = productModelAvailable
    ? product.model
    : sharedModelAvailable
      ? MODEL_URL
      : null
  const hasModel = Boolean(resolvedModelUrl)
  const publicModelUrl = hasModel ? assetUrl(resolvedModelUrl) : null
  const modelStatus = hasModel ? 'available' : 'missing'
  const rendererConfig = useMemo(
    () => ({
      alpha: true,
      antialias: !isMobile,
      depth: true,
      powerPreference: 'high-performance',
      stencil: false,
    }),
    [isMobile],
  )

  useEffect(() => {
    const container = containerRef.current
    if (!container || !('IntersectionObserver' in window)) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => setIsSceneVisible(entry.isIntersecting),
      { threshold: 0.05 },
    )

    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  function handlePointerEnter(event) {
    if (event.pointerType !== 'mouse' || isMobile || reducedMotion) return
    interactionActive.current = true
    containerRef.current?.setAttribute('data-interacting', 'true')
  }

  function handlePointerLeave() {
    interactionActive.current = false
    containerRef.current?.removeAttribute('data-interacting')
  }

  return (
    <div
      ref={containerRef}
      className={`shoe-canvas${hasModel ? ' has-model' : ' has-placeholder'}`}
      aria-hidden="true"
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <Canvas
        camera={camera}
        dpr={dpr}
        frameloop={reducedMotion || !isSceneVisible ? 'demand' : 'always'}
        shadows={isMobile ? false : 'basic'}
        gl={rendererConfig}
        performance={PERFORMANCE_CONFIG}
        fallback={(
          <div className="shoe-canvas__figma-rig">
            <img
              className="shoe-canvas__figma-shoe"
              src={assetUrl('images/figma-hero-shoe.png')}
              alt=""
            />
          </div>
        )}
      >
        <ShoeScene
          modelUrl={publicModelUrl}
          selectedProductId={product.id}
          accentColor={product.accentColor}
          reducedMotion={reducedMotion}
          isMobile={isMobile}
          interactionActive={interactionActive}
        />
      </Canvas>
      <SceneLoader status={modelStatus} />
    </div>
  )
}

export default ShoeCanvas
