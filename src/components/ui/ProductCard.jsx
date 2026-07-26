import { formatPrice } from '../../data/products.js'
import AddToCartButton from './AddToCartButton.jsx'

function ProductCard({ product, index, isActive, onSelect }) {
  const number = String(index + 1).padStart(2, '0')
  const formattedPrice = formatPrice(product.price)

  return (
    <article
      className="product-card"
      id={product.id}
      style={{ '--product-accent': product.accentColor }}
    >
      <button
        className="product-card__select"
        type="button"
        aria-label={`Seleziona ${product.name}, ${formattedPrice}`}
        aria-pressed={isActive}
        onClick={() => onSelect(product.id)}
      >
        <div className="product-card__topline">
          <span className="product-card__index">{number}</span>
          <span className="product-card__state">
            {isActive ? 'Selezionata' : product.subtitle}
          </span>
        </div>
        <div className="product-card__media">
          <img
            src={product.image}
            alt=""
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="product-card__body">
          <h3>{product.name}</h3>
          <div className="product-card__meta">
            <span className="product-card__price">{formattedPrice}</span>
            <span className="product-card__action" aria-hidden="true">
              {isActive ? '✓' : '↗'}
            </span>
          </div>
        </div>
      </button>
      <AddToCartButton product={product} />
    </article>
  )
}

export default ProductCard
