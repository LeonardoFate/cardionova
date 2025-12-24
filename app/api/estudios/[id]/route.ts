// app/api/estudios/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/connection'
import Estudio from '@/lib/models/Estudio'
import { getCurrentUser } from '@/lib/db/auth/auth'
import { IEstudioResponse } from '@/types/estudio'

// GET - Obtener estudio por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({
        success: false,
        message: 'No autorizado'
      }, { status: 401 })
    }

    await dbConnect()

    const estudio = await Estudio.findById(id)

    if (!estudio) {
      return NextResponse.json({
        success: false,
        message: 'Estudio no encontrado'
      }, { status: 404 })
    }

    // Verificar permisos
    if (currentUser.role === 'MEDICO' && estudio.medicoSolicitanteId.toString() !== currentUser.userId) {
      return NextResponse.json({
        success: false,
        message: 'No tiene permisos para ver este estudio'
      }, { status: 403 })
    }

    const estudioResponse: IEstudioResponse = {
      _id: estudio._id.toString(),
      pacienteId: estudio.pacienteId.toString(),
      pacienteNombre: estudio.pacienteNombre,
      pacienteCedula: estudio.pacienteCedula,
      tipoEstudio: estudio.tipoEstudio,
      estado: estudio.estado,
      fechaSolicitud: estudio.fechaSolicitud,
      fechaRealizacion: estudio.fechaRealizacion,
      medicoSolicitante: estudio.medicoSolicitante,
      medicoSolicitanteId: estudio.medicoSolicitanteId.toString(),
      informe: estudio.informe,
      hallazgos: estudio.hallazgos,
      conclusion: estudio.conclusion,
      recomendaciones: estudio.recomendaciones,
      archivosPDF: estudio.archivosPDF,
      observaciones: estudio.observaciones,
      createdAt: estudio.createdAt,
      updatedAt: estudio.updatedAt
    }

    return NextResponse.json({
      success: true,
      estudio: estudioResponse
    }, { status: 200 })

  } catch (error) {
    console.error('Error obteniendo estudio:', error)
    return NextResponse.json({
      success: false,
      message: 'Error interno del servidor'
    }, { status: 500 })
  }
}

// PUT - Actualizar estudio
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({
        success: false,
        message: 'No autorizado'
      }, { status: 401 })
    }

    await dbConnect()

    const estudio = await Estudio.findById(id)

    if (!estudio) {
      return NextResponse.json({
        success: false,
        message: 'Estudio no encontrado'
      }, { status: 404 })
    }

    // Verificar permisos
    if (currentUser.role === 'MEDICO' && estudio.medicoSolicitanteId.toString() !== currentUser.userId) {
      return NextResponse.json({
        success: false,
        message: 'No tiene permisos para editar este estudio'
      }, { status: 403 })
    }

    const body = await request.json()

    // Actualizar campos
    Object.keys(body).forEach(key => {
      if (key !== '_id' && key !== 'pacienteId' && key !== 'medicoSolicitanteId') {
        (estudio as any)[key] = body[key]
      }
    })

    await estudio.save()

    const estudioResponse: IEstudioResponse = {
      _id: estudio._id.toString(),
      pacienteId: estudio.pacienteId.toString(),
      pacienteNombre: estudio.pacienteNombre,
      pacienteCedula: estudio.pacienteCedula,
      tipoEstudio: estudio.tipoEstudio,
      estado: estudio.estado,
      fechaSolicitud: estudio.fechaSolicitud,
      fechaRealizacion: estudio.fechaRealizacion,
      medicoSolicitante: estudio.medicoSolicitante,
      medicoSolicitanteId: estudio.medicoSolicitanteId.toString(),
      informe: estudio.informe,
      hallazgos: estudio.hallazgos,
      conclusion: estudio.conclusion,
      recomendaciones: estudio.recomendaciones,
      archivosPDF: estudio.archivosPDF,
      observaciones: estudio.observaciones,
      createdAt: estudio.createdAt,
      updatedAt: estudio.updatedAt
    }

    return NextResponse.json({
      success: true,
      message: 'Estudio actualizado correctamente',
      estudio: estudioResponse
    }, { status: 200 })

  } catch (error) {
    console.error('Error actualizando estudio:', error)
    return NextResponse.json({
      success: false,
      message: 'Error interno del servidor'
    }, { status: 500 })
  }
}

// DELETE - Eliminar estudio
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({
        success: false,
        message: 'No autorizado'
      }, { status: 401 })
    }

    // Solo admin puede eliminar estudios
    if (currentUser.role !== 'ADMIN') {
      return NextResponse.json({
        success: false,
        message: 'Solo administradores pueden eliminar estudios'
      }, { status: 403 })
    }

    await dbConnect()

    const estudio = await Estudio.findByIdAndDelete(id)

    if (!estudio) {
      return NextResponse.json({
        success: false,
        message: 'Estudio no encontrado'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Estudio eliminado correctamente'
    }, { status: 200 })

  } catch (error) {
    console.error('Error eliminando estudio:', error)
    return NextResponse.json({
      success: false,
      message: 'Error interno del servidor'
    }, { status: 500 })
  }
}
