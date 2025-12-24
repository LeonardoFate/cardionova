// app/api/users/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db/connection'
import User from '@/lib/models/User'
import { getCurrentUser } from '@/lib/db/auth/auth'
import { updateUserSchema } from '@/lib/db/validations/user'
import { handleValidationError } from '@/lib/db/validations'
import type { IUserResponse } from '@/types/user'
import mongoose from 'mongoose'

interface SuccessResponse {
  success: true
  message: string
  user?: IUserResponse
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

// GET - Obtener usuario específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 0. Await params
    const { id } = await params

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
        message: 'Acceso denegado'
      }, { status: 403 })
    }

    // 2. Validar ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({
        success: false,
        message: 'ID de usuario inválido'
      }, { status: 400 })
    }

    // 3. Conectar a la base de datos
    await dbConnect()

    // 4. Buscar usuario
    const user = await User.findById(id, '-password')

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'Usuario no encontrado'
      }, { status: 404 })
    }

    // 5. Formatear respuesta usando la función auxiliar
    const userResponse = convertUserToResponse(user)

    const successResponse: SuccessResponse = {
      success: true,
      message: 'Usuario obtenido correctamente',
      user: userResponse
    }

    return NextResponse.json(successResponse, { status: 200 })

  } catch (error) {
    console.error('Error obteniendo usuario:', error)

    return NextResponse.json({
      success: false,
      message: 'Error interno del servidor'
    }, { status: 500 })
  }
}

// PUT - Actualizar usuario
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 0. Await params
    const { id } = await params

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
        message: 'Acceso denegado'
      }, { status: 403 })
    }

    // 2. Validar ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({
        success: false,
        message: 'ID de usuario inválido'
      }, { status: 400 })
    }

    // 3. Conectar a la base de datos
    await dbConnect()

    // 4. Verificar que el usuario existe
    const existingUser = await User.findById(id)

    if (!existingUser) {
      return NextResponse.json({
        success: false,
        message: 'Usuario no encontrado'
      }, { status: 404 })
    }

    // 5. Obtener y validar datos del request
    const body = await request.json()
    const validationResult = updateUserSchema.safeParse(body)

    if (!validationResult.success) {
      // ✅ Corregido: No especificar tipo, dejar que TypeScript lo infiera
      const errorResponse = handleValidationError(validationResult.error)
      return NextResponse.json(errorResponse, { status: 400 })
    }

    const updateData = validationResult.data

    // 6. Verificar email único si se está cambiando
    if (updateData.email && updateData.email !== existingUser.email) {
      const emailExists = await User.findOne({
        email: updateData.email,
        _id: { $ne: id }
      })

      if (emailExists) {
        return NextResponse.json({
          success: false,
          message: 'Ya existe un usuario con este email'
        }, { status: 409 })
      }
    }

    // 7. Validaciones específicas por rol
    if (updateData.role === 'MEDICO' || existingUser.role === 'MEDICO') {
      const profile = { ...existingUser.profile, ...updateData.profile }

      if (!profile.speciality) {
        return NextResponse.json({
          success: false,
          message: 'La especialidad es requerida para médicos'
        }, { status: 400 })
      }

      if (!profile.licenseNumber) {
        return NextResponse.json({
          success: false,
          message: 'El número de licencia es requerido para médicos'
        }, { status: 400 })
      }
    }

    // 8. Si se proporciona una nueva contraseña, actualizarla
    if (updateData.password) {
      existingUser.password = updateData.password
      await existingUser.save() // Esto activará el pre-save hook para hashear la contraseña
    }

    // 9. Actualizar otros campos del usuario
    const fieldsToUpdate: any = {
      ...updateData,
      profile: { ...existingUser.profile, ...updateData.profile }
    }

    // Eliminar password y confirmPassword del objeto de actualización ya que se maneja por separado
    delete fieldsToUpdate.password
    delete fieldsToUpdate.confirmPassword

    const updatedUser = await User.findByIdAndUpdate(
      id,
      fieldsToUpdate,
      { new: true, runValidators: true }
    ).select('-password')

    // 10. Verificar que la actualización fue exitosa
    if (!updatedUser) {
      return NextResponse.json({
        success: false,
        message: 'Error actualizando usuario'
      }, { status: 500 })
    }

    // 11. Formatear respuesta usando la función auxiliar
    const userResponse = convertUserToResponse(updatedUser)

    const successResponse: SuccessResponse = {
      success: true,
      message: 'Usuario actualizado correctamente',
      user: userResponse
    }

    return NextResponse.json(successResponse, { status: 200 })

  } catch (error) {
    console.error('Error actualizando usuario:', error)

    return NextResponse.json({
      success: false,
      message: 'Error interno del servidor'
    }, { status: 500 })
  }
}

// DELETE - Desactivar usuario (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 0. Await params
    const { id } = await params

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
        message: 'Acceso denegado'
      }, { status: 403 })
    }

    // 2. Validar ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({
        success: false,
        message: 'ID de usuario inválido'
      }, { status: 400 })
    }

    // 3. Evitar que el admin se desactive a sí mismo
    if (id === currentUser.userId) {
      return NextResponse.json({
        success: false,
        message: 'No puedes desactivar tu propia cuenta'
      }, { status: 400 })
    }

    // 4. Conectar a la base de datos
    await dbConnect()

    // 5. Desactivar usuario (soft delete)
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    ).select('-password')

    if (!updatedUser) {
      return NextResponse.json({
        success: false,
        message: 'Usuario no encontrado'
      }, { status: 404 })
    }

    const successResponse: SuccessResponse = {
      success: true,
      message: 'Usuario desactivado correctamente'
    }

    return NextResponse.json(successResponse, { status: 200 })

  } catch (error) {
    console.error('Error desactivando usuario:', error)

    return NextResponse.json({
      success: false,
      message: 'Error interno del servidor'
    }, { status: 500 })
  }
}
