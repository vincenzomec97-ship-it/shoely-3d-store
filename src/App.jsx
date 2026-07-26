import { useEffect, useRef } from 'react'
import Header from './components/layout/Header.jsx'
import Footer from './components/layout/Footer.jsx'
import HeroSection from './components/sections/HeroSection.jsx'
import ProductsSection from './components/sections/ProductsSection.jsx'
import EditorialPage from './components/sections/EditorialPage.jsx'
import CartDrawer from './components/ui/CartDrawer.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { NavigationProvider, useNavigation } from './context/NavigationContext.jsx'
import { ProductProvider } from './context/ProductContext.jsx'
import { assetUrl } from './utils/assetUrl.js'

function RoutedApp() {
  const { route } = useNavigation()
  const mainRef = useRef(null)
  const initialRoute = useRef(true)

  useEffect(() => {
    if (initialRoute.current) {
      initialRoute.current = false
      return
    }

    mainRef.current?.focus({ preventScroll: true })
  }, [route])

  return (
    <>
      <a className="skip-link" href="#main-content">
        Salta al contenuto
      </a>
      <Header />
      <main
        ref={mainRef}
        id="main-content"
        className="page-view"
        key={route}
        tabIndex="-1"
        style={{
          '--store-background-image': `url("${assetUrl('images/figma-store-background.png')}")`,
        }}
      >
        {route === '/' && <HeroSection />}
        {route === '/store' && <ProductsSection />}
        {(route === '/about' || route === '/info') && (
          <EditorialPage route={route} />
        )}
      </main>
      <Footer />
      <CartDrawer />
    </>
  )
}

function App() {
  return (
    <NavigationProvider>
      <CartProvider>
        <ProductProvider>
          <RoutedApp />
        </ProductProvider>
      </CartProvider>
    </NavigationProvider>
  )
}

export default App
