import { Canvas } from '@react-three/fiber'
import { useMemo } from 'react'
import useReducedMotion from '../../hooks/useReducedMotion.js'
import useResponsiveThree from '../../hooks/useResponsiveThree.js'
import SceneLoader from './SceneLoader.jsx'
import ShoeScene from './ShoeScene.jsx'
import { assetUrl } from '../../utils/assetUrl.js'

const MODEL_URL = '/models/sneaker.glb'
const PERFORMANCE_CONFIG = { min: 0.6 }

function ShoeCanvas({ product }) {
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

  return (
    <div className={`shoe-canvas${hasModel ? ' has-model' : ' has-image-fallback'}`} aria-hidden="true">
      {hasModel && (
        <Canvas
          camera={camera}
          dpr={dpr}
          frameloop={reducedMotion ? 'demand' : 'always'}
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
          />
        </Canvas>
      )}
      {!hasModel && (
        <div className="shoe-canvas__figma-rig">
          <img
            className="shoe-canvas__figma-shoe"
            src={assetUrl('images/figma-hero-shoe.png')}
            alt=""
          />
        </div>
      )}
      <SceneLoader status={modelStatus} />
    </div>
  )
}

export default ShoeCanvas
