function SearchBar() {
  function handleSubmit(event) {
    event.preventDefault()
  }

  return (
    <form className="search-form" role="search" onSubmit={handleSubmit}>
      <label className="visually-hidden" htmlFor="product-search">Cerca un prodotto</label>
      <input
        id="product-search"
        name="search"
        type="search"
        placeholder="Cerca un modello"
        autoComplete="off"
      />
      <button type="submit" aria-label="Cerca">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="m16 16 4 4" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </button>
    </form>
  )
}

export default SearchBar
