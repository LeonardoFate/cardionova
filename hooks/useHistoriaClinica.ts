// hooks/useHistoriaClinica.ts

import { useState, useCallback } from 'react'
import {
  IHistoriaClinicaResponse,
  IHistoriaClinicaCreate,
  IHistoriaClinica
} from '@/types/historia-clinica'

// Tipos para las operaciones
interface HistoriaClinicaQuery {
  page?: number
  limit?: number
  cedula?: string
  medico?: string
  fechaDesde?: Date
  fechaHasta?: Date
  search?: string
}

interface HistoriasResponse {
  historias: IHistoriaClinicaResponse[]
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

export function useHistoriaClinica() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Obtener lista de historias clínicas
  const getHistorias = useCallback(async (query: HistoriaClinicaQuery = {}): Promise<HistoriasResponse | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const searchParams = new URLSearchParams()

      if (query.page) searchParams.append('page', query.page.toString())
      if (query.limit) searchParams.append('limit', query.limit.toString())
      if (query.cedula) searchParams.append('cedula', query.cedula)
      if (query.medico) searchParams.append('medico', query.medico)
      if (query.search) searchParams.append('search', query.search)
      if (query.fechaDesde) {
        searchParams.append('fechaDesde', query.fechaDesde.toISOString())
      }
      if (query.fechaHasta) {
        searchParams.append('fechaHasta', query.fechaHasta.toISOString())
      }

      const url = `/api/historia-clinica${searchParams.toString() ? `?${searchParams.toString()}` : ''}`

      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error obteniendo historias clínicas')
      }

      if (data.success) {
        return {
          historias: data.historias,
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

  // Obtener historia clínica específica
  const getHistoria = useCallback(async (id: string): Promise<IHistoriaClinicaResponse | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/historia-clinica/${id}`, {
        method: 'GET',
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error obteniendo historia clínica')
      }

      if (data.success) {
        return data.historia
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

  // Crear nueva historia clínica
  const createHistoria = useCallback(async (historiaData: IHistoriaClinicaCreate): Promise<IHistoriaClinicaResponse | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/historia-clinica', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(historiaData),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          throw new Error(data.errors.join(', '))
        }
        throw new Error(data.message || 'Error creando historia clínica')
      }

      if (data.success) {
        return data.historia
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

  // Actualizar historia clínica
  const updateHistoria = useCallback(async (id: string, historiaData: Partial<IHistoriaClinica>): Promise<IHistoriaClinicaResponse | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/historia-clinica/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(historiaData),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          throw new Error(data.errors.join(', '))
        }
        throw new Error(data.message || 'Error actualizando historia clínica')
      }

      if (data.success) {
        return data.historia
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

  // Eliminar historia clínica (solo admins)
  const deleteHistoria = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/historia-clinica/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error eliminando historia clínica')
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

  // Buscar historias por paciente (cédula)
  const getHistoriasByPaciente = useCallback(async (cedula: string): Promise<IHistoriaClinicaResponse[] | null> => {
    const result = await getHistorias({ cedula, limit: 100 })
    return result ? result.historias : null
  }, [getHistorias])

  // Calcular IMC
  const calcularIMC = useCallback((peso: number, estatura: number): number => {
    const estaturaEnMetros = estatura / 100
    return Math.round((peso / (estaturaEnMetros * estaturaEnMetros)) * 100) / 100
  }, [])

  // Validar signos vitales
  const validarSignosVitales = useCallback((signos: any) => {
    const errores: string[] = []

    if (signos.frecuenciaCardiaca < 30 || signos.frecuenciaCardiaca > 220) {
      errores.push('Frecuencia cardíaca fuera del rango normal (30-220)')
    }

    if (signos.satO2 < 50 || signos.satO2 > 100) {
      errores.push('Saturación de oxígeno fuera del rango normal (50-100)')
    }

    if (signos.temperatura < 30 || signos.temperatura > 45) {
      errores.push('Temperatura fuera del rango normal (30-45°C)')
    }

    if (!/^\d{2,3}\/\d{2,3}$/.test(signos.presionArterial)) {
      errores.push('Formato de presión arterial inválido (ej: 120/80)')
    }

    return {
      esValido: errores.length === 0,
      errores
    }
  }, [])

  return {
    isLoading,
    error,
    getHistorias,
    getHistoria,
    createHistoria,
    updateHistoria,
    deleteHistoria,
    getHistoriasByPaciente,
    calcularIMC,
    validarSignosVitales,
    clearError: () => setError(null)
  }
}
