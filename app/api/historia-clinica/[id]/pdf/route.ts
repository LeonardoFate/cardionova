// app/api/historia-clinica/[id]/pdf/route.ts

import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/connection'
import HistoriaClinica from '@/lib/models/HistoriaClinica'
import { getCurrentUser } from '@/lib/db/auth/auth'
import { generarPDFHistoriaClinica } from '@/lib/pdf/historia-clinica-generator'
import mongoose from 'mongoose'

interface RouteParams {
  params: {
    id: string
  }
}

// GET - Generar y descargar PDF de Historia Clínica completa
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // 1. Verificar autenticación
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({
        success: false,
        message: 'No autorizado'
      }, { status: 401 })
    }

    // Solo médicos y admins pueden generar PDFs
    if (currentUser.role !== 'MEDICO' && currentUser.role !== 'ADMIN' && currentUser.role !== 'SECRETARIA') {
      return NextResponse.json({
        success: false,
        message: 'Acceso denegado'
      }, { status: 403 })
    }

    // 2. Validar parámetros
    const { id } = params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({
        success: false,
        message: 'ID de historia clínica inválido'
      }, { status: 400 })
    }

    // 3. Conectar a la base de datos
    await dbConnect()

    // 4. Buscar historia clínica con médico poblado
    const filters: any = { _id: id }

    // Los médicos solo pueden generar PDFs de sus propias historias
    if (currentUser.role === 'MEDICO') {
      filters.medico = currentUser.userId
    }

    const historia = await HistoriaClinica.findOne(filters)
      .populate('medico', 'firstName lastName email profile')
      .lean()

    if (!historia) {
      return NextResponse.json({
        success: false,
        message: 'Historia clínica no encontrada o no tienes permisos para acceder a ella'
      }, { status: 404 })
    }

    // 5. Generar PDF
    const pdfBuffer = await generarPDFHistoriaClinica({
      historia,
      medico: historia.medico
    })

    // 6. Preparar nombre del archivo
    const nombrePaciente = historia.paciente.nombre.replace(/\s+/g, '-')
    const fechaConsulta = new Date(historia.fecha).toISOString().split('T')[0]
    const nombreArchivo = `HC-${nombrePaciente}-${fechaConsulta}.pdf`

    // 7. Retornar PDF con headers de descarga
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${nombreArchivo}"`,
        'Content-Length': pdfBuffer.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })

  } catch (error) {
    console.error('Error generando PDF de historia clínica:', error)

    return NextResponse.json({
      success: false,
      message: 'Error interno del servidor al generar el PDF'
    }, { status: 500 })
  }
}
