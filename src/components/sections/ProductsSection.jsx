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
      const cards = sectionElement?.querySelectorAll('.product-card') ?? []

      if (reducedMotion) {
        gsap.set([sectionElement, ...cards], { clearProps: 'all' })
        return undefined
      }

      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })

      timeline
        .from(sectionElement, { autoAlpha: 0, duration: 0.65 })
        .from(
          cards,
          {
            autoAlpha: 0,
            y: 44,
            rotateX: -5,
            scale: 0.96,
            transformOrigin: '50% 100%',
            duration: 1.1,
            stagger: 0.13,
          },
          '-=0.2',
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
    >
      <div className="site-shell">
        <div className="section-heading">
          <div>
            <p className="section-heading__eyebrow">Selezione Shoes M.V.</p>
            <h2>Forme in movimento</h2>
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
