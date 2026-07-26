import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import products from '../data/products.js'

const STORAGE_KEY = 'shoely-cart-v1'
const MAX_QUANTITY = 99
const CartContext = createContext(null)

function readStoredCart() {
  if (typeof window === 'undefined') return []

  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]')
    if (!Array.isArray(stored)) return []

    return stored.flatMap((entry) => {
      const product = products.find((item) => item.id === entry?.id)
      const quantity = Number(entry?.quantity)

      if (!product || !Number.isInteger(quantity) || quantity < 1) return []

      return [{ id: product.id, quantity: Math.min(quantity, MAX_QUANTITY) }]
    })
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [cartEntries, setCartEntries] = useState(readStoredCart)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const openerRef = useRef(null)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cartEntries))
    } catch {
      // Il carrello resta utilizzabile anche se lo storage non è disponibile.
    }
  }, [cartEntries])

  const addItem = useCallback((productId) => {
    if (!products.some((product) => product.id === productId)) return

    setCartEntries((current) => {
      const existing = current.find((entry) => entry.id === productId)
      if (!existing) return [...current, { id: productId, quantity: 1 }]

      return current.map((entry) =>
        entry.id === productId
          ? { ...entry, quantity: Math.min(entry.quantity + 1, MAX_QUANTITY) }
          : entry,
      )
    })
  }, [])

  const removeItem = useCallback((productId) => {
    setCartEntries((current) => current.filter((entry) => entry.id !== productId))
  }, [])

  const increaseQuantity = useCallback((productId) => {
    setCartEntries((current) =>
      current.map((entry) =>
        entry.id === productId
          ? { ...entry, quantity: Math.min(entry.quantity + 1, MAX_QUANTITY) }
          : entry,
      ),
    )
  }, [])

  const decreaseQuantity = useCallback((productId) => {
    setCartEntries((current) =>
      current.flatMap((entry) => {
        if (entry.id !== productId) return [entry]
        return entry.quantity > 1 ? [{ ...entry, quantity: entry.quantity - 1 }] : []
      }),
    )
  }, [])

  const clearCart = useCallback(() => setCartEntries([]), [])

  const openCart = useCallback(() => {
    openerRef.current = document.activeElement
    setIsCartOpen(true)
  }, [])

  const closeCart = useCallback(() => {
    setIsCartOpen(false)
    requestAnimationFrame(() => openerRef.current?.focus())
  }, [])

  const value = useMemo(() => {
    const items = cartEntries.flatMap((entry) => {
      const product = products.find((item) => item.id === entry.id)
      return product ? [{ ...entry, product }] : []
    })

    return {
      items,
      totalItems: items.reduce((total, item) => total + item.quantity, 0),
      totalPrice: items.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0,
      ),
      isCartOpen,
      addItem,
      removeItem,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
      openCart,
      closeCart,
    }
  }, [
    addItem,
    cartEntries,
    clearCart,
    closeCart,
    decreaseQuantity,
    increaseQuantity,
    isCartOpen,
    openCart,
    removeItem,
  ])

  return <CartContext value={value}>{children}</CartContext>
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart deve essere usato dentro CartProvider')
  }

  return context
}
