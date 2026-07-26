import { useCart } from '../../context/CartContext.jsx'

function CartButton() {
  const { totalItems, openCart } = useCart()

  return (
    <button
      className="cart-button"
      type="button"
      aria-label={`Carrello, ${totalItems} ${totalItems === 1 ? 'articolo' : 'articoli'}`}
      onClick={openCart}
    >
      <span className="cart-button__label">Carrello</span>
      <span className="cart-button__count" aria-hidden="true">{totalItems}</span>
    </button>
  )
}

export default CartButton
