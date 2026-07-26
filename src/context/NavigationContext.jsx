import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const ROUTES = new Set(['/', '/store', '/about', '/info'])
const NavigationContext = createContext(null)

function readRoute() {
  const hashRoute = window.location.hash.replace(/^#/, '') || '/'
  return ROUTES.has(hashRoute) ? hashRoute : '/'
}

export function NavigationProvider({ children }) {
  const [route, setRoute] = useState(readRoute)

  useEffect(() => {
    function handleHashChange() {
      setRoute(readRoute())
      window.scrollTo({ top: 0, behavior: 'auto' })
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const navigate = useCallback((nextRoute) => {
    const safeRoute = ROUTES.has(nextRoute) ? nextRoute : '/'

    if (readRoute() === safeRoute) {
      setRoute(safeRoute)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    window.location.hash = safeRoute
  }, [])

  const value = useMemo(() => ({ route, navigate }), [navigate, route])

  return <NavigationContext value={value}>{children}</NavigationContext>
}

export function useNavigation() {
  const context = useContext(NavigationContext)

  if (!context) {
    throw new Error('useNavigation deve essere usato dentro NavigationProvider')
  }

  return context
}
