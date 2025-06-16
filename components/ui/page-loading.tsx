// components/ui/page-loading.tsx

'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Heart } from 'lucide-react'

export function PageLoading() {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsLoading(true)

    // Simular tiempo de carga mínimo para UX
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [pathname])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="bg-[#1e3a8a] p-4 rounded-full animate-pulse">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <div className="absolute inset-0 bg-[#1e3a8a] rounded-full animate-ping opacity-20"></div>
        </div>
        <p className="text-[#1e3a8a] font-medium">Cargando...</p>
      </div>
    </div>
  )
}
