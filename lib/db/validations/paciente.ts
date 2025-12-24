// lib/db/validations/paciente.ts

import { z } from 'zod'
import { TipoSeguro, EstadoPaciente } from '@/types/paciente'

// Esquema para contacto de emergencia
export const contactoEmergenciaSchema = z.object({
  nombre: z
    .string()
    .min(2, 'El nombre del contacto debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .trim(),
  telefono: z
    .string()
    .regex(/^[\+]?[0-9\s\-\(\)]+$/, 'Formato de teléfono inválido'),
  relacion: z
    .string()
    .min(2, 'La relación debe tener al menos 2 caracteres')
    .trim()
})

// Esquema para crear paciente
export const createPacienteSchema = z.object({
  nombre: z
    .string({
      required_error: 'El nombre es requerido'
    })
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .trim(),

  apellido: z
    .string({
      required_error: 'El apellido es requerido'
    })
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(100, 'El apellido no puede exceder 100 caracteres')
    .trim(),

  cedula: z
    .string({
      required_error: 'La cédula es requerida'
    })
    .min(10, 'La cédula debe tener al menos 10 caracteres')
    .max(13, 'La cédula no puede exceder 13 caracteres')
    .trim(),

  fechaNacimiento: z
    .string({
      required_error: 'La fecha de nacimiento es requerida'
    })
    .or(z.date()),

  telefono: z
    .string({
      required_error: 'El teléfono es requerido'
    })
    .regex(/^[\+]?[0-9\s\-\(\)]+$/, 'Formato de teléfono inválido'),

  email: z
    .string()
    .email('Email inválido')
    .toLowerCase()
    .optional()
    .or(z.literal('')),

  direccion: z
    .string()
    .trim()
    .optional()
    .or(z.literal('')),

  tipoSeguro: z
    .nativeEnum(TipoSeguro, {
      required_error: 'El tipo de seguro es requerido',
      invalid_type_error: 'Tipo de seguro inválido'
    }),

  numeroSeguro: z
    .string()
    .trim()
    .optional()
    .or(z.literal('')),

  contactoEmergencia: contactoEmergenciaSchema.optional(),

  observaciones: z
    .string()
    .trim()
    .optional()
    .or(z.literal('')),

  medicoAsignado: z
    .string({
      required_error: 'El médico asignado es requerido'
    })
    .min(1, 'Debe seleccionar un médico')
})

// Esquema para actualizar paciente
export const updatePacienteSchema = createPacienteSchema.partial().extend({
  estado: z
    .nativeEnum(EstadoPaciente)
    .optional(),

  historiaClinicaId: z
    .string()
    .optional()
})

// Esquema para query de pacientes
export const pacienteQuerySchema = z.object({
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

  medicoId: z
    .string()
    .optional(),

  estado: z
    .nativeEnum(EstadoPaciente)
    .optional(),

  search: z
    .string()
    .trim()
    .optional(),

  fecha: z
    .string()
    .optional()
})

// Tipos TypeScript derivados
export type CreatePacienteInput = z.infer<typeof createPacienteSchema>
export type UpdatePacienteInput = z.infer<typeof updatePacienteSchema>
export type PacienteQueryInput = z.infer<typeof pacienteQuerySchema>
