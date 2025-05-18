import dbConnect from '@/lib/db/connection'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    await dbConnect()
    return NextResponse.json({
      message: '✅ Conexión exitosa a MongoDB',
      status: 'connected',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      message: '❌ Error conectando a MongoDB',
      error: error.message
    }, { status: 500 })
  }
}
