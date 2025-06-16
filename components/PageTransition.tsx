'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useTransition } from '@/contexts/TransitionContext'

interface PageTransitionProps {
  children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const { isTransitioning, endTransition } = useTransition()
  const [displayChildren, setDisplayChildren] = useState(children)
  const [transitionStage, setTransitionStage] = useState<'entering' | 'entered' | 'exiting'>('entered')

  useEffect(() => {
    if (isTransitioning) {
      setTransitionStage('exiting')

      // Después de la animación de salida, cambiar el contenido
      setTimeout(() => {
        setDisplayChildren(children)
        setTransitionStage('entering')

        // Después de un frame, iniciar la animación de entrada
        requestAnimationFrame(() => {
          setTransitionStage('entered')
          endTransition()
        })
      }, 250) // Duración de animación de salida
    }
  }, [isTransitioning, children, endTransition])

  // Actualizar contenido inmediatamente si no hay transición activa
  useEffect(() => {
    if (!isTransitioning) {
      setDisplayChildren(children)
    }
  }, [children, isTransitioning])

  const getTransitionClasses = () => {
    switch (transitionStage) {
      case 'exiting':
        return 'opacity-0 transform translate-y-4 scale-[0.98]'
      case 'entering':
        return 'opacity-0 transform translate-y-4 scale-[0.98]'
      case 'entered':
        return 'opacity-100 transform translate-y-0 scale-100'
      default:
        return 'opacity-100 transform translate-y-0 scale-100'
    }
  }

  return (
    <div
      className={`transition-all duration-300 ease-out ${getTransitionClasses()}`}
    >
      {displayChildren}
    </div>
  )
}
