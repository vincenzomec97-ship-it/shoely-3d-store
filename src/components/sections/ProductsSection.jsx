import products from '../../data/products.js'
import ProductCard from '../ui/ProductCard.jsx'

function ProductsSection() {
  return (
    <section className="products-section store-environment" id="products">
      <div className="site-shell">
        <div className="section-heading">
          <div>
            <p className="section-heading__eyebrow">Selezione Shoely</p>
            <h2>Forme in movimento</h2>
          </div>
          <p className="section-heading__copy">
            Quattro modelli, quattro modi di attraversare la città. Esplora la
            prima collezione Shoely.
          </p>
        </div>

        <div className="products-grid">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductsSection
