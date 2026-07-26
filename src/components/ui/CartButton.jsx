function CartButton() {
  return (
    <button className="cart-button" type="button" aria-label="Carrello, 0 prodotti">
      <span className="cart-button__label">Carrello</span>
      <span className="cart-button__count" aria-hidden="true">0</span>
    </button>
  )
}

export default CartButton
