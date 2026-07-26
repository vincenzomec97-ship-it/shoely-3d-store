import { useEffect, useRef } from 'react'
import { useCart } from '../../context/CartContext.jsx'
import CartItem from './CartItem.jsx'
import CartSummary from './CartSummary.jsx'

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

function CartDrawer() {
  const { items, totalItems, isCartOpen, closeCart } = useCart()
  const drawerRef = useRef(null)
  const closeButtonRef = useRef(null)

  useEffect(() => {
    if (!isCartOpen) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeCart()
        return
      }

      if (event.key !== 'Tab' || !drawerRef.current) return

      const focusable = [...drawerRef.current.querySelectorAll(FOCUSABLE_SELECTOR)]
      const first = focusable[0]
      const last = focusable.at(-1)

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [closeCart, isCartOpen])

  if (!isCartOpen) return null

  return (
    <div className="cart-layer">
      <button
        className="cart-overlay"
        type="button"
        aria-label="Chiudi il carrello"
        onClick={closeCart}
      />
      <aside
        ref={drawerRef}
        className="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
      >
        <header className="cart-drawer__header">
          <div>
            <p>La tua selezione</p>
            <h2 id="cart-title">Carrello</h2>
          </div>
          <button
            ref={closeButtonRef}
            className="cart-drawer__close"
            type="button"
            aria-label="Chiudi il carrello"
            onClick={closeCart}
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <div className="cart-drawer__body">
          {items.length > 0 ? (
            <ul className="cart-list" aria-label={`${totalItems} articoli nel carrello`}>
              {items.map((item) => (
                <CartItem key={item.product.id} item={item} />
              ))}
            </ul>
          ) : (
            <div className="cart-empty" role="status">
              <strong>Il carrello è vuoto</strong>
              <p>Aggiungi una sneaker dalla collezione Shoes M.V.</p>
            </div>
          )}
        </div>

        {items.length > 0 && <CartSummary />}
      </aside>
    </div>
  )
}

export default CartDrawer
