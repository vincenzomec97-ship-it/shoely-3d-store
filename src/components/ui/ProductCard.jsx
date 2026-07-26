function ProductCard({ product, index }) {
  const number = String(index + 1).padStart(2, '0')

  return (
    <a
      className="product-card"
      href={`#${product.id}`}
      id={product.id}
      aria-label={`${product.name}, ${product.formattedPrice}`}
    >
      <div className="product-card__topline">
        <span className="product-card__index">{number}</span>
        <span>{product.category}</span>
      </div>
      <div className="product-card__media">
        <img src={product.image} alt="" />
      </div>
      <div className="product-card__body">
        <h3>{product.name}</h3>
        <div className="product-card__meta">
          <span className="product-card__price">{product.formattedPrice}</span>
          <span className="product-card__action" aria-hidden="true">↗</span>
        </div>
      </div>
    </a>
  )
}

export default ProductCard
