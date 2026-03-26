// lib/db/validations/orden-medica.ts

import { z } from 'zod'
import {
  ViaAdministracion,
  TipoEstudioOrden,
  TipoReposo,
  EspecialidadInterconsulta
} from '@/types/orden-medica'

// ========================================
// SCHEMAS DE MEDICAMENTOS
// ========================================

export const medicamentoOrdenSchema = z.object({
  nombre: z.string().min(1, 'El nombre del medicamento es requerido'),
  concentracion: z.string().min(1, 'La concentración es requerida'),
  presentacion: z.string().min(1, 'La presentación es requerida'),
  cantidad: z.string().min(1, 'La cantidad es requerida'),
  dosificacion: z.string().min(1, 'La dosificación es requerida'),
  frecuencia: z.string().min(1, 'La frecuencia es requerida'),
  duracion: z.string().min(1, 'La duración es requerida'),
  viaAdministracion: z.nativeEnum(ViaAdministracion),
  indicaciones: z.string().optional()
})

export const recetaSchema = z.object({
  numero: z.string().optional(),
  medicamentos: z.array(medicamentoOrdenSchema).min(1, 'Debe agregar al menos un medicamento'),
  observaciones: z.string().optional(),
  fechaEmision: z.date().or(z.string().transform(val => new Date(val))).default(() => new Date()),
  vigencia: z.string().default('30 días')
})

// ========================================
// SCHEMAS DE ESTUDIOS
// ========================================

export const estudioOrdenSchema = z.object({
  numero: z.string().optional(),
  tipo: z.nativeEnum(TipoEstudioOrden),
  nombre: z.string().min(1, 'El nombre del estudio es requerido'),
  justificacion: z.string().min(10, 'La justificación debe tener al menos 10 caracteres'),
  urgente: z.boolean().default(false),
  ayunas: z.boolean().default(false),
  preparacion: z.string().optional(),
  indicaciones: z.string().optional(),
  fechaEmision: z.date().or(z.string().transform(val => new Date(val))).default(() => new Date())
})

// ========================================
// SCHEMAS DE REPOSO
// ========================================

export const reposoSchema = z.object({
  numero: z.string().optional(),
  tipo: z.nativeEnum(TipoReposo),
  dias: z.number().min(1, 'El reposo debe ser de al menos 1 día').max(365, 'El reposo no puede exceder 365 días'),
  desde: z.date().or(z.string().transform(val => new Date(val))),
  hasta: z.date().or(z.string().transform(val => new Date(val))),
  diagnostico: z.string().min(1, 'El diagnóstico es requerido'),
  recomendaciones: z.string().optional(),
  fechaEmision: z.date().or(z.string().transform(val => new Date(val))).default(() => new Date())
}).refine(data => data.hasta >= data.desde, {
  message: 'La fecha hasta debe ser posterior o igual a la fecha desde',
  path: ['hasta']
})

// ========================================
// SCHEMAS DE INTERCONSULTA
// ========================================

export const interconsultaSchema = z.object({
  numero: z.string().optional(),
  especialidad: z.string().min(1, 'La especialidad es requerida'),
  profesionalSolicitado: z.string().optional(),
  motivo: z.string().min(10, 'El motivo debe tener al menos 10 caracteres'),
  antecedentes: z.string().min(10, 'Los antecedentes deben tener al menos 10 caracteres'),
  examenesRealizados: z.string().optional(),
  diagnosticoPresuntivo: z.string().min(1, 'El diagnóstico presuntivo es requerido'),
  urgente: z.boolean().default(false),
  fechaEmision: z.date().or(z.string().transform(val => new Date(val))).default(() => new Date())
})

// ========================================
// SCHEMA PRINCIPAL
// ========================================

export const ordenesMedicasSchema = z.object({
  recetas: z.array(recetaSchema).default([]),
  estudios: z.array(estudioOrdenSchema).default([]),
  reposos: z.array(reposoSchema).default([]),
  interconsultas: z.array(interconsultaSchema).default([])
})

// ========================================
// SCHEMAS DE CREACIÓN INDIVIDUAL
// ========================================

export const createRecetaSchema = recetaSchema
export const createEstudioOrdenSchema = estudioOrdenSchema
export const createReposoSchema = reposoSchema
export const createInterconsultaSchema = interconsultaSchema

// ========================================
// TYPES
// ========================================

export type MedicamentoOrdenInput = z.infer<typeof medicamentoOrdenSchema>
export type RecetaInput = z.infer<typeof recetaSchema>
export type EstudioOrdenInput = z.infer<typeof estudioOrdenSchema>
export type ReposoInput = z.infer<typeof reposoSchema>
export type InterconsultaInput = z.infer<typeof interconsultaSchema>
export type OrdenesMedicasInput = z.infer<typeof ordenesMedicasSchema>
