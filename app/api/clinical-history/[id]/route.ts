// app/api/historia-clinica/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/connection'
import HistoriaClinica from '@/lib/models/HistoriaClinica'
import { getCurrentUser } from '@/lib/db/auth/auth'
import { updateHistoriaClinicaSchema } from '@/lib/db/validations/historia-clinica'
import { handleValidationError } from '@/lib/db/validations'
import type { IHistoriaClinicaResponse } from '@/types/historia-clinica'
import mongoose from 'mongoose'

interface SuccessResponse {
  success: true
  message: string
  historia?: IHistoriaClinicaResponse
}

interface ErrorResponse {
  success: false
  message: string
  errors?: string[]
}

// GET - Obtener historia clínica específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Verificar autenticación y permisos
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({
        success: false,
        message: 'No autorizado'
      }, { status: 401 })
    }

    if (currentUser.role !== 'MEDICO' && currentUser.role !== 'ADMIN') {
      return NextResponse.json({
        success: false,
        message: 'Acceso denegado'
      }, { status: 403 })
    }

    // 2. Validar ID
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({
        success: false,
        message: 'ID de historia clínica inválido'
      }, { status: 400 })
    }

    // 3. Conectar a la base de datos
    await dbConnect()

    // 4. Buscar historia clínica
    const filters: any = { _id: params.id }

    // Los médicos solo pueden ver sus propias historias
    if (currentUser.role === 'MEDICO') {
      filters.medico = currentUser.userId
    }

    // 🔧 CORRECCIÓN 1: Agregar casting explícito aquí
    const historia = await HistoriaClinica.findOne(filters)
      .populate('medico', 'firstName lastName profile.speciality')
      .lean() as IHistoriaClinicaResponse | null

    if (!historia) {
      return NextResponse.json({
        success: false,
        message: 'Historia clínica no encontrada'
      }, { status: 404 })
    }

    const successResponse: SuccessResponse = {
      success: true,
      message: 'Historia clínica obtenida correctamente',
      historia: historia // Ya no necesita casting aquí porque historia ya es del tipo correcto
    }

    return NextResponse.json(successResponse, { status: 200 })

  } catch (error) {
    console.error('Error obteniendo historia clínica:', error)

    return NextResponse.json({
      success: false,
      message: 'Error interno del servidor'
    }, { status: 500 })
  }
}

// PUT - Actualizar historia clínica
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Verificar autenticación y permisos
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({
        success: false,
        message: 'No autorizado'
      }, { status: 401 })
    }

    if (currentUser.role !== 'MEDICO') {
      return NextResponse.json({
        success: false,
        message: 'Solo los médicos pueden actualizar historias clínicas'
      }, { status: 403 })
    }

    // 2. Validar ID
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({
        success: false,
        message: 'ID de historia clínica inválido'
      }, { status: 400 })
    }

    // 3. Conectar a la base de datos
    await dbConnect()

    // 4. Verificar que la historia existe y pertenece al médico
    const existingHistoria = await HistoriaClinica.findOne({
      _id: params.id,
      medico: currentUser.userId
    })

    if (!existingHistoria) {
      return NextResponse.json({
        success: false,
        message: 'Historia clínica no encontrada o no tienes permisos para editarla'
      }, { status: 404 })
    }

    // 5. Obtener y validar datos del request
    const body = await request.json()
    const validationResult = updateHistoriaClinicaSchema.safeParse(body)

    if (!validationResult.success) {
      const errorResponse = handleValidationError(validationResult.error)
      return NextResponse.json(errorResponse, { status: 400 })
    }

    const updateData = validationResult.data

    // 6. Actualizar historia clínica
    // 🔧 CORRECCIÓN 2: Agregar casting explícito aquí
    const historiaActualizada = await HistoriaClinica.findByIdAndUpdate(
      params.id,
      { ...updateData, medico: currentUser.userId }, // Asegurar que el médico no cambie
      { new: true, runValidators: true }
    )
      .populate('medico', 'firstName lastName profile.speciality')
      .lean() as IHistoriaClinicaResponse | null

    if (!historiaActualizada) {
      return NextResponse.json({
        success: false,
        message: 'Error actualizando historia clínica'
      }, { status: 500 })
    }

    const successResponse: SuccessResponse = {
      success: true,
      message: 'Historia clínica actualizada correctamente',
      historia: historiaActualizada // Ya no necesita casting aquí
    }

    return NextResponse.json(successResponse, { status: 200 })

  } catch (error) {
    console.error('Error actualizando historia clínica:', error)

    return NextResponse.json({
      success: false,
      message: 'Error interno del servidor'
    }, { status: 500 })
  }
}

// DELETE - Eliminar historia clínica (solo admins)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Verificar autenticación y permisos
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({
        success: false,
        message: 'No autorizado'
      }, { status: 401 })
    }

    // Solo administradores pueden eliminar historias clínicas
    if (currentUser.role !== 'ADMIN') {
      return NextResponse.json({
        success: false,
        message: 'Solo los administradores pueden eliminar historias clínicas'
      }, { status: 403 })
    }

    // 2. Validar ID
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({
        success: false,
        message: 'ID de historia clínica inválido'
      }, { status: 400 })
    }

    // 3. Conectar a la base de datos
    await dbConnect()

    // 4. Eliminar historia clínica
    const historiaEliminada = await HistoriaClinica.findByIdAndDelete(params.id)

    if (!historiaEliminada) {
      return NextResponse.json({
        success: false,
        message: 'Historia clínica no encontrada'
      }, { status: 404 })
    }

    const successResponse: SuccessResponse = {
      success: true,
      message: 'Historia clínica eliminada correctamente'
    }

    return NextResponse.json(successResponse, { status: 200 })

  } catch (error) {
    console.error('Error eliminando historia clínica:', error)

    return NextResponse.json({
      success: false,
      message: 'Error interno del servidor'
    }, { status: 500 })
  }
}