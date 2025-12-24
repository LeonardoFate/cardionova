// app/api/test-medicos/route.ts
// Ruta de prueba para verificar médicos en la base de datos

import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/connection'
import User from '@/lib/models/User'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    console.log('✅ Conectado a MongoDB')

    // Buscar todos los médicos
    const medicos = await User.find({ role: 'MEDICO' }, '-password').lean()

    console.log('🔍 Médicos encontrados:', medicos.length)
    console.log('📋 Médicos:', medicos)

    return NextResponse.json({
      success: true,
      message: 'Médicos encontrados',
      total: medicos.length,
      medicos: medicos
    }, { status: 200 })

  } catch (error) {
    console.error('❌ Error:', error)
    return NextResponse.json({
      success: false,
      message: 'Error al buscar médicos',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
