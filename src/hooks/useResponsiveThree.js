import { useEffect, useMemo, useState } from 'react'

const MOBILE_QUERY = '(max-width: 46rem)'

function useResponsiveThree() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(MOBILE_QUERY).matches,
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_QUERY)
    const updateMatch = (event) => setIsMobile(event.matches)

    setIsMobile(mediaQuery.matches)
    mediaQuery.addEventListener('change', updateMatch)
    return () => mediaQuery.removeEventListener('change', updateMatch)
  }, [])

  return useMemo(
    () => ({
      isMobile,
      camera: {
        fov: isMobile ? 40 : 34,
        near: 0.1,
        far: 100,
        position: isMobile ? [0, 0.25, 7.4] : [0, 0.15, 6.4],
      },
      dpr: isMobile ? [1, 1.25] : [1, 1.75],
    }),
    [isMobile],
  )
}

export default useResponsiveThree
