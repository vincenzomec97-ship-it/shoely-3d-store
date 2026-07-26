import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import products from '../data/products.js'

const ProductContext = createContext(null)

export function ProductProvider({ children }) {
  const [selectedProductId, setSelectedProductId] = useState(products[0].id)
  const [searchQuery, setSearchQuery] = useState('')
  const clearSearch = useCallback(() => setSearchQuery(''), [])

  const value = useMemo(() => {
    const selectedProduct =
      products.find((product) => product.id === selectedProductId) ?? products[0]
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase('it-IT')
    const filteredProducts = normalizedQuery
      ? products.filter((product) =>
          `${product.name} ${product.subtitle}`
            .toLocaleLowerCase('it-IT')
            .includes(normalizedQuery),
        )
      : products

    return {
      products,
      filteredProducts,
      selectedProduct,
      selectProduct: setSelectedProductId,
      searchQuery,
      setSearchQuery,
      clearSearch,
    }
  }, [clearSearch, searchQuery, selectedProductId])

  return <ProductContext value={value}>{children}</ProductContext>
}

export function useProductSelection() {
  const context = useContext(ProductContext)

  if (!context) {
    throw new Error('useProductSelection deve essere usato dentro ProductProvider')
  }

  return context
}
