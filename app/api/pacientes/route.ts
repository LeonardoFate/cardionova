// app/api/pacientes/route.ts

import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/connection'
import Paciente from '@/lib/models/Paciente'
import { getCurrentUser } from '@/lib/db/auth/auth'
import { createPacienteSchema, pacienteQuerySchema } from '@/lib/db/validations/paciente'
import { handleValidationError } from '@/lib/db/validations'
import type { IPacienteResponse } from '@/types/paciente'

interface SuccessResponse {
  success: true
  message: string
  paciente?: IPacienteResponse
  pacientes?: IPacienteResponse[]
  total?: number
  page?: number
  limit?: number
}

interface ErrorResponse {
  success: false
  message: string
  errors?: string[]
}

// Función auxiliar para convertir documento a respuesta
function convertPacienteToResponse(paciente: any): IPacienteResponse {
  return {
    _id: String(paciente._id),
    nombre: paciente.nombre,
    apellido: paciente.apellido,
    cedula: paciente.cedula,
    fechaNacimiento: paciente.fechaNacimiento,
    edad: paciente.edad,
    telefono: paciente.telefono,
    email: paciente.email,
    direccion: paciente.direccion,
    tipoSeguro: paciente.tipoSeguro,
    numeroSeguro: paciente.numeroSeguro,
    contactoEmergencia: paciente.contactoEmergencia,
    observaciones: paciente.observaciones,
    medicoAsignado: paciente.medicoAsignado,
    estado: paciente.estado,
    fechaRegistro: paciente.fechaRegistro,
    horaLlegada: paciente.horaLlegada,
    registradoPor: paciente.registradoPor,
    historiaClinicaId: paciente.historiaClinicaId,
    createdAt: paciente.createdAt,
    updatedAt: paciente.updatedAt
  }
}

// GET - Listar pacientes
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

    // 2. Conectar a la base de datos
    await dbConnect()

    // 3. Obtener parámetros de query
    const { searchParams } = new URL(request.url)
    const queryObject = Object.fromEntries(searchParams.entries())

    const validationResult = pacienteQuerySchema.safeParse(queryObject)

    if (!validationResult.success) {
      const errorResponse = handleValidationError(validationResult.error)
      return NextResponse.json(errorResponse, { status: 400 })
    }

    const { page, limit, medicoId, estado, search, fecha } = validationResult.data

    // 4. Construir filtros
    const filters: any = {}

    // Si es médico, solo ver sus pacientes
    if (currentUser.role === 'MEDICO') {
      filters.medicoAsignado = currentUser.userId
    } else if (medicoId) {
      // Admin o secretaria pueden filtrar por médico
      filters.medicoAsignado = medicoId
    }

    if (estado) {
      filters.estado = estado
    }

    if (fecha) {
      const targetDate = new Date(fecha)
      targetDate.setHours(0, 0, 0, 0)
      const nextDay = new Date(targetDate)
      nextDay.setDate(nextDay.getDate() + 1)

      filters.fechaRegistro = {
        $gte: targetDate,
        $lt: nextDay
      }
    }

    if (search) {
      filters.$or = [
        { nombre: { $regex: search, $options: 'i' } },
        { apellido: { $regex: search, $options: 'i' } },
        { cedula: { $regex: search, $options: 'i' } }
      ]
    }

    // 5. Realizar consulta
    const skip = (page - 1) * limit

    const [pacientes, total] = await Promise.all([
      Paciente.find(filters)
        .populate('medicoAsignado', 'firstName lastName profile.speciality')
        .populate('registradoPor', 'firstName lastName')
        .sort({ horaLlegada: 1 })
        .skip(skip)
        .limit(limit),
      Paciente.countDocuments(filters)
    ])

    // 6. Formatear respuesta
    const pacientesResponse = pacientes.map(convertPacienteToResponse)

    const successResponse: SuccessResponse = {
      success: true,
      message: 'Pacientes obtenidos correctamente',
      pacientes: pacientesResponse,
      total,
      page,
      limit
    }

    return NextResponse.json(successResponse, { status: 200 })

  } catch (error) {
    console.error('Error obteniendo pacientes:', error)

    return NextResponse.json({
      success: false,
      message: 'Error interno del servidor'
    }, { status: 500 })
  }
}

// POST - Crear paciente
export async function POST(request: NextRequest) {
  try {
    // 1. Verificar autenticación
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({
        success: false,
        message: 'No autorizado'
      }, { status: 401 })
    }

    // Solo secretarias y admin pueden registrar pacientes
    if (currentUser.role !== 'SECRETARIA' && currentUser.role !== 'ADMIN') {
      return NextResponse.json({
        success: false,
        message: 'No tienes permisos para registrar pacientes'
      }, { status: 403 })
    }

    // 2. Conectar a la base de datos
    await dbConnect()

    // 3. Validar datos
    const body = await request.json()
    const validationResult = createPacienteSchema.safeParse(body)

    if (!validationResult.success) {
      const errorResponse = handleValidationError(validationResult.error)
      return NextResponse.json(errorResponse, { status: 400 })
    }

    const pacienteData = validationResult.data

    // 4. Calcular edad
    const fechaNac = new Date(pacienteData.fechaNacimiento)
    const today = new Date()
    let edad = today.getFullYear() - fechaNac.getFullYear()
    const monthDiff = today.getMonth() - fechaNac.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < fechaNac.getDate())) {
      edad--
    }

    // 5. Crear paciente
    const nuevoPaciente = await Paciente.create({
      ...pacienteData,
      edad,
      registradoPor: currentUser.userId,
      fechaRegistro: new Date(),
      horaLlegada: new Date()
    })

    // 6. Poblar campos relacionados
    await nuevoPaciente.populate([
      { path: 'medicoAsignado', select: 'firstName lastName profile.speciality' },
      { path: 'registradoPor', select: 'firstName lastName' }
    ])

    // 7. Formatear respuesta
    const pacienteResponse = convertPacienteToResponse(nuevoPaciente)

    const successResponse: SuccessResponse = {
      success: true,
      message: 'Paciente registrado correctamente',
      paciente: pacienteResponse
    }

    return NextResponse.json(successResponse, { status: 201 })

  } catch (error) {
    console.error('Error creando paciente:', error)

    return NextResponse.json({
      success: false,
      message: 'Error interno del servidor'
    }, { status: 500 })
  }
}
