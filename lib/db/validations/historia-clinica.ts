// lib/db/validations/historia-clinica.ts

import { z } from 'zod'

// Esquema para datos del paciente
export const pacienteSchema = z.object({
  nombre: z
    .string({
      required_error: 'El nombre del paciente es requerido'
    })
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .trim(),

  cedula: z
    .string({
      required_error: 'La cédula es requerida'
    })
    .min(5, 'La cédula debe tener al menos 5 caracteres')
    .max(20, 'La cédula no puede exceder 20 caracteres')
    .trim(),

  tipoSeguro: z
    .string({
      required_error: 'El tipo de seguro es requerido'
    })
    .min(2, 'El tipo de seguro debe tener al menos 2 caracteres')
    .max(50, 'El tipo de seguro no puede exceder 50 caracteres')
    .trim()
})

// Esquema para datos biométricos
export const datosBiometricosSchema = z.object({
  edad: z
    .number({
      required_error: 'La edad es requerida'
    })
    .int('La edad debe ser un número entero')
    .min(0, 'La edad no puede ser negativa')
    .max(150, 'La edad no puede ser mayor a 150'),

  peso: z
    .number({
      required_error: 'El peso es requerido'
    })
    .min(1, 'El peso debe ser mayor a 1 kg')
    .max(500, 'El peso no puede ser mayor a 500 kg'),

  estatura: z
    .number({
      required_error: 'La estatura es requerida'
    })
    .min(30, 'La estatura debe ser mayor a 30 cm')
    .max(250, 'La estatura no puede ser mayor a 250 cm')
})

// Esquema para signos vitales
export const signosVitalesSchema = z.object({
  presionArterial: z
    .string({
      required_error: 'La presión arterial es requerida'
    })
    .regex(/^\d{2,3}\/\d{2,3}$/, 'Formato de presión arterial inválido (ej: 120/80)')
    .trim(),

  frecuenciaCardiaca: z
    .number({
      required_error: 'La frecuencia cardíaca es requerida'
    })
    .int('La frecuencia cardíaca debe ser un número entero')
    .min(30, 'Frecuencia cardíaca muy baja')
    .max(220, 'Frecuencia cardíaca muy alta'),

  satO2: z
    .number({
      required_error: 'La saturación de oxígeno es requerida'
    })
    .min(50, 'Saturación muy baja')
    .max(100, 'Saturación no puede ser mayor a 100'),

  temperatura: z
    .number({
      required_error: 'La temperatura es requerida'
    })
    .min(30, 'Temperatura muy baja')
    .max(45, 'Temperatura muy alta')
})

// Esquema para antecedentes personales
export const antecedentesPersonalesSchema = z.object({
  factoresRiesgoCardiovascular: z
    .array(z.string().trim())
    .default([]),

  antecedentesCardiovasculares: z
    .string()
    .trim()
    .default(''),

  antecedentesPatologicosPersonales: z
    .string()
    .trim()
    .default(''),

  antecedentesQuirurgicos: z
    .string()
    .trim()
    .default(''),

  medicacion: z
    .array(z.string().trim())
    .default([]),

  alergias: z
    .string()
    .trim()
    .default(''),

  antecedentesPatologicosFamiliares: z
    .string()
    .trim()
    .default('')
})

// Esquema para examen por sistemas
export const examenSistemasSchema = z.object({
  pielFaneras: z
    .string()
    .trim()
    .default('NADA QUE LLAME LA ATENCIÓN'),

  sistemaRespiratorio: z
    .string()
    .trim()
    .default('NADA QUE LLAME LA ATENCIÓN'),

  sistemaCardiovascular: z
    .string()
    .trim()
    .default('NADA QUE LLAME LA ATENCIÓN'),

  sistemaGastrointestinal: z
    .string()
    .trim()
    .default('NADA QUE LLAME LA ATENCIÓN'),

  sistemaGenitourinario: z
    .string()
    .trim()
    .default('NADA QUE LLAME LA ATENCIÓN'),

  sistemaMusculoesqueletico: z
    .string()
    .trim()
    .default('NADA QUE LLAME LA ATENCIÓN'),

  sistemaEndocrino: z
    .string()
    .trim()
    .default('NADA QUE LLAME LA ATENCIÓN'),

  sistemaNeurologico: z
    .string()
    .trim()
    .default('NADA QUE LLAME LA ATENCIÓN')
})

