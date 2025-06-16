'use client'

import { useTransition } from '@/contexts/TransitionContext'

export function LoadingOverlay() {
  const { isTransitioning } = useTransition()

  if (!isTransitioning) return null

  return (
    <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-cardionova-red border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-sm text-gray-600 font-medium">Cargando...</p>
      </div>
    </div>
  )
}
