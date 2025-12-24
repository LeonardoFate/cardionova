// hooks/usePacientes.ts

import { useState, useCallback } from 'react'
import { IPacienteResponse, CreatePacienteInput, UpdatePacienteInput, EstadoPaciente } from '@/types/paciente'

interface UsePacientesReturn {
  pacientes: IPacienteResponse[]
  total: number
  page: number
  limit: number
  isLoading: boolean
  error: string | null
  fetchPacientes: (params?: FetchPacientesParams) => Promise<void>
  createPaciente: (data: CreatePacienteInput) => Promise<IPacienteResponse | null>
  updatePaciente: (id: string, data: UpdatePacienteInput) => Promise<IPacienteResponse | null>
  deletePaciente: (id: string) => Promise<boolean>
  clearError: () => void
}

interface FetchPacientesParams {
  page?: number
  limit?: number
  medicoId?: string
  estado?: EstadoPaciente
  search?: string
  fecha?: string
}

export function usePacientes(): UsePacientesReturn {
  const [pacientes, setPacientes] = useState<IPacienteResponse[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const fetchPacientes = useCallback(async (params?: FetchPacientesParams) => {
    try {
      setIsLoading(true)
      setError(null)

      const queryParams = new URLSearchParams()

      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      if (params?.medicoId) queryParams.append('medicoId', params.medicoId)
      if (params?.estado) queryParams.append('estado', params.estado)
      if (params?.search) queryParams.append('search', params.search)
      if (params?.fecha) queryParams.append('fecha', params.fecha)

      const response = await fetch(`/api/pacientes?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener pacientes')
      }

      if (data.success) {
        setPacientes(data.pacientes || [])
        setTotal(data.total || 0)
        setPage(data.page || 1)
        setLimit(data.limit || 10)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      console.error('Error fetching pacientes:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createPaciente = useCallback(async (data: CreatePacienteInput): Promise<IPacienteResponse | null> => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/pacientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Error al crear paciente')
      }

      if (result.success && result.paciente) {
        // Actualizar lista de pacientes
        setPacientes(prev => [result.paciente, ...prev])
        return result.paciente
      }

      return null
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      console.error('Error creating paciente:', err)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updatePaciente = useCallback(async (
    id: string,
    data: UpdatePacienteInput
  ): Promise<IPacienteResponse | null> => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/pacientes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Error al actualizar paciente')
      }

      if (result.success && result.paciente) {
        // Actualizar paciente en la lista
        setPacientes(prev =>
          prev.map(p => p._id === id ? result.paciente : p)
        )
        return result.paciente
      }

      return null
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      console.error('Error updating paciente:', err)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deletePaciente = useCallback(async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/pacientes/${id}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Error al eliminar paciente')
      }

      if (result.success) {
        // Eliminar paciente de la lista
        setPacientes(prev => prev.filter(p => p._id !== id))
        return true
      }

      return false
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      console.error('Error deleting paciente:', err)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    pacientes,
    total,
    page,
    limit,
    isLoading,
    error,
    fetchPacientes,
    createPaciente,
    updatePaciente,
    deletePaciente,
    clearError
  }
}
