import { useState } from 'react'
import CartButton from '../ui/CartButton.jsx'
import MobileMenu from './MobileMenu.jsx'

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      <header className="site-header">
        <div className="site-shell site-header__inner">
          <div className="site-header__group">
            <button
              className="menu-trigger"
              type="button"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              onClick={() => setIsMenuOpen(true)}
            >
              <span className="menu-trigger__icon" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
              <span className="menu-trigger__label">Menu</span>
            </button>
            <a className="site-header__link" href="#about">About</a>
            <a className="site-header__link" href="#info">Info</a>
          </div>

          <a className="brand" href="#top" aria-label="Shoely, torna all'inizio">
            Shoe<span className="brand__mark">ly</span>
          </a>

          <div className="site-header__actions">
            <a className="site-header__link" href="#products">Store</a>
            <CartButton />
          </div>
        </div>
      </header>

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  )
}

export default Header
