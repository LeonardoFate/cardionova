// app/api/auth/profile/route.ts

import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/connection'
import User from '@/lib/models/User'
import { getCurrentUser } from '@/lib/db/auth/auth'
import { z } from 'zod'

const updateProfileSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  email: z.string().email().optional(),
  currentPassword: z.string().optional(),
  password: z.string().min(8).optional(),
  confirmPassword: z.string().optional(),
  profile: z.object({
    phone: z.string().optional(),
    department: z.string().optional(),
    speciality: z.string().optional(),
    licenseNumber: z.string().optional()
  }).optional()
}).refine((data) => {
  // Si se proporciona nueva contraseña, debe coincidir
  if (data.password || data.confirmPassword) {
    return data.password === data.confirmPassword
  }
  return true
}, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword']
}).refine((data) => {
  // Si se proporciona nueva contraseña, debe proporcionar la actual
  if (data.password && !data.currentPassword) {
    return false
  }
  return true
}, {
  message: 'Debe proporcionar su contraseña actual',
  path: ['currentPassword']
})

// PUT - Actualizar perfil del usuario autenticado
export async function PUT(request: NextRequest) {
  try {
    // 1. Verificar autenticación
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({
        success: false,
        message: 'No autorizado'
      }, { status: 401 })
    }

    // 2. Verificar que sea ADMIN
    if (currentUser.role !== 'ADMIN') {
      return NextResponse.json({
        success: false,
        message: 'Solo los administradores pueden editar perfiles'
      }, { status: 403 })
    }

    // 3. Conectar a la base de datos
    await dbConnect()

    // 4. Obtener y validar datos
    const body = await request.json()
    const validationResult = updateProfileSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        message: 'Datos inválidos',
        errors: validationResult.error.errors.map(e => e.message)
      }, { status: 400 })
    }

    const updateData = validationResult.data

    // 5. Buscar usuario
    const user = await User.findById(currentUser.userId)

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'Usuario no encontrado'
      }, { status: 404 })
    }

    // 6. Si se actualiza la contraseña, verificar la actual
    if (updateData.password && updateData.currentPassword) {
      const isPasswordValid = await user.comparePassword(updateData.currentPassword)

      if (!isPasswordValid) {
        return NextResponse.json({
          success: false,
          message: 'Contraseña actual incorrecta'
        }, { status: 401 })
      }

      // Actualizar contraseña
      user.password = updateData.password
    }

    // 7. Actualizar otros campos
    if (updateData.firstName) user.firstName = updateData.firstName
    if (updateData.lastName) user.lastName = updateData.lastName
    if (updateData.email) user.email = updateData.email

    // 8. Actualizar profile
    if (updateData.profile) {
      user.profile = {
        ...user.profile,
        ...updateData.profile
      }
    }

    // 9. Guardar cambios
    await user.save()

    // 10. Retornar usuario actualizado (sin contraseña)
    const userResponse = {
      _id: String(user._id),
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

    return NextResponse.json({
      success: true,
      message: 'Perfil actualizado correctamente',
      user: userResponse
    }, { status: 200 })

  } catch (error) {
    console.error('Error actualizando perfil:', error)

    return NextResponse.json({
      success: false,
      message: 'Error interno del servidor'
    }, { status: 500 })
  }
}
