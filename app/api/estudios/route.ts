// app/api/estudios/route.ts

import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/connection'
import Estudio from '@/lib/models/Estudio'
import { getCurrentUser } from '@/lib/db/auth/auth'
import { IEstudioResponse, EstadoEstudio, TipoEstudio } from '@/types/estudio'

// GET - Obtener lista de estudios
export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({
        success: false,
        message: 'No autorizado'
      }, { status: 401 })
    }

    await dbConnect()

    const { searchParams } = new URL(request.url)
    const pacienteId = searchParams.get('pacienteId')
    const estado = searchParams.get('estado')
    const tipoEstudio = searchParams.get('tipoEstudio')

    let query: any = {}

    // Filtrar por paciente si se especifica
    if (pacienteId) {
      query.pacienteId = pacienteId
    }

    // Filtrar por estado
    if (estado) {
      query.estado = estado
    }

    // Filtrar por tipo de estudio
    if (tipoEstudio) {
      query.tipoEstudio = tipoEstudio
    }

    // Si es médico, solo ver sus propios estudios (a menos que sea admin)
    if (currentUser.role === 'MEDICO') {
      query.medicoSolicitanteId = currentUser.userId
    }

    const estudios = await Estudio.find(query).sort({ fechaSolicitud: -1 })

    const estudiosResponse: IEstudioResponse[] = estudios.map(estudio => ({
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
    }))

    return NextResponse.json({
      success: true,
      estudios: estudiosResponse,
      total: estudiosResponse.length
    }, { status: 200 })

  } catch (error) {
    console.error('Error obteniendo estudios:', error)
    return NextResponse.json({
      success: false,
      message: 'Error interno del servidor'
    }, { status: 500 })
  }
}

// POST - Crear nuevo estudio
export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({
        success: false,
        message: 'No autorizado'
      }, { status: 401 })
    }

    // Solo médicos y admin pueden crear estudios
    if (currentUser.role !== 'MEDICO' && currentUser.role !== 'ADMIN') {
      return NextResponse.json({
        success: false,
        message: 'Solo médicos pueden solicitar estudios'
      }, { status: 403 })
    }

    await dbConnect()

    const body = await request.json()

    const nuevoEstudio = await Estudio.create({
      ...body,
      estado: EstadoEstudio.PENDIENTE,
      archivosPDF: []
    })

    const estudioResponse: IEstudioResponse = {
      _id: nuevoEstudio._id.toString(),
      pacienteId: nuevoEstudio.pacienteId.toString(),
      pacienteNombre: nuevoEstudio.pacienteNombre,
      pacienteCedula: nuevoEstudio.pacienteCedula,
      tipoEstudio: nuevoEstudio.tipoEstudio,
      estado: nuevoEstudio.estado,
      fechaSolicitud: nuevoEstudio.fechaSolicitud,
      fechaRealizacion: nuevoEstudio.fechaRealizacion,
      medicoSolicitante: nuevoEstudio.medicoSolicitante,
      medicoSolicitanteId: nuevoEstudio.medicoSolicitanteId.toString(),
      informe: nuevoEstudio.informe,
      hallazgos: nuevoEstudio.hallazgos,
      conclusion: nuevoEstudio.conclusion,
      recomendaciones: nuevoEstudio.recomendaciones,
      archivosPDF: nuevoEstudio.archivosPDF,
      observaciones: nuevoEstudio.observaciones,
      createdAt: nuevoEstudio.createdAt,
      updatedAt: nuevoEstudio.updatedAt
    }

    return NextResponse.json({
      success: true,
      message: 'Estudio creado correctamente',
      estudio: estudioResponse
    }, { status: 201 })

  } catch (error) {
    console.error('Error creando estudio:', error)
    return NextResponse.json({
      success: false,
      message: 'Error interno del servidor'
    }, { status: 500 })
  }
}
