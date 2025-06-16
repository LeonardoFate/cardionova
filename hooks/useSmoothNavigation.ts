'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from '@/contexts/TransitionContext'
import { useCallback } from 'react'

export function useSmoothNavigation() {
  const router = useRouter()
  const { startTransition } = useTransition()

  const navigateTo = useCallback((href: string) => {
    startTransition()

    // Pequeño delay para que la transición de salida se inicie
    setTimeout(() => {
      router.push(href)
    }, 50)
  }, [router, startTransition])

  return { navigateTo }
}
