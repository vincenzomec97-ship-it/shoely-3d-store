import { useRef } from 'react'
import useReducedMotion from '../../hooks/useReducedMotion.js'
import { useProductSelection } from '../../context/ProductContext.jsx'
import { gsap, useGSAP } from '../../utils/gsap.js'
import ProductCard from '../ui/ProductCard.jsx'

function ProductsSection() {
  const section = useRef()
  const reducedMotion = useReducedMotion()
  const {
    filteredProducts,
    searchQuery,
    selectedProduct,
    selectProduct,
  } = useProductSelection()

  useGSAP(
    () => {
      const sectionElement = section.current
      const heading = sectionElement?.querySelector('.section-heading')
      const cards = sectionElement?.querySelectorAll('.product-card') ?? []

      if (reducedMotion) {
        gsap.set([heading, ...cards], { clearProps: 'all' })
        return undefined
      }

      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })

      timeline
        .from(heading, {
          autoAlpha: 0,
          y: 24,
          duration: 0.85,
        })
        .from(
          cards,
          {
            autoAlpha: 0,
            y: 44,
            rotateX: -5,
            scale: 0.96,
            transformOrigin: '50% 100%',
            duration: 1,
            stagger: 0.12,
          },
          '-=0.35',
        )

      return () => timeline.kill()
    },
    {
      scope: section,
      dependencies: [reducedMotion],
      revertOnUpdate: true,
    },
  )

  return (
    <section
      ref={section}
      className="products-section store-environment store-page"
      id="products"
      aria-labelledby="store-title"
    >
      <div className="site-shell">
        <div className="section-heading">
          <div>
            <p className="section-heading__eyebrow">Store / Selezione Shoes M.V.</p>
            <h1 id="store-title">Forme in movimento</h1>
          </div>
          <p className="section-heading__copy">
            Quattro modelli, quattro modi di attraversare la città. Esplora la
            prima collezione Shoes M.V.
          </p>
        </div>

        <div className="products-grid" id="product-results" aria-live="polite">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                isActive={selectedProduct.id === product.id}
                onSelect={selectProduct}
              />
            ))
          ) : (
            <div className="products-empty" role="status">
              <strong>Nessun prodotto trovato</strong>
              <span>Nessun risultato per “{searchQuery.trim()}”. Prova un altro nome.</span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default ProductsSection
