// hooks/useUsers.ts

import { useState, useCallback } from 'react'
import { IUserResponse, UserRole } from '@/types/user'

// Tipos para las operaciones
interface CreateUserData {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  role: UserRole
  profile?: {
    phone?: string
    speciality?: string
    licenseNumber?: string
    department?: string
  }
}

interface UpdateUserData {
  email?: string
  firstName?: string
  lastName?: string
  role?: UserRole
  isActive?: boolean
  profile?: {
    phone?: string
    speciality?: string
    licenseNumber?: string
    department?: string
  }
}

interface UsersQuery {
  page?: number
  limit?: number
  role?: UserRole
  search?: string
  isActive?: boolean
}

interface UsersResponse {
  users: IUserResponse[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  errors?: string[]
}

export function useUsers() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Obtener lista de usuarios
  const getUsers = useCallback(async (query: UsersQuery = {}): Promise<UsersResponse | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const searchParams = new URLSearchParams()

      if (query.page) searchParams.append('page', query.page.toString())
      if (query.limit) searchParams.append('limit', query.limit.toString())
      if (query.role) searchParams.append('role', query.role)
      if (query.search) searchParams.append('search', query.search)
      if (typeof query.isActive === 'boolean') {
        searchParams.append('isActive', query.isActive.toString())
      }

      const url = `/api/users${searchParams.toString() ? `?${searchParams.toString()}` : ''}`

      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error obteniendo usuarios')
      }

      if (data.success) {
        return {
          users: data.users,
          pagination: data.pagination
        }
      } else {
        throw new Error(data.message)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Obtener usuario específico
  const getUser = useCallback(async (id: string): Promise<IUserResponse | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'GET',
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error obteniendo usuario')
      }

      if (data.success) {
        return data.user
      } else {
        throw new Error(data.message)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Crear nuevo usuario
  const createUser = useCallback(async (userData: CreateUserData): Promise<IUserResponse | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          throw new Error(data.errors.join(', '))
        }
        throw new Error(data.message || 'Error creando usuario')
      }

      if (data.success) {
        return data.user
      } else {
        throw new Error(data.message)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Actualizar usuario
  const updateUser = useCallback(async (id: string, userData: UpdateUserData): Promise<IUserResponse | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          throw new Error(data.errors.join(', '))
        }
        throw new Error(data.message || 'Error actualizando usuario')
      }

      if (data.success) {
        return data.user
      } else {
        throw new Error(data.message)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Desactivar usuario
  const deactivateUser = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error desactivando usuario')
      }

      return data.success
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Reactivar usuario
  const reactivateUser = useCallback(async (id: string): Promise<IUserResponse | null> => {
    return updateUser(id, { isActive: true })
  }, [updateUser])

  return {
    isLoading,
    error,
    getUsers,
    getUser,
    createUser,
    updateUser,
    deactivateUser,
    reactivateUser,
    clearError: () => setError(null)
  }
}
