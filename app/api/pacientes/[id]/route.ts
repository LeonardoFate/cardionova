// app/api/pacientes/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/connection'
import Paciente from '@/lib/models/Paciente'
import { getCurrentUser } from '@/lib/db/auth/auth'
import { updatePacienteSchema } from '@/lib/db/validations/paciente'
import { handleValidationError } from '@/lib/db/validations'
import type { IPacienteResponse } from '@/types/paciente'
import mongoose from 'mongoose'

interface SuccessResponse {
  success: true
  message: string
  paciente?: IPacienteResponse
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

// GET - Obtener paciente específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 0. Await params
    const { id } = await params

    // 1. Verificar autenticación
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({
        success: false,
        message: 'No autorizado'
      }, { status: 401 })
    }

    // 2. Validar ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({
        success: false,
        message: 'ID de paciente inválido'
      }, { status: 400 })
    }

    // 3. Conectar a la base de datos
    await dbConnect()

    // 4. Buscar paciente
    const paciente = await Paciente.findById(id)
      .populate('medicoAsignado', 'firstName lastName profile.speciality')
      .populate('registradoPor', 'firstName lastName')

    if (!paciente) {
      return NextResponse.json({
        success: false,
        message: 'Paciente no encontrado'
      }, { status: 404 })
    }

    // 5. Verificar permisos (médicos solo ven sus pacientes)
    if (currentUser.role === 'MEDICO' && String(paciente.medicoAsignado._id) !== currentUser.userId) {
      return NextResponse.json({
        success: false,
        message: 'No tienes acceso a este paciente'
      }, { status: 403 })
    }

    // 6. Formatear respuesta
    const pacienteResponse = convertPacienteToResponse(paciente)

    const successResponse: SuccessResponse = {
      success: true,
      message: 'Paciente obtenido correctamente',
      paciente: pacienteResponse
    }

    return NextResponse.json(successResponse, { status: 200 })

  } catch (error) {
    console.error('Error obteniendo paciente:', error)

    return NextResponse.json({
      success: false,
      message: 'Error interno del servidor'
    }, { status: 500 })
  }
}

// PUT - Actualizar paciente
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 0. Await params
    const { id } = await params

    // 1. Verificar autenticación
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({
        success: false,
        message: 'No autorizado'
      }, { status: 401 })
    }

    // 2. Validar ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({
        success: false,
        message: 'ID de paciente inválido'
      }, { status: 400 })
    }

    // 3. Conectar a la base de datos
    await dbConnect()

    // 4. Verificar que el paciente existe
    const existingPaciente = await Paciente.findById(id)

    if (!existingPaciente) {
      return NextResponse.json({
        success: false,
        message: 'Paciente no encontrado'
      }, { status: 404 })
    }

    // 5. Verificar permisos
    if (currentUser.role === 'MEDICO') {
      // Médicos solo pueden actualizar estado y historia clínica de sus pacientes
      if (String(existingPaciente.medicoAsignado) !== currentUser.userId) {
        return NextResponse.json({
          success: false,
          message: 'No tienes acceso a este paciente'
        }, { status: 403 })
      }
    }

    // 6. Validar datos
    const body = await request.json()
    const validationResult = updatePacienteSchema.safeParse(body)

    if (!validationResult.success) {
      const errorResponse = handleValidationError(validationResult.error)
      return NextResponse.json(errorResponse, { status: 400 })
    }

    const updateData = validationResult.data

    // 7. Si se actualiza fecha de nacimiento, recalcular edad
    if (updateData.fechaNacimiento) {
      const fechaNac = new Date(updateData.fechaNacimiento)
      const today = new Date()
      let edad = today.getFullYear() - fechaNac.getFullYear()
      const monthDiff = today.getMonth() - fechaNac.getMonth()

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < fechaNac.getDate())) {
        edad--
      }

      updateData.edad = edad
    }

    // 8. Actualizar paciente
    const updatedPaciente = await Paciente.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('medicoAsignado', 'firstName lastName profile.speciality')
      .populate('registradoPor', 'firstName lastName')

    if (!updatedPaciente) {
      return NextResponse.json({
        success: false,
        message: 'Error actualizando paciente'
      }, { status: 500 })
    }

    // 9. Formatear respuesta
    const pacienteResponse = convertPacienteToResponse(updatedPaciente)

    const successResponse: SuccessResponse = {
      success: true,
      message: 'Paciente actualizado correctamente',
      paciente: pacienteResponse
    }

    return NextResponse.json(successResponse, { status: 200 })

  } catch (error) {
    console.error('Error actualizando paciente:', error)

    return NextResponse.json({
      success: false,
      message: 'Error interno del servidor'
    }, { status: 500 })
  }
}

// DELETE - Eliminar paciente
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 0. Await params
    const { id } = await params

    // 1. Verificar autenticación
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({
        success: false,
        message: 'No autorizado'
      }, { status: 401 })
    }

    // Solo admin puede eliminar pacientes
    if (currentUser.role !== 'ADMIN') {
      return NextResponse.json({
        success: false,
        message: 'No tienes permisos para eliminar pacientes'
      }, { status: 403 })
    }

    // 2. Validar ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({
        success: false,
        message: 'ID de paciente inválido'
      }, { status: 400 })
    }

    // 3. Conectar a la base de datos
    await dbConnect()

    // 4. Eliminar paciente
    const deletedPaciente = await Paciente.findByIdAndDelete(id)

    if (!deletedPaciente) {
      return NextResponse.json({
        success: false,
        message: 'Paciente no encontrado'
      }, { status: 404 })
    }

    const successResponse: SuccessResponse = {
      success: true,
      message: 'Paciente eliminado correctamente'
    }

    return NextResponse.json(successResponse, { status: 200 })

  } catch (error) {
    console.error('Error eliminando paciente:', error)

    return NextResponse.json({
      success: false,
      message: 'Error interno del servidor'
    }, { status: 500 })
  }
}
