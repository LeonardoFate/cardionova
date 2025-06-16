// components/ui/medical-access-loading.tsx

'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Heart } from 'lucide-react'

export function MedicalAccessLoading() {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Solo mostrar loading para rutas de acceso médico
    const isMedicalRoute = pathname.startsWith('/acceso-medicos')

    if (isMedicalRoute) {
      setIsLoading(true)

      // Loading más largo para acceso médicos (simula verificación de seguridad)
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 800)

      return () => clearTimeout(timer)
    } else {
      setIsLoading(false)
    }
  }, [pathname])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-6">
        {/* Logo de Cardionova */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="bg-[#e11d48] p-4 rounded-lg">
              <Heart className="h-10 w-10 text-white" />
            </div>
            <div className="absolute inset-0 bg-[#e11d48] rounded-lg animate-ping opacity-30"></div>
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-bold text-[#1e3a8a]">Cardionova</h1>
            <p className="text-sm text-gray-600">Especialistas en Cardiología</p>
          </div>
        </div>

        {/* Indicador de carga médico */}
        <div className="flex flex-col items-center space-y-3">
          <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-[#e11d48] rounded-full animate-pulse"></div>
          </div>
          <p className="text-[#1e3a8a] font-medium">Verificando acceso médico...</p>
          <p className="text-xs text-gray-500">Conectando de forma segura</p>
        </div>

        {/* Pulso sutil */}
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-[#e11d48] rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-[#e11d48] rounded-full animate-pulse" style={{animationDelay: '0.1s'}}></div>
          <div className="w-2 h-2 bg-[#e11d48] rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>
    </div>
  )
}
