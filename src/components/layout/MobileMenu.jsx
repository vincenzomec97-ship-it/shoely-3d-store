function MobileMenu({ isOpen, onClose }) {
  const links = [
    { label: 'About', href: '#about' },
    { label: 'Info', href: '#info' },
    { label: 'Store', href: '#products' },
  ]

  return (
    <div className="mobile-menu" id="mobile-menu" hidden={!isOpen} aria-hidden={!isOpen}>
      <button className="mobile-menu__close" type="button" aria-label="Chiudi menu" onClick={onClose}>
        ×
      </button>
      <nav className="mobile-menu__nav" aria-label="Navigazione principale">
        {links.map((link) => (
          <a key={link.href} href={link.href} onClick={onClose}>{link.label}</a>
        ))}
      </nav>
    </div>
  )
}

export default MobileMenu
