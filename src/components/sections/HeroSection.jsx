import PrimaryButton from '../ui/PrimaryButton.jsx'
import SearchBar from '../ui/SearchBar.jsx'

function HeroSection() {
  return (
    <section className="hero store-environment" id="top">
      <div className="site-shell hero__grid">
        <div className="hero__content" id="about">
          <p className="hero__eyebrow">Sneaker culture / Roma</p>
          <h1>
            Dove il comfort <span>incontra il design</span>
          </h1>
          <p className="hero__copy">
            Silhouette originali, materiali contemporanei e una nuova prospettiva
            sul movimento quotidiano.
          </p>
          <div className="hero__actions">
            <PrimaryButton href="#products">Shop now</PrimaryButton>
            <SearchBar />
          </div>
        </div>

        <div className="hero__stage" aria-label="Spazio dedicato alla futura sneaker 3D">
          <span className="hero__stage-label">3D product stage</span>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
