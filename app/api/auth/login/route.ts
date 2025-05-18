// app/api/auth/login/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import dbConnect from '@/lib/db/connection'
import User from '@/lib/models/User'
import { loginSchema } from '@/lib/db/validations/auth'
import { generateTokenPair } from '@/lib/db/auth/jwt'
import { AUTH_COOKIE_NAME, REFRESH_COOKIE_NAME, COOKIE_OPTIONS, REFRESH_COOKIE_OPTIONS } from '@/lib/db/auth/auth'
import { handleValidationError } from '@/lib/db/validations'
import type { IUserResponse } from '@/types/user'

// Tipado para la respuesta de login exitoso
interface LoginSuccessResponse {
  success: true
  message: string
  user: IUserResponse
  accessToken: string
}

// Tipado para la respuesta de login fallido
interface LoginErrorResponse {
  success: false
  message: string
  errors?: string[]
}

export async function POST(request: NextRequest) {
  try {
    // 1. Conectar a la base de datos
    await dbConnect()

    // 2. Obtener y validar datos del request
    const body = await request.json()
    const validationResult = loginSchema.safeParse(body)

    if (!validationResult.success) {
      const errorResponse: LoginErrorResponse = handleValidationError(validationResult.error)
      return NextResponse.json(errorResponse, { status: 400 })
    }

    const { email, password } = validationResult.data

    // 3. Buscar usuario por email
    const user = await User.findByEmail(email)

    if (!user) {
      const errorResponse: LoginErrorResponse = {
        success: false,
        message: 'Credenciales inválidas'
      }
      return NextResponse.json(errorResponse, { status: 401 })
    }

    // 4. Verificar que el usuario esté activo
    if (!user.isActive) {
      const errorResponse: LoginErrorResponse = {
        success: false,
        message: 'Su cuenta ha sido desactivada. Contacte al administrador.'
      }
      return NextResponse.json(errorResponse, { status: 403 })
    }

    // 5. Comparar contraseña
    const isPasswordValid = await user.comparePassword(password)

    if (!isPasswordValid) {
      const errorResponse: LoginErrorResponse = {
        success: false,
        message: 'Credenciales inválidas'
      }
      return NextResponse.json(errorResponse, { status: 401 })
    }

    // 6. Actualizar fecha de último login
    user.lastLogin = new Date()
    await user.save()

    // 7. Generar tokens JWT
    const { accessToken, refreshToken } = generateTokenPair(
      user._id.toString(),
      user.email,
      user.role
    )

    // 8. Configurar cookies seguras
    const cookieStore = cookies()

    cookieStore.set(AUTH_COOKIE_NAME, accessToken, COOKIE_OPTIONS)
    cookieStore.set(REFRESH_COOKIE_NAME, refreshToken, REFRESH_COOKIE_OPTIONS)

    // 9. Preparar respuesta del usuario (sin contraseña)
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

    // 10. Respuesta exitosa
    const successResponse: LoginSuccessResponse = {
      success: true,
      message: `Bienvenido/a, ${user.firstName}. Se ha iniciado sesión como ${getRoleDisplayName(user.role)}.`,
      user: userResponse,
      accessToken
    }

    return NextResponse.json(successResponse, { status: 200 })

  } catch (error) {
    console.error('Error en login:', error)

    const errorResponse: LoginErrorResponse = {
      success: false,
      message: 'Error interno del servidor'
    }

    return NextResponse.json(errorResponse, { status: 500 })
  }
}

// Función auxiliar para obtener el nombre amigable del rol
function getRoleDisplayName(role: string): string {
  const roleNames = {
    'ADMIN': 'Administrador',
    'SECRETARIA': 'Secretaria',
    'MEDICO': 'Médico'
  }

  return roleNames[role as keyof typeof roleNames] || role
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

export async function PUT() {
  return NextResponse.json(
    {
      success: false,
      message: 'Método no permitido'
    },
    { status: 405 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    {
      success: false,
      message: 'Método no permitido'
    },
    { status: 405 }
  )
}
