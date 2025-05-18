// contexts/AuthContext.tsx

'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { IUserResponse, UserRole } from '@/types/user'

// Tipos para el contexto
interface AuthContextType {
  user: IUserResponse | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Hook para usar el contexto
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}

// Provider del contexto
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUserResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Verificar si el usuario está autenticado
  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include', // Incluir cookies
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setUser(data.user)
        } else {
          setUser(null)
        }
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Función de login
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Incluir cookies
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setUser(data.user)
        return { success: true, message: data.message }
      } else {
        return {
          success: false,
          message: data.message || 'Error en el login'
        }
      }
    } catch (error) {
      console.error('Error en login:', error)
      return {
        success: false,
        message: 'Error de conexión'
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Función de logout
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error) {
      console.error('Error en logout:', error)
    } finally {
      setUser(null)
    }
  }

  // Verificar autenticación al montar el componente
  useEffect(() => {
    checkAuth()
  }, [])

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    checkAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Helper functions para roles
export function hasRole(user: IUserResponse | null, role: UserRole): boolean {
  return user?.role === role
}

export function hasAnyRole(user: IUserResponse | null, roles: UserRole[]): boolean {
  return user ? roles.includes(user.role) : false
}

export function isAdmin(user: IUserResponse | null): boolean {
  return hasRole(user, UserRole.ADMIN)
}

export function isSecretary(user: IUserResponse | null): boolean {
  return hasRole(user, UserRole.SECRETARIA)
}

export function isDoctor(user: IUserResponse | null): boolean {
  return hasRole(user, UserRole.MEDICO)
}
