// app/api/ordenes-medicas/[historiaId]/[tipoOrden]/[indice]/pdf/route.ts

import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/connection'
import HistoriaClinica from '@/lib/models/HistoriaClinica'
import { getCurrentUser } from '@/lib/db/auth/auth'
import { generarPDFOrden } from '@/lib/pdf/orden-medica-generator'
import type { IReceta, IEstudioOrden, IReposo, IInterconsulta } from '@/types/orden-medica'
import mongoose from 'mongoose'

interface RouteParams {
  params: {
    historiaId: string
    tipoOrden: string
    indice: string
  }
}

// GET - Generar y descargar PDF de orden médica
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
    if (currentUser.role !== 'MEDICO' && currentUser.role !== 'ADMIN') {
      return NextResponse.json({
        success: false,
        message: 'Acceso denegado'
      }, { status: 403 })
    }

    // 2. Validar parámetros
    const { historiaId, tipoOrden, indice } = params

    if (!mongoose.Types.ObjectId.isValid(historiaId)) {
      return NextResponse.json({
        success: false,
        message: 'ID de historia clínica inválido'
      }, { status: 400 })
    }

    const tiposValidos = ['receta', 'estudio', 'reposo', 'interconsulta']
    if (!tiposValidos.includes(tipoOrden)) {
      return NextResponse.json({
        success: false,
        message: 'Tipo de orden inválido'
      }, { status: 400 })
    }

    const indiceNum = parseInt(indice, 10)
    if (isNaN(indiceNum) || indiceNum < 0) {
      return NextResponse.json({
        success: false,
        message: 'Índice de orden inválido'
      }, { status: 400 })
    }

    // 3. Conectar a la base de datos
    await dbConnect()

    // 4. Buscar historia clínica con médico poblado
    const filters: any = { _id: historiaId }

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

    // 5. Verificar que existan órdenes médicas
    if (!historia.ordenesMedicas) {
      return NextResponse.json({
        success: false,
        message: 'Esta historia clínica no tiene órdenes médicas'
      }, { status: 404 })
    }

    // 6. Extraer la orden específica según tipo e índice
    let orden: IReceta | IEstudioOrden | IReposo | IInterconsulta | undefined
    let tipoOrdenPDF: 'receta' | 'estudio' | 'reposo' | 'interconsulta'

    switch (tipoOrden) {
      case 'receta':
        orden = historia.ordenesMedicas.recetas?.[indiceNum]
        tipoOrdenPDF = 'receta'
        break
      case 'estudio':
        orden = historia.ordenesMedicas.estudios?.[indiceNum]
        tipoOrdenPDF = 'estudio'
        break
      case 'reposo':
        orden = historia.ordenesMedicas.reposos?.[indiceNum]
        tipoOrdenPDF = 'reposo'
        break
      case 'interconsulta':
        orden = historia.ordenesMedicas.interconsultas?.[indiceNum]
        tipoOrdenPDF = 'interconsulta'
        break
      default:
        return NextResponse.json({
          success: false,
          message: 'Tipo de orden no reconocido'
        }, { status: 400 })
    }

    if (!orden) {
      return NextResponse.json({
        success: false,
        message: `Orden ${tipoOrden} con índice ${indiceNum} no encontrada`
      }, { status: 404 })
    }

    // 7. Generar PDF
    const pdfBuffer = await generarPDFOrden({
      tipoOrden: tipoOrdenPDF,
      orden,
      historia,
      medico: historia.medico
    })

    // 8. Retornar PDF con headers de descarga
    const nombreArchivo = `${tipoOrden}-${orden.numero || 'orden'}.pdf`

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
    console.error('Error generando PDF de orden médica:', error)

    return NextResponse.json({
      success: false,
      message: 'Error interno del servidor al generar el PDF'
    }, { status: 500 })
  }
}
