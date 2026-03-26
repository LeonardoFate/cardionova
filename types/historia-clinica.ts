// types/historia-clinica.ts - VERSIÓN ACTUALIZADA

import { IOrdenesMedicas } from './orden-medica'

export interface IPaciente {
  nombre: string
  cedula: string
  tipoSeguro: string
}

export interface IDatosBiometricos {
  edad: number
  peso: number
  estatura: number
  imc: number
}

export interface ISignosVitales {
  presionArterial: string
  frecuenciaCardiaca: number
  satO2: number
  temperatura: number
}

// ✅ NUEVO: Antecedentes Personales Completos
export interface IAntecedentesPersonales {
  factoresRiesgoCardiovascular: string[]
  antecedentesCardiovasculares: string
  antecedentesPatologicosPersonales: string
  antecedentesQuirurgicos: string
  medicacion: string[]
  alergias: string
  antecedentesPatologicosFamiliares: string
}

// ✅ NUEVO: Examen por Sistemas
export interface IExamenPorSistemas {
  pielFaneras: string
  sistemaRespiratorio: string
  sistemaCardiovascular: string
  sistemaGastrointestinal: string
  sistemaGenitourinario: string
  sistemaMusculoesqueletico: string
  sistemaEndocrino: string
  sistemaNeurologico: string
}

// ✅ NUEVO: Examen Físico Detallado
export interface IExamenFisico {
  inspeccionGeneral: string
  escalaGlasgow: string
  cuello: string
  torax: string
  corazon: string
  pulmones: string
  abdomen: string
  extremidadesSuperiores: string
  extremidadesInferiores: string
}

// ✅ NUEVO: Estudios Realizados
export interface IEstudiosRealizados {
  estudiosSeleccionados: string[]
  resultados: string
}

// ✅ ACTUALIZADO: Plan Completo
export interface IPlan {
  tiempoControl?: Date
  dieta: string
  actividadFisica: string
  pautasAlarma: string
  reposo?: string
  estudiosAdicionales: string[]
}

export interface ITratamiento {
  medicamentos: string[]
  observaciones: string
}

// ✅ INTERFAZ PRINCIPAL ACTUALIZADA
export interface IHistoriaClinica {
  paciente: IPaciente
  fecha: Date
  datosBiometricos: IDatosBiometricos
  signosVitales: ISignosVitales
  motivoConsulta: string
  cie10: string
  enfermedadActual: string
  evolucionEnfermedad: string

  // ✅ NUEVOS CAMPOS
  antecedentesPersonales: IAntecedentesPersonales
  examenPorSistemas: IExamenPorSistemas
  examenFisico: IExamenFisico
  estudiosRealizados: IEstudiosRealizados

  plan: IPlan
  tratamiento: ITratamiento
  medico: string

  // Órdenes médicas (opcional, se agrega después de la consulta)
  ordenesMedicas?: IOrdenesMedicas
}

// ✅ NUEVAS CONSTANTES
export const FACTORES_RIESGO_CARDIOVASCULAR = [
  'HIPERTENSION ARTERIAL',
  'DIABETES MELLITUS TIPO 2 IR',
  'DIABETES MELLITUS TIPO 2 NIR',
  'DISLIPEMIA',
  'HIPERTRIGLICERIDEMIA',
  'HIPERCOLESTEROLEMIA',
  'TABAQUISMO',
  'OBESIDAD',
  'ESTRÉS',
  'ENFERMEDAD RENAL CRONICA',
  'CONSUMO DE DROGAS'
] as const

export const ESTUDIOS_DISPONIBLES = [
  'Electrocardiograma',
  'Ecocardiograma',
  'Prueba de esfuerzo',
  'Holter de ritmo 24hs',
  'Holter de presión 24hs',
  'Radiografía de tórax',
  'Tomografía cardíaca',
  'Cateterismo cardíaco',
  'Laboratorio completo',
  'Perfil lipídico'
] as const

export const MEDICAMENTOS_COMUNES = [
  'Enalapril 10mg',
  'Losartán 50mg',
  'Amlodipina 5mg',
  'Atenolol 50mg',
  'Metoprolol 50mg',
  'Simvastatina 20mg',
  'Atorvastatina 20mg',
  'Aspirina 100mg',
  'Clopidogrel 75mg',
  'Furosemida 40mg'
] as const

export const CIE10_OPTIONS = [
  'I10 - Hipertensión esencial',
  'I25.1 - Enfermedad aterosclerótica del corazón',
  'I48 - Fibrilación auricular',
  'I50.9 - Insuficiencia cardíaca no especificada',
  'I20.9 - Angina de pecho no especificada',
  'I21.9 - Infarto agudo del miocardio no especificado',
  'I25.9 - Enfermedad cardíaca isquémica crónica',
  'I42.9 - Cardiomiopatía no especificada',
  'I44.1 - Bloqueo auriculoventricular de primer grado',
  'I34.0 - Insuficiencia mitral no reumática'
] as const

// ✅ VALORES POR DEFECTO
export const EXAMEN_POR_SISTEMAS_DEFAULT = {
  pielFaneras: 'NADA QUE LLAME LA ATENCIÓN',
  sistemaRespiratorio: 'NADA QUE LLAME LA ATENCIÓN',
  sistemaCardiovascular: 'NADA QUE LLAME LA ATENCIÓN',
  sistemaGastrointestinal: 'NADA QUE LLAME LA ATENCIÓN',
  sistemaGenitourinario: 'NADA QUE LLAME LA ATENCIÓN',
  sistemaMusculoesqueletico: 'NADA QUE LLAME LA ATENCIÓN',
  sistemaEndocrino: 'NADA QUE LLAME LA ATENCIÓN',
  sistemaNeurologico: 'NADA QUE LLAME LA ATENCIÓN'
} as const

export const EXAMEN_FISICO_DEFAULT = {
  inspeccionGeneral: 'PACIENTE ORIENTADO EN TIEMPO Y ESPACIO, COLABORA CON EL INTERROGATORIO',
  escalaGlasgow: '15/15',
  cuello: 'MOVIL - NO ADENOPATIAS PALPABLES - YUGULAR 0/3',
  torax: 'SIMETRICO',
  corazon: 'RUIDOS CARDIACOS RITMICOS, NO SOPLOS, NO RUIDOS AGREGADOS',
  pulmones: 'CLAROS Y VENTILADOS',
  abdomen: 'BLANDO DEPRESIBLE NO DOLOROSO, NO MASAS RUIDOS HIDROAEREOS PRESENTES',
  extremidadesSuperiores: 'SIMETRICAS - MOVILES - NO DOLOROSOS - PULSOS PRESENTES',
  extremidadesInferiores: 'SIMETRICAS - MOVILES - NO DOLOROSOS - PULSOS PRESENTES - NO EDEMA'
} as const

// Interfaces de respuesta (sin cambios)
export interface IHistoriaClinicaResponse extends Omit<IHistoriaClinica, 'medico'> {
  _id: string
  createdAt: Date
  updatedAt: Date
  medico: {
    _id: string
    firstName: string
    lastName: string
    profile: {
      speciality?: string
    }
  }
}
export interface IHistoriaClinicaCreate extends Omit<IHistoriaClinica, 'medico'> {}
export interface IHistoriaClinicaUpdate extends Partial<IHistoriaClinicaCreate> {}
