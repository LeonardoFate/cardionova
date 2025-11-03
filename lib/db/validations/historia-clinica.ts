// lib/db/validations/historia-clinica.ts - VERSIÓN DEBUG SIMPLIFICADA

import { z } from 'zod'

// ✅ SCHEMAS BÁSICOS PARA DEBUG
const pacienteSchema = z.object({
  nombre: z.string().min(1, 'Nombre requerido'),
  cedula: z.string().min(1, 'Cédula requerida'),
  tipoSeguro: z.string().min(1, 'Tipo de seguro requerido')
})

const datosBiometricosSchema = z.object({
  edad: z.number().min(1, 'Edad requerida'),
  peso: z.number().min(1, 'Peso requerido'),
  estatura: z.number().min(1, 'Estatura requerida'),
  imc: z.number().optional()
})

const signosVitalesSchema = z.object({
  presionArterial: z.string().min(1, 'Presión arterial requerida'),
  frecuenciaCardiaca: z.number().min(30, 'Frecuencia cardíaca requerida'),
  satO2: z.number().min(50, 'Saturación requerida'),
  temperatura: z.number().min(0, 'La temperatura debe ser un número positivo')
})

// ✅ SCHEMAS OPCIONALES CON DEFAULTS SEGUROS
const antecedentesPersonalesSchema = z.object({
  factoresRiesgoCardiovascular: z.array(z.string()).default([]),
  antecedentesCardiovasculares: z.string().default(''),
  antecedentesPatologicosPersonales: z.string().default(''),
  antecedentesQuirurgicos: z.string().default(''),
  medicacion: z.array(z.string()).default([]),
  alergias: z.string().default(''),
  antecedentesPatologicosFamiliares: z.string().default('')
}).optional().default({})

const examenPorSistemasSchema = z.object({
  pielFaneras: z.string().default('NADA QUE LLAME LA ATENCIÓN'),
  sistemaRespiratorio: z.string().default('NADA QUE LLAME LA ATENCIÓN'),
  sistemaCardiovascular: z.string().default('NADA QUE LLAME LA ATENCIÓN'),
  sistemaGastrointestinal: z.string().default('NADA QUE LLAME LA ATENCIÓN'),
  sistemaGenitourinario: z.string().default('NADA QUE LLAME LA ATENCIÓN'),
  sistemaMusculoesqueletico: z.string().default('NADA QUE LLAME LA ATENCIÓN'),
  sistemaEndocrino: z.string().default('NADA QUE LLAME LA ATENCIÓN'),
  sistemaNeurologico: z.string().default('NADA QUE LLAME LA ATENCIÓN')
}).optional().default({})

const examenFisicoSchema = z.object({
  inspeccionGeneral: z.string().default('PACIENTE ORIENTADO EN TIEMPO Y ESPACIO'),
  escalaGlasgow: z.string().default('15/15'),
  cuello: z.string().default('MOVIL - NO ADENOPATIAS PALPABLES'),
  torax: z.string().default('SIMETRICO'),
  corazon: z.string().default('RUIDOS CARDIACOS RITMICOS'),
  pulmones: z.string().default('CLAROS Y VENTILADOS'),
  abdomen: z.string().default('BLANDO DEPRESIBLE NO DOLOROSO'),
  extremidadesSuperiores: z.string().default('SIMETRICAS - MOVILES'),
  extremidadesInferiores: z.string().default('SIMETRICAS - MOVILES')
}).optional().default({})

const estudiosRealizadosSchema = z.object({
  estudiosSeleccionados: z.array(z.string()).default([]),
  resultados: z.string().default('')
}).optional().default({})

const planSchema = z.object({
  tiempoControl: z.string().transform(val => val ? new Date(val) : undefined).optional(),
  dieta: z.string().min(1, 'Dieta requerida'),
  actividadFisica: z.string().min(1, 'Actividad física requerida'),
  pautasAlarma: z.string().min(1, 'Pautas de alarma requeridas'),
  reposo: z.string().optional(),
  estudiosAdicionales: z.array(z.string()).default([])
})

const tratamientoSchema = z.object({
  medicamentos: z.array(z.string()).default([]),
  observaciones: z.string().default('')
}).optional().default({})

// ✅ SCHEMA PRINCIPAL - MUY PERMISIVO PARA DEBUG
export const createHistoriaClinicaSchema = z.object({
  // Campos obligatorios básicos
  paciente: pacienteSchema,
  fecha: z.string().transform((val) => new Date(val)).or(z.date()),
  datosBiometricos: datosBiometricosSchema,
  signosVitales: signosVitalesSchema,
  motivoConsulta: z.string().min(1, 'Motivo de consulta requerido'),
  cie10: z.string().min(1, 'CIE-10 requerido'),
  enfermedadActual: z.string().min(1, 'Enfermedad actual requerida'),
  evolucionEnfermedad: z.string().min(1, 'Evolución de enfermedad requerida'),
  plan: planSchema,

  // Campos opcionales con defaults
  antecedentesPersonales: antecedentesPersonalesSchema,
  examenPorSistemas: examenPorSistemasSchema,
  examenFisico: examenFisicoSchema,
  estudiosRealizados: estudiosRealizadosSchema,
  tratamiento: tratamientoSchema
})

export const updateHistoriaClinicaSchema = createHistoriaClinicaSchema.partial()

export const historiaClinicaQuerySchema = z.object({
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('10'),
  search: z.string().optional(),
  cedula: z.string().optional(),
  medico: z.string().optional(),
  fechaDesde: z.string().transform(str => new Date(str)).optional(),
  fechaHasta: z.string().transform(str => new Date(str)).optional()
})

// Tipos TypeScript
export type CreateHistoriaClinicaInput = z.infer<typeof createHistoriaClinicaSchema>
export type UpdateHistoriaClinicaInput = z.infer<typeof updateHistoriaClinicaSchema>
export type HistoriaClinicaQueryInput = z.infer<typeof historiaClinicaQuerySchema>