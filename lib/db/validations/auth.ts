// lib/validations/auth.ts

import { z } from 'zod'
import { UserRole } from '@/types/user'

// Esquema para login
export const loginSchema = z.object({
  email: z
    .string({
      required_error: 'El email es requerido'
    })
    .email('Formato de email inválido')
    .toLowerCase()
    .trim(),

  password: z
    .string({
      required_error: 'La contraseña es requerida'
    })
    .min(1, 'La contraseña no puede estar vacía')
})

// Esquema para cambio de contraseña
export const changePasswordSchema = z.object({
  currentPassword: z
    .string({
      required_error: 'La contraseña actual es requerida'
    })
    .min(1, 'La contraseña actual no puede estar vacía'),

  newPassword: z
    .string({
      required_error: 'La nueva contraseña es requerida'
    })
    .min(8, 'La nueva contraseña debe tener al menos 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/,
      'La contraseña debe tener al menos: 1 minúscula, 1 mayúscula, 1 número y 1 caracter especial'),

  confirmPassword: z
    .string({
      required_error: 'La confirmación de contraseña es requerida'
    })
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword']
})

// Esquema para reset de contraseña (solicitud)
export const requestResetPasswordSchema = z.object({
  email: z
    .string({
      required_error: 'El email es requerido'
    })
    .email('Formato de email inválido')
    .toLowerCase()
    .trim()
})

// Esquema para reset de contraseña (confirmación)
export const resetPasswordSchema = z.object({
  token: z
    .string({
      required_error: 'El token es requerido'
    }),

  newPassword: z
    .string({
      required_error: 'La nueva contraseña es requerida'
    })
    .min(8, 'La nueva contraseña debe tener al menos 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/,
      'La contraseña debe tener al menos: 1 minúscula, 1 mayúscula, 1 número y 1 caracter especial'),

  confirmPassword: z
    .string({
      required_error: 'La confirmación de contraseña es requerida'
    })
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword']
})

// Tipos TypeScript derivados de los esquemas
export type LoginInput = z.infer<typeof loginSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
export type RequestResetPasswordInput = z.infer<typeof requestResetPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
