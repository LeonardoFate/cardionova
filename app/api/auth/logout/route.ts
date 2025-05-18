// app/api/auth/logout/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { AUTH_COOKIE_NAME, REFRESH_COOKIE_NAME } from '@/lib/db/auth/auth'

// Tipado para la respuesta
interface LogoutResponse {
  success: boolean
  message: string
}

export async function POST(request: NextRequest) {
  try {
    // 1. Obtener store de cookies
    const cookieStore = cookies()

    // 2. Eliminar cookies de autenticación
    cookieStore.delete(AUTH_COOKIE_NAME)
    cookieStore.delete(REFRESH_COOKIE_NAME)

    // 3. Respuesta exitosa
    const successResponse: LogoutResponse = {
      success: true,
      message: 'Sesión cerrada correctamente'
    }

    return NextResponse.json(successResponse, { status: 200 })

  } catch (error) {
    console.error('Error en logout:', error)

    const errorResponse: LogoutResponse = {
      success: false,
      message: 'Error al cerrar sesión'
    }

    return NextResponse.json(errorResponse, { status: 500 })
  }
}

// Manejar otros métodos HTTP
export async function GET() {
  return NextResponse.json(
    {
      success: false,
      message: 'Método no permitido'
    },
    { status: 405 }
  )
}
