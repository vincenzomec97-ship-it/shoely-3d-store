import { useCallback, useRef, useState } from 'react'
import CartButton from '../ui/CartButton.jsx'
import MobileMenu from './MobileMenu.jsx'
import { useNavigation } from '../../context/NavigationContext.jsx'

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuTriggerRef = useRef(null)
  const { route } = useNavigation()

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false)
    setTimeout(() => menuTriggerRef.current?.focus(), 0)
  }, [])

  return (
    <>
      <header className="site-header">
        <div className="site-shell site-header__inner">
          <div className="site-header__group">
            <button
              ref={menuTriggerRef}
              className="menu-trigger"
              type="button"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? 'Chiudi menu di navigazione' : 'Apri menu di navigazione'}
              onClick={() => setIsMenuOpen(true)}
            >
              <span className="menu-trigger__icon" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
              <span className="menu-trigger__label">Menu</span>
            </button>
            <a className="site-header__link" href="#/about" aria-current={route === '/about' ? 'page' : undefined}>About</a>
            <a className="site-header__link" href="#/info" aria-current={route === '/info' ? 'page' : undefined}>Info</a>
          </div>

          <a
            className="brand"
            href="#/"
            aria-label="Shoes M.V., torna alla home"
            aria-current={route === '/' ? 'page' : undefined}
          >
            Shoes <span className="brand__mark">M.V.</span>
          </a>

          <div className="site-header__actions">
            <a className="site-header__link" href="#/store" aria-current={route === '/store' ? 'page' : undefined}>Store</a>
            <CartButton />
          </div>
        </div>
      </header>

      <MobileMenu isOpen={isMenuOpen} onClose={closeMenu} />
    </>
  )
}

export default Header
