// app/api/users/route.ts

import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/connection'
import User from '@/lib/models/User'
import { getCurrentUser } from '@/lib/db/auth/auth'
import { createUserSchema, userQuerySchema } from '@/lib/db/validations/user'
import { handleValidationError } from '@/lib/db/validations'
import type { IUserResponse } from '@/types/user'

// Tipado para respuestas
interface CreateUserSuccessResponse {
  success: true
  message: string
  user: IUserResponse
}

interface GetUsersSuccessResponse {
  success: true
  message: string
  users: IUserResponse[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

interface ErrorResponse {
  success: false
  message: string
  errors?: string[]
}

// Función auxiliar para convertir documento de Mongoose a IUserResponse
function convertUserToResponse(user: any): IUserResponse {
  return {
    _id: String(user._id), // Conversión segura a string
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    isActive: user.isActive,
    profile: user.profile || {},
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    lastLogin: user.lastLogin
  }
}

// GET - Obtener lista de usuarios (solo admin)
export async function GET(request: NextRequest) {
  try {
    // 1. Verificar autenticación y permisos
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({
        success: false,
        message: 'No autorizado'
      }, { status: 401 })
    }

    if (currentUser.role !== 'ADMIN') {
      return NextResponse.json({
        success: false,
        message: 'Acceso denegado. Solo administradores pueden ver usuarios.'
      }, { status: 403 })
    }

    // 2. Conectar a la base de datos
    await dbConnect()
    console.log('✅ Conectado a MongoDB')

    // Debug: Verificar conexión y colección
    try {
      const userCount = await User.countDocuments({})
      console.log('🔢 Total de usuarios en la base de datos (sin filtros):', userCount)

      // Obtener algunos usuarios para verificar
      const allUsers = await User.find({}, 'firstName lastName email role').limit(5)
      console.log('👥 Primeros 5 usuarios encontrados:', allUsers)
    } catch (debugError) {
      console.error('❌ Error en debug de base de datos:', debugError)
    }

    // 3. Obtener y validar parámetros de consulta
    const { searchParams } = new URL(request.url)
    const queryParams = Object.fromEntries(searchParams.entries())

    const validationResult = userQuerySchema.safeParse(queryParams)

    if (!validationResult.success) {
      // ✅ Corregido: No especificar tipo, dejar que TypeScript lo infiera
      const errorResponse = handleValidationError(validationResult.error)
      return NextResponse.json(errorResponse, { status: 400 })
    }

    const { page, limit, role, search, isActive } = validationResult.data

    // 4. Construir filtros de búsqueda
    const filters: any = {}

    if (role) {
      filters.role = role
    }

    if (typeof isActive === 'boolean') {
      filters.isActive = isActive
    }

    if (search) {
      filters.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }

    // 5. Ejecutar consulta con paginación
    const skip = (page - 1) * limit

    console.log('🔍 Ejecutando consulta MongoDB...')
    console.log('📋 Filtros aplicados:', filters)
    console.log('📄 Paginación:', { page, limit, skip })

    const [users, total] = await Promise.all([
      User.find(filters, '-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filters)
    ])

    console.log('📊 Resultado de la consulta:')
    console.log('👥 Usuarios encontrados:', users.length)
    console.log('🔢 Total en base de datos:', total)
    console.log('📋 Usuarios completos:', users)

    // 6. Formatear respuesta usando la función auxiliar
    const formattedUsers: IUserResponse[] = users.map(user => convertUserToResponse(user))

    const totalPages = Math.ceil(total / limit)

    const successResponse: GetUsersSuccessResponse = {
      success: true,
      message: 'Usuarios obtenidos correctamente',
      users: formattedUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    }

    return NextResponse.json(successResponse, { status: 200 })

  } catch (error) {
    console.error('Error obteniendo usuarios:', error)

    return NextResponse.json({
      success: false,
      message: 'Error interno del servidor'
    }, { status: 500 })
  }
}

// POST - Crear nuevo usuario (solo admin)
export async function POST(request: NextRequest) {
  try {
    // 1. Verificar autenticación y permisos
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({
        success: false,
        message: 'No autorizado'
      }, { status: 401 })
    }

    if (currentUser.role !== 'ADMIN') {
      return NextResponse.json({
        success: false,
        message: 'Acceso denegado. Solo administradores pueden crear usuarios.'
      }, { status: 403 })
    }

    // 2. Conectar a la base de datos
    await dbConnect()

    // 3. Obtener y validar datos del request
    const body = await request.json()
    const validationResult = createUserSchema.safeParse(body)

    if (!validationResult.success) {
      // ✅ Corregido: No especificar tipo, dejar que TypeScript lo infiera
      const errorResponse = handleValidationError(validationResult.error)
      return NextResponse.json(errorResponse, { status: 400 })
    }

    const userData = validationResult.data

    // 4. Verificar que el email no exista
    const existingUser = await User.findOne({ email: userData.email })

    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: 'Ya existe un usuario con este email'
      }, { status: 409 })
    }

    // 5. Validaciones específicas por rol
    if (userData.role === 'MEDICO') {
      if (!userData.profile?.speciality) {
        return NextResponse.json({
          success: false,
          message: 'La especialidad es requerida para médicos'
        }, { status: 400 })
      }

      if (!userData.profile?.licenseNumber) {
        return NextResponse.json({
          success: false,
          message: 'El número de licencia es requerido para médicos'
        }, { status: 400 })
      }
    }

    // 6. Crear usuario
    const newUser = new User({
      email: userData.email,
      password: userData.password, // Se hasheará automáticamente
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role,
      isActive: userData.isActive ?? true,
      profile: userData.profile || {}
    })

    await newUser.save()

    // 7. Preparar respuesta usando la función auxiliar
    const userResponse = convertUserToResponse(newUser)

    const successResponse: CreateUserSuccessResponse = {
      success: true,
      message: `Usuario ${userData.role.toLowerCase()} creado exitosamente`,
      user: userResponse
    }

    return NextResponse.json(successResponse, { status: 201 })

  } catch (error) {
    console.error('Error creando usuario:', error)

    return NextResponse.json({
      success: false,
      message: 'Error interno del servidor'
    }, { status: 500 })
  }
}

// Manejar otros métodos HTTP
export async function PUT() {
  return NextResponse.json(
    { success: false, message: 'Método no permitido' },
    { status: 405 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { success: false, message: 'Método no permitido' },
    { status: 405 }
  )
}
