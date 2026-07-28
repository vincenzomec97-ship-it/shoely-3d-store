import { Component, Suspense, useMemo, useRef } from 'react'
import { ContactShadows } from '@react-three/drei'
import { gsap, ScrollTrigger, useGSAP } from '../../utils/gsap.js'
import useShoeMotion from '../../hooks/useShoeMotion.js'
import SceneLights from './SceneLights.jsx'
import ShoeModel from './ShoeModel.jsx'
import ShoePlaceholder from './ShoePlaceholder.jsx'

class ModelErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    if (import.meta.env.DEV) {
      console.warn('Shoes M.V.: impossibile caricare sneaker.glb, uso il placeholder.', error)
    }
  }

  render() {
    if (this.state.hasError) {
      return <ShoePlaceholder {...this.props.fallbackProps} />
    }

    return this.props.children
  }
}

function ShoeScene({
  modelUrl,
  selectedProductId,
  accentColor,
  reducedMotion,
  isMobile,
}) {
  const scrollRig = useRef()
  const selectionRig = useRef()
  const manualRig = useRef()
  const floatingRig = useRef()
  const interactionHandlers = useShoeMotion({
    manualGroup: manualRig,
    floatingGroup: floatingRig,
    reducedMotion,
    isMobile,
  })
  const objectTransform = useMemo(
    () => ({
      position: isMobile ? [-0.08, -0.15, 0] : [0.05, -0.16, 0],
      rotation: [0.05, -0.48, -0.08],
      scale: isMobile ? 1.12 : 0.62,
    }),
    [isMobile],
  )

  useGSAP(
    () => {
      if (reducedMotion || !selectionRig.current) return undefined

      const rig = selectionRig.current
      const response = gsap.timeline()

      response
        .fromTo(
          rig.rotation,
          { y: -0.1, z: 0.025 },
          { y: 0, z: 0, duration: 0.72, ease: 'power3.out' },
        )
        .fromTo(
          rig.scale,
          { x: 1.025, y: 1.025, z: 1.025 },
          { x: 1, y: 1, z: 1, duration: 0.72, ease: 'power3.out' },
          0,
        )

      return () => response.kill()
    },
    {
      dependencies: [selectedProductId, reducedMotion],
      revertOnUpdate: true,
    },
  )

  useGSAP(
    () => {
      if (reducedMotion || !scrollRig.current) return undefined

      const rig = scrollRig.current
      const media = gsap.matchMedia()
      const refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh())

      media.add(
        {
          mobile: '(max-width: 46rem)',
          desktop: '(min-width: 46.01rem)',
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        ({ conditions }) => {
          if (conditions.reduceMotion) return undefined

          const mobile = conditions.mobile
          const timeline = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: '#top',
              start: 'top top',
              end: 'bottom top',
              scrub: mobile ? 0.6 : 1.1,
              invalidateOnRefresh: true,
            },
          })

          timeline
            .to(
              rig.position,
              {
                z: mobile ? 0.25 : 0.72,
                y: mobile ? 0.04 : 0.1,
                duration: 0.28,
              },
              0,
            )
            .to(
              rig.rotation,
              {
                x: mobile ? -0.015 : -0.045,
                y: mobile ? 0.08 : 0.2,
                z: mobile ? 0.015 : 0.04,
                duration: 0.42,
              },
              0,
            )
            .to(
              rig.position,
              {
                x: mobile ? -0.18 : -0.82,
                y: mobile ? 0.02 : 0.16,
                z: mobile ? 0.08 : 0.28,
                duration: 0.34,
              },
              0.28,
            )
            .to(
              rig.rotation,
              {
                y: mobile ? 0.12 : 0.34,
                z: mobile ? 0.025 : 0.065,
                duration: 0.34,
              },
              0.28,
            )
            .to(
              rig.position,
              {
                x: mobile ? -0.28 : -1.18,
                y: mobile ? -0.08 : -0.22,
                z: mobile ? -0.05 : -0.35,
                duration: 0.38,
              },
              0.62,
            )
            .to(
              rig.scale,
              {
                x: mobile ? 0.74 : 0.56,
                y: mobile ? 0.74 : 0.56,
                z: mobile ? 0.74 : 0.56,
                duration: 0.38,
              },
              0.62,
            )

          return () => {
            timeline.scrollTrigger?.kill()
            timeline.kill()
          }
        },
      )

      return () => {
        cancelAnimationFrame(refreshFrame)
        media.revert()
      }
    },
    { dependencies: [reducedMotion, isMobile], revertOnUpdate: true },
  )

  return (
    <>
      <SceneLights isMobile={isMobile} accentColor={accentColor} />
      <group ref={scrollRig}>
        <group ref={selectionRig}>
          <group
            position={objectTransform.position}
            rotation={objectTransform.rotation}
            scale={objectTransform.scale}
          >
            <group ref={manualRig} {...interactionHandlers}>
              <group ref={floatingRig}>
                {modelUrl ? (
                  <Suspense
                    fallback={<ShoePlaceholder accentColor={accentColor} />}
                  >
                    <ModelErrorBoundary
                      key={modelUrl}
                      fallbackProps={{ accentColor }}
                    >
                      <ShoeModel url={modelUrl} />
                    </ModelErrorBoundary>
                  </Suspense>
                ) : (
                  <ShoePlaceholder
                    key={selectedProductId}
                    accentColor={accentColor}
                  />
                )}
              </group>
            </group>
          </group>
        </group>
      </group>
      {!isMobile && (
        <ContactShadows
          position={[0, -1.05, 0]}
          opacity={0.24}
          scale={6}
          blur={2.6}
          far={3}
          resolution={128}
          frames={1}
        />
      )}
    </>
  )
}

export default ShoeScene
