import { useCart } from '../../context/CartContext.jsx'
import { formatPrice } from '../../data/products.js'

function CartSummary() {
  const { totalItems, totalPrice, clearCart } = useCart()

  return (
    <div className="cart-summary">
      <div className="cart-summary__row">
        <span>Articoli</span>
        <span>{totalItems}</span>
      </div>
      <div className="cart-summary__row cart-summary__total">
        <span>Totale</span>
        <strong>{formatPrice(totalPrice)}</strong>
      </div>
      <p>Carrello dimostrativo. Pagamenti e checkout non sono disponibili.</p>
      <button className="cart-summary__clear" type="button" onClick={clearCart}>
        Svuota il carrello
      </button>
    </div>
  )
}

export default CartSummary
