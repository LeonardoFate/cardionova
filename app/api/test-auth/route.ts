// app/api/test-auth/route.ts

import { NextRequest, NextResponse } from 'next/server'

// Este endpoint es temporal para probar que las rutas de auth funcionan
export async function GET(request: NextRequest) {
  return NextResponse.json({
    endpoints: [
      'POST /api/auth/login - Iniciar sesión',
      'GET /api/auth/me - Obtener usuario actual',
      'POST /api/auth/logout - Cerrar sesión'
    ],
    timestamp: new Date().toISOString()
  })
}
