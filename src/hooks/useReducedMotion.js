import { useEffect, useState } from 'react'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window === 'undefined'
      ? false
      : window.matchMedia(REDUCED_MOTION_QUERY).matches,
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY)
    const updatePreference = (event) => setReducedMotion(event.matches)

    setReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener('change', updatePreference)
    return () => mediaQuery.removeEventListener('change', updatePreference)
  }, [])

  return reducedMotion
}

export default useReducedMotion
