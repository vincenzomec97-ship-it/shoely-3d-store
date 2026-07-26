import { useProductSelection } from '../../context/ProductContext.jsx'
import { useNavigation } from '../../context/NavigationContext.jsx'

function SearchBar() {
  const { searchQuery, setSearchQuery, clearSearch } = useProductSelection()
  const { navigate } = useNavigation()

  function handleSubmit(event) {
    event.preventDefault()
    navigate('/store')
  }

  return (
    <form className="search-form" role="search" onSubmit={handleSubmit}>
      <label className="visually-hidden" htmlFor="product-search">Cerca un prodotto</label>
      <input
        id="product-search"
        name="search"
        type="search"
        placeholder="Search..."
        autoComplete="off"
        value={searchQuery}
        aria-controls="product-results"
        onChange={(event) => setSearchQuery(event.target.value)}
      />
      {searchQuery && (
        <button
          className="search-form__clear"
          type="button"
          aria-label="Cancella ricerca"
          onClick={clearSearch}
        >
          <span aria-hidden="true">×</span>
        </button>
      )}
      <button className="search-form__submit" type="submit" aria-label="Mostra risultati">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="m16 16 4 4" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </button>
    </form>
  )
}

export default SearchBar
