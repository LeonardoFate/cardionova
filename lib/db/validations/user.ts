// lib/validations/user.ts

import { z } from 'zod'
import { UserRole } from '@/types/user'

// Esquema base para usuario
export const userBaseSchema = z.object({
  email: z
    .string({
      required_error: 'El email es requerido'
    })
    .email('Formato de email inválido')
    .toLowerCase()
    .trim(),

  firstName: z
    .string({
      required_error: 'El nombre es requerido'
    })
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .trim(),

  lastName: z
    .string({
      required_error: 'El apellido es requerido'
    })
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder 50 caracteres')
    .trim(),

  role: z
    .nativeEnum(UserRole, {
      required_error: 'El rol es requerido',
      invalid_type_error: 'Rol inválido'
    }),

  isActive: z
    .boolean()
    .optional()
    .default(true)
})

// Esquema para el perfil de usuario
export const userProfileSchema = z.object({
  phone: z
    .string()
    .regex(/^[\+]?[0-9\s\-\(\)]+$/, 'Formato de teléfono inválido')
    .optional()
    .or(z.literal('')),

  speciality: z
    .string()
    .max(100, 'La especialidad no puede exceder 100 caracteres')
    .trim()
    .optional()
    .or(z.literal('')),

  licenseNumber: z
    .string()
    .trim()
    .optional()
    .or(z.literal('')),

  department: z
    .string()
    .max(100, 'El departamento no puede exceder 100 caracteres')
    .trim()
    .optional()
    .or(z.literal('')),

  avatar: z
    .string()
    .url('URL de avatar inválida')
    .optional()
    .or(z.literal(''))
})

// Esquema para crear usuario
export const createUserSchema = userBaseSchema.extend({
  password: z
    .string({
      required_error: 'La contraseña es requerida'
    })
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/,
      'La contraseña debe tener al menos: 1 minúscula, 1 mayúscula, 1 número y 1 caracter especial'),

  confirmPassword: z
    .string({
      required_error: 'La confirmación de contraseña es requerida'
    }),

  profile: userProfileSchema.optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword']
})

// Esquema para actualizar usuario (sin contraseña)
export const updateUserSchema = userBaseSchema.partial().extend({
  profile: userProfileSchema.optional()
})

// Esquema para actualizar perfil propio
export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .trim()
    .optional(),

  lastName: z
    .string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder 50 caracteres')
    .trim()
    .optional(),

  profile: userProfileSchema.optional()
})

// Validación condicional para campos de médico
export const validateMedicoProfile = (data: any) => {
  if (data.role === UserRole.MEDICO) {
    if (!data.profile?.speciality) {
      return {
        success: false,
        error: 'La especialidad es requerida para médicos'
      }
    }
    if (!data.profile?.licenseNumber) {
      return {
        success: false,
        error: 'El número de licencia es requerido para médicos'
      }
    }
  }
  return { success: true }
}

// Esquema para parámetros de consulta (lista de usuarios)
export const userQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => val ? parseInt(val, 10) : 1)
    .refine((val) => val > 0, 'La página debe ser mayor a 0'),

  limit: z
    .string()
    .optional()
    .transform((val) => val ? parseInt(val, 10) : 10)
    .refine((val) => val > 0 && val <= 100, 'El límite debe estar entre 1 y 100'),

  role: z
    .nativeEnum(UserRole)
    .optional(),

  search: z
    .string()
    .trim()
    .optional(),

  isActive: z
    .string()
    .optional()
    .transform((val) => val === 'true')
})

// Tipos TypeScript derivados de los esquemas
export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type UserQueryInput = z.infer<typeof userQuerySchema>
