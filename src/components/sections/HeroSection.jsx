import { lazy, Suspense, useRef } from 'react'
import PrimaryButton from '../ui/PrimaryButton.jsx'
import SearchBar from '../ui/SearchBar.jsx'
import useReducedMotion from '../../hooks/useReducedMotion.js'
import { useProductSelection } from '../../context/ProductContext.jsx'
import { formatPrice } from '../../data/products.js'
import { gsap, ScrollTrigger, useGSAP } from '../../utils/gsap.js'

const ShoeCanvas = lazy(() => import('../three/ShoeCanvas.jsx'))

function HeroSection() {
  const section = useRef()
  const stage = useRef()
  const reducedMotion = useReducedMotion()
  const { selectedProduct } = useProductSelection()

  useGSAP(
    () => {
      if (reducedMotion) return undefined

      const intro = gsap.timeline({
        defaults: { ease: 'power3.out' },
      })

      intro
        .from('.hero h1', {
          autoAlpha: 0,
          y: 28,
          duration: 0.85,
        })
        .from(
          '.primary-button',
          {
            autoAlpha: 0,
            y: 18,
            duration: 0.55,
          },
          '-=0.48',
        )
        .from(
          '.search-form',
          {
            autoAlpha: 0,
            y: 14,
            duration: 0.55,
          },
          '-=0.4',
        )
        .from(
          '.hero__stage',
          {
            autoAlpha: 0,
            x: 80,
            scale: 0.92,
            duration: 1.1,
          },
          '-=0.85',
        )

      const depthTween = gsap.to(section.current, {
        '--environment-overlay': 0.9,
        '--environment-shift': '57%',
        ease: 'none',
        scrollTrigger: {
          trigger: section.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
          invalidateOnRefresh: true,
        },
      })

      const refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh())

      return () => {
        cancelAnimationFrame(refreshFrame)
        depthTween.scrollTrigger?.kill()
        intro.kill()
        depthTween.kill()
      }
    },
    {
      scope: section,
      dependencies: [reducedMotion],
      revertOnUpdate: true,
    },
  )

  function handlePointerMove(event) {
    if (reducedMotion || event.pointerType !== 'mouse' || !stage.current) return

    const bounds = stage.current.getBoundingClientRect()
    const x = Math.max(-0.5, Math.min(0.5, (event.clientX - bounds.left) / bounds.width - 0.5))
    const y = Math.max(-0.5, Math.min(0.5, (event.clientY - bounds.top) / bounds.height - 0.5))

    stage.current.dataset.interacting = 'true'
    stage.current.style.setProperty('--shoe-pointer-x', `${x * 24}px`)
    stage.current.style.setProperty('--shoe-pointer-y', `${y * 15}px`)
    stage.current.style.setProperty('--shoe-rotate-x', `${y * -4}deg`)
    stage.current.style.setProperty('--shoe-rotate-y', `${x * 6}deg`)
    stage.current.style.setProperty('--shoe-depth', `${Math.abs(x) * 8 + Math.abs(y) * 5}px`)
  }

  function handlePointerLeave() {
    if (!stage.current) return
    delete stage.current.dataset.interacting
    stage.current.style.removeProperty('--shoe-pointer-x')
    stage.current.style.removeProperty('--shoe-pointer-y')
    stage.current.style.removeProperty('--shoe-rotate-x')
    stage.current.style.removeProperty('--shoe-rotate-y')
    stage.current.style.removeProperty('--shoe-depth')
  }

  return (
    <section
      ref={section}
      className="hero store-environment"
      id="top"
    >
      <div className="site-shell hero__grid">
        <div className="hero__content" id="about">
          <h1>
            Dove il comfort <span>incontra il design</span>
          </h1>
          <div className="hero__actions">
            <PrimaryButton href="#/store">Shop now</PrimaryButton>
            <SearchBar />
          </div>
        </div>

        <div
          ref={stage}
          className="hero__stage"
          aria-label="Anteprima tridimensionale della sneaker Shoely"
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <Suspense fallback={null}>
            <ShoeCanvas product={selectedProduct} />
          </Suspense>
          <span className="visually-hidden" aria-live="polite">
            {selectedProduct.name}, {formatPrice(selectedProduct.price)}
          </span>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
