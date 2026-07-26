import { useRef } from 'react'
import { gsap, useGSAP } from '../../utils/gsap.js'
import useReducedMotion from '../../hooks/useReducedMotion.js'
import { assetUrl } from '../../utils/assetUrl.js'

const content = {
  '/about': {
    eyebrow: 'Shoely / Concept',
    title: 'Una nuova prospettiva sul movimento.',
    copy: 'Shoely esplora il prodotto come esperienza visiva: sneaker, spazio e interazione convivono in una direzione digitale originale.',
  },
  '/info': {
    eyebrow: 'Informazioni',
    title: 'Design sperimentale, esperienza accessibile.',
    copy: 'Questo concept combina React, Three.js e animazioni progressive. Il catalogo e il carrello sono dimostrativi e non prevedono acquisti reali.',
  },
}

function EditorialPage({ route }) {
  const page = useRef(null)
  const reducedMotion = useReducedMotion()
  const current = content[route] ?? content['/about']

  useGSAP(
    () => {
      if (reducedMotion) return
      gsap.from('.editorial-page__content > *', {
        autoAlpha: 0,
        y: 34,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
      })
    },
    { scope: page, dependencies: [route, reducedMotion], revertOnUpdate: true },
  )

  return (
    <section ref={page} className="editorial-page store-environment">
      <div className="site-shell editorial-page__content">
        <p>{current.eyebrow}</p>
        <h1>{current.title}</h1>
        <div className="editorial-page__rule" />
        <p className="editorial-page__copy">{current.copy}</p>
        <a href="#/store">Esplora lo store <span aria-hidden="true">↗</span></a>
      </div>
      <img
        className="editorial-page__shoe"
        src={assetUrl('images/figma-hero-shoe.png')}
        alt=""
      />
    </section>
  )
}

export default EditorialPage
