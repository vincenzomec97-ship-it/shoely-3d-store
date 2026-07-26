import { useEffect, useRef } from 'react'
import { useCart } from '../../context/CartContext.jsx'
import { useNavigation } from '../../context/NavigationContext.jsx'

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

function MobileMenu({ isOpen, onClose }) {
  const { totalItems, openCart } = useCart()
  const { route } = useNavigation()
  const panelRef = useRef(null)
  const closeButtonRef = useRef(null)
  const links = [
    { label: 'About', href: '#/about' },
    { label: 'Info', href: '#/info' },
    { label: 'Store', href: '#/store' },
  ]

  useEffect(() => {
    if (!isOpen) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab' || !panelRef.current) return

      const focusable = [...panelRef.current.querySelectorAll(FOCUSABLE_SELECTOR)]
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
  }, [isOpen, onClose])

  function handleCartOpen() {
    onClose()
    setTimeout(openCart, 0)
  }

  return (
    <div className="mobile-menu" hidden={!isOpen} aria-hidden={!isOpen}>
      <button
        className="mobile-menu__overlay"
        type="button"
        aria-label="Chiudi menu di navigazione"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        className="mobile-menu__panel"
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
      >
        <div className="mobile-menu__header">
          <span id="mobile-menu-title">Menu</span>
          <button
            ref={closeButtonRef}
            className="mobile-menu__close"
            type="button"
            aria-label="Chiudi menu di navigazione"
            onClick={onClose}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <nav className="mobile-menu__nav" aria-label="Navigazione principale">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={route === link.href.replace(/^#/, '') ? 'page' : undefined}
              onClick={onClose}
            >
              {link.label}
            </a>
          ))}
          <button type="button" onClick={handleCartOpen}>
            <span>Carrello</span>
            <span className="mobile-menu__cart-count" aria-hidden="true">{totalItems}</span>
          </button>
        </nav>
      </div>
    </div>
  )
}

export default MobileMenu
