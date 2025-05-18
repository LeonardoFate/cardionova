// hooks/useAuth.ts

'use client'

import { useContext } from 'react'
import { useAuth as useAuthContext } from '@/contexts/AuthContext'

// Re-exportar el hook para consistencia
export const useAuth = useAuthContext

// Hook adicional para verificar roles específicos
export function useRole() {
  const { user } = useAuth()

  return {
    isAdmin: user?.role === 'ADMIN',
    isSecretary: user?.role === 'SECRETARIA',
    isDoctor: user?.role === 'MEDICO',
    role: user?.role,
    hasRole: (role: string) => user?.role === role,
    hasAnyRole: (roles: string[]) => user ? roles.includes(user.role) : false,
  }
}
