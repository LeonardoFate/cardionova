// components/ui/page-transition.tsx

'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    // Skip transitions for medical access routes (they have their own loading)
    if (pathname.startsWith('/acceso-medicos')) {
      setIsVisible(true)
      return
    }

    // Natural fade transition for public pages
    setIsVisible(false)

    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 50) // Very quick, just enough to feel smooth

    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <div
      className={`transition-opacity duration-300 ease-in-out ${
        isVisible ? 'opacity-100' : 'opacity-95'
      }`}
    >
      {children}
    </div>
  )
}
