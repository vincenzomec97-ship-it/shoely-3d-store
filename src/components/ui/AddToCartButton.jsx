import { useCart } from '../../context/CartContext.jsx'

function AddToCartButton({ product }) {
  const { addItem } = useCart()

  return (
    <button
      className="add-to-cart-button"
      type="button"
      onClick={() => addItem(product.id)}
      aria-label={`Aggiungi ${product.name} al carrello`}
    >
      <span>Aggiungi</span>
      <span aria-hidden="true">+</span>
    </button>
  )
}

export default AddToCartButton
