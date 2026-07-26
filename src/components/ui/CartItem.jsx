import { useCart } from '../../context/CartContext.jsx'
import { formatPrice } from '../../data/products.js'

function CartItem({ item }) {
  const { product, quantity } = item
  const { removeItem, increaseQuantity, decreaseQuantity } = useCart()

  return (
    <li className="cart-item">
      <div className="cart-item__image">
        <img src={product.image} alt="" />
      </div>
      <div className="cart-item__content">
        <div>
          <h3>{product.name}</h3>
          <p>{product.subtitle}</p>
        </div>
        <div className="cart-item__footer">
          <div className="quantity-control" aria-label={`Quantità di ${product.name}`}>
            <button
              type="button"
              onClick={() => decreaseQuantity(product.id)}
              aria-label={`Diminuisci quantità di ${product.name}`}
            >
              −
            </button>
            <span aria-live="polite">{quantity}</span>
            <button
              type="button"
              onClick={() => increaseQuantity(product.id)}
              aria-label={`Aumenta quantità di ${product.name}`}
            >
              +
            </button>
          </div>
          <strong>{formatPrice(product.price * quantity)}</strong>
        </div>
        <button
          className="cart-item__remove"
          type="button"
          onClick={() => removeItem(product.id)}
        >
          Rimuovi
        </button>
      </div>
    </li>
  )
}

export default CartItem
