import Header from './components/layout/Header.jsx'
import Footer from './components/layout/Footer.jsx'
import HeroSection from './components/sections/HeroSection.jsx'
import ProductsSection from './components/sections/ProductsSection.jsx'

function App() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ProductsSection />
      </main>
      <Footer />
    </>
  )
}

export default App