// Esquema para examen físico
export const examenFisicoSchema = z.object({
  inspeccionGeneral: z
    .string()
    .trim()
    .default('PACIENTE ORIENTADO EN TIEMPO Y ESPACIO, COLABORA CON EL INTERROGATORIO'),

  escalaGlasgow: z
    .string()
    .trim()
    .default('15/15'),

  cuello: z
    .string()
    .trim()
    .default('MOVIL - NO ADENOPATIAS PALPABLES - YUGULAR 0/3'),

  torax: z
    .string()
    .trim()
    .default('SIMETRICO'),

  corazon: z
    .string()
    .trim()
    .default('RUIDOS CARDIACOS RITMICOS, NO SOPLOS, NO RUIDOS AGREGADOS'),

  pulmones: z
    .string()
    .trim()
    .default('CLAROS Y VENTILADOS'),

  abdomen: z
    .string()
    .trim()
    .default('BLANDO DEPRESIBLE NO DOLOROSO, NO MASAS RUIDOS HIDROAEREOS PRESENTES'),

  extremidadesSuperiores: z
    .string()
    .trim()
    .default('SIMETRICAS - MOVILES - NO DOLOROSOS - PULSOS PRESENTES'),

  extremidadesInferiores: z
    .string()
    .trim()
    .default('SIMETRICAS - MOVILES - NO DOLOROSOS - PULSOS PRESENTES - NO EDEMA')
})

// Esquema para estudios realizados
export const estudiosRealizadosSchema = z.object({
  estudios: z
    .array(z.string().trim())
    .default([]),

  conclusiones: z
    .string()
    .trim()
    .default('')
})

// Esquema para plan de tratamiento
export const planSchema = z.object({
  tiempoControl: z
    .string()
    .transform((val) => val ? new Date(val) : undefined)
    .optional(),

  dieta: z
    .string({
      required_error: 'La dieta es requerida'
    })
    .trim()
    .min(1, 'La dieta no puede estar vacía'),

  actividadFisica: z
    .string({
      required_error: 'La actividad física es requerida'
    })
    .trim()
    .min(1, 'La actividad física no puede estar vacía'),

  pautasAlarma: z
    .string({
      required_error: 'Las pautas de alarma son requeridas'
    })
    .trim()
    .min(1, 'Las pautas de alarma no pueden estar vacías'),

  reposo: z
    .string()
    .trim()
    .optional(),

  estudiosAdicionales: z
    .array(z.string().trim())
    .default([])
})

// Esquema para tratamiento
export const tratamientoSchema = z.object({
  medicamentos: z
    .array(z.string().trim())
    .default([]),

  observaciones: z
    .string()
    .trim()
    .default('')
})

// Esquema principal para crear historia clínica
export const createHistoriaClinicaSchema = z.object({
  paciente: pacienteSchema,
  fecha: z
    .string()
    .transform((val) => new Date(val))
    .optional()
    .default(() => new Date()),

  datosBiometricos: datosBiometricosSchema,
  signosVitales: signosVitalesSchema,

  motivoConsulta: z
    .string({
      required_error: 'El motivo de consulta es requerido'
    })
    .trim()
    .min(1, 'El motivo de consulta no puede estar vacío'),

  cie10: z
    .string({
      required_error: 'El código CIE-10 es requerido'
    })
    .trim()
    .min(1, 'El código CIE-10 no puede estar vacío'),

  enfermedadActual: z
    .string({
      required_error: 'La enfermedad actual es requerida'
    })
    .trim()
    .min(1, 'La enfermedad actual no puede estar vacía'),

  evolucionEnfermedad: z
    .string({
      required_error: 'La evolución de la enfermedad es requerida'
    })
    .trim()
    .min(1, 'La evolución de la enfermedad no puede estar vacía'),

  antecedentesPersonales: antecedentesPersonalesSchema,
  examenSistemas: examenSistemasSchema.optional(),
  examenFisico: examenFisicoSchema.optional(),
  estudiosRealizados: estudiosRealizadosSchema.optional(),
  plan: planSchema,
  tratamiento: tratamientoSchema
})

// Esquema para actualizar historia clínica
export const updateHistoriaClinicaSchema = createHistoriaClinicaSchema.partial()

// Esquema para consultas de historia clínica
export const historiaClinicaQuerySchema = z.object({
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

  cedula: z
    .string()
    .trim()
    .optional(),

  medico: z
    .string()
    .trim()
    .optional(),

  fechaDesde: z
    .string()
    .optional()
    .transform((val) => val ? new Date(val) : undefined),

  fechaHasta: z
    .string()
    .optional()
    .transform((val) => val ? new Date(val) : undefined),

  search: z
    .string()
    .trim()
    .optional()
})

// Tipos TypeScript derivados de los esquemas
export type CreateHistoriaClinicaInput = z.infer<typeof createHistoriaClinicaSchema>
export type UpdateHistoriaClinicaInput = z.infer<typeof updateHistoriaClinicaSchema>
export type HistoriaClinicaQueryInput = z.infer<typeof historiaClinicaQuerySchema>
