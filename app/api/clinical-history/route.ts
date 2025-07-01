// app/api/historia-clinica/route.ts

import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/connection'
import HistoriaClinica from '@/lib/models/HistoriaClinica'
import { getCurrentUser } from '@/lib/db/auth/auth'
import {
  createHistoriaClinicaSchema,
  historiaClinicaQuerySchema
} from '@/lib/db/validations/historia-clinica'
import { handleValidationError } from '@/lib/db/validations'
import type { IHistoriaClinicaResponse } from '@/types/historia-clinica'

// Tipado para respuestas
interface CreateHistoriaSuccessResponse {
  success: true
  message: string
  historia: IHistoriaClinicaResponse
}

interface GetHistoriasSuccessResponse {
  success: true
  message: string
  historias: IHistoriaClinicaResponse[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

interface ErrorResponse {
  success: false
  message: string
  errors?: string[]
}

// GET - Obtener historias clínicas
export async function GET(request: NextRequest) {
  try {
    // 1. Verificar autenticación
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({
        success: false,
        message: 'No autorizado'
      }, { status: 401 })
    }

    // Solo médicos y admins pueden ver historias clínicas
    if (currentUser.role !== 'MEDICO' && currentUser.role !== 'ADMIN') {
      return NextResponse.json({
        success: false,
        message: 'Acceso denegado'
      }, { status: 403 })
    }

    // 2. Conectar a la base de datos
    await dbConnect()

    // 3. Obtener y validar parámetros de consulta
    const { searchParams } = new URL(request.url)
    const queryParams = Object.fromEntries(searchParams.entries())

    const validationResult = historiaClinicaQuerySchema.safeParse(queryParams)

    if (!validationResult.success) {
      const errorResponse = handleValidationError(validationResult.error)
      return NextResponse.json(errorResponse, { status: 400 })
    }

    const { page, limit, cedula, medico, fechaDesde, fechaHasta, search } = validationResult.data

    // 4. Construir filtros de búsqueda
    const filters: any = {}

    // Los médicos solo pueden ver sus propias historias, los admins pueden ver todas
    if (currentUser.role === 'MEDICO') {
      filters.medico = currentUser.userId
    } else if (medico) {
      filters.medico = medico
    }

    if (cedula) {
      filters['paciente.cedula'] = { $regex: cedula, $options: 'i' }
    }

    if (fechaDesde || fechaHasta) {
      filters.fecha = {}
      if (fechaDesde) filters.fecha.$gte = fechaDesde
      if (fechaHasta) filters.fecha.$lte = fechaHasta
    }

    if (search) {
      filters.$or = [
        { 'paciente.nombre': { $regex: search, $options: 'i' } },
        { 'paciente.cedula': { $regex: search, $options: 'i' } },
        { motivoConsulta: { $regex: search, $options: 'i' } }
      ]
    }

    // 5. Ejecutar consulta con paginación
    const skip = (page - 1) * limit

    const [historias, total] = await Promise.all([
      // 🔧 CORRECCIÓN 1: Agregar casting explícito DESPUÉS del await
      HistoriaClinica.find(filters)
        .populate('medico', 'firstName lastName profile.speciality')
        .sort({ fecha: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      HistoriaClinica.countDocuments(filters)
    ])

    // Cast después de obtener el resultado (usando unknown como paso intermedio)
    const historiasTyped = historias as unknown as IHistoriaClinicaResponse[]

    const totalPages = Math.ceil(total / limit)

    const successResponse: GetHistoriasSuccessResponse = {
      success: true,
      message: 'Historias clínicas obtenidas correctamente',
      historias: historiasTyped,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    }

    return NextResponse.json(successResponse, { status: 200 })

  } catch (error) {
    console.error('Error obteniendo historias clínicas:', error)

    return NextResponse.json({
      success: false,
      message: 'Error interno del servidor'
    }, { status: 500 })
  }
}

// POST - Crear nueva historia clínica
export async function POST(request: NextRequest) {
  try {
    // 1. Verificar autenticación y permisos
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({
        success: false,
        message: 'No autorizado'
      }, { status: 401 })
    }

    // Solo médicos pueden crear historias clínicas
    if (currentUser.role !== 'MEDICO') {
      return NextResponse.json({
        success: false,
        message: 'Solo los médicos pueden crear historias clínicas'
      }, { status: 403 })
    }

    // 2. Conectar a la base de datos
    await dbConnect()

    // 3. Obtener y validar datos del request
    const body = await request.json()
    const validationResult = createHistoriaClinicaSchema.safeParse(body)

    if (!validationResult.success) {
      const errorResponse = handleValidationError(validationResult.error)
      return NextResponse.json(errorResponse, { status: 400 })
    }

    const historiaData = validationResult.data

    // 4. Crear historia clínica
    const nuevaHistoria = new HistoriaClinica({
      ...historiaData,
      medico: currentUser.userId
    })

    await nuevaHistoria.save()

    // 5. Obtener la historia con datos del médico poblados
    // 🔧 CORRECCIÓN 2: Agregar casting explícito aquí
    const historiaCompleta = await HistoriaClinica.findById(nuevaHistoria._id)
      .populate('medico', 'firstName lastName profile.speciality')
      .lean() as IHistoriaClinicaResponse | null

    if (!historiaCompleta) {
      return NextResponse.json({
        success: false,
        message: 'Error obteniendo la historia clínica creada'
      }, { status: 500 })
    }

    const successResponse: CreateHistoriaSuccessResponse = {
      success: true,
      message: 'Historia clínica creada exitosamente',
      historia: historiaCompleta // Ya no necesita casting aquí
    }

    return NextResponse.json(successResponse, { status: 201 })

  } catch (error) {
    console.error('Error creando historia clínica:', error)

    return NextResponse.json({
      success: false,
      message: 'Error interno del servidor'
    }, { status: 500 })
  }
}

// Manejar otros métodos HTTP
export async function PUT() {
  return NextResponse.json(
    { success: false, message: 'Método no permitido' },
    { status: 405 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { success: false, message: 'Método no permitido' },
    { status: 405 }
  )
}