// app/api/auth/me/route.ts

import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/connection'
import User from '@/lib/models/User'
import { getCurrentUser } from '@/lib/db/auth/auth'
import type { IUserResponse } from '@/types/user'

// Tipado para la respuesta exitosa
interface MeSuccessResponse {
  success: true
  message: string
  user: IUserResponse
}

// Tipado para la respuesta de error
interface MeErrorResponse {
  success: false
  message: string
}

export async function GET(request: NextRequest) {
  try {
    // 1. Obtener usuario actual desde el token
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      const errorResponse: MeErrorResponse = {
        success: false,
        message: 'No autorizado'
      }
      return NextResponse.json(errorResponse, { status: 401 })
    }

    // 2. Conectar a la base de datos
    await dbConnect()

    // 3. Buscar usuario completo en la base de datos
    const user = await User.findById(currentUser.userId)

    if (!user) {
      const errorResponse: MeErrorResponse = {
        success: false,
        message: 'Usuario no encontrado'
      }
      return NextResponse.json(errorResponse, { status: 404 })
    }

    // 4. Verificar que el usuario esté activo
    if (!user.isActive) {
      const errorResponse: MeErrorResponse = {
        success: false,
        message: 'Su cuenta ha sido desactivada'
      }
      return NextResponse.json(errorResponse, { status: 403 })
    }

    // 5. Preparar respuesta del usuario (sin contraseña)
    const userResponse: IUserResponse = {
      _id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      profile: user.profile,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLogin: user.lastLogin
    }

    // 6. Respuesta exitosa
    const successResponse: MeSuccessResponse = {
      success: true,
      message: 'Usuario obtenido correctamente',
      user: userResponse
    }

    return NextResponse.json(successResponse, { status: 200 })

  } catch (error) {
    console.error('Error obteniendo usuario actual:', error)

    const errorResponse: MeErrorResponse = {
      success: false,
      message: 'Error interno del servidor'
    }

    return NextResponse.json(errorResponse, { status: 500 })
  }
}

// Manejar otros métodos HTTP
export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message: 'Método no permitido'
    },
    { status: 405 }
  )
}
