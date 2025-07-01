// types/historia-clinica.ts

export interface IHistoriaClinica {
  _id?: string
  // Datos del paciente
  paciente: {
    nombre: string
    cedula: string
    tipoSeguro: string
  }
  fecha: Date

  // Datos biométricos
  datosBiometricos: {
    edad: number
    peso: number // kg
    estatura: number // cm
    imc: number // calculado automáticamente
  }

  // Signos vitales
  signosVitales: {
    presionArterial: string // ej: "120/80"
    frecuenciaCardiaca: number
    satO2: number
    temperatura: number
  }

  // Información clínica
  motivoConsulta: string
  cie10: string
  enfermedadActual: string
  evolucionEnfermedad: string

  // Antecedentes personales
  antecedentesPersonales: {
    factoresRiesgoCardiovascular: string[]
    antecedentesCardiovasculares: string
    antecedentesPatologicosPersonales: string
    antecedentesQuirurgicos: string
    medicacion: string[]
    alergias: string
    antecedentesPatologicosFamiliares: string
  }

  // Examen por sistemas
  examenSistemas: {
    pielFaneras: string
    sistemaRespiratorio: string
    sistemaCardiovascular: string
    sistemaGastrointestinal: string
    sistemaGenitourinario: string
    sistemaMusculoesqueletico: string
    sistemaEndocrino: string
    sistemaNeurologico: string
  }

  // Examen físico
  examenFisico: {
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

  // Estudios realizados
  estudiosRealizados: {
    estudios: string[]
    conclusiones: string
  }

  // Plan de tratamiento
  plan: {
    tiempoControl?: Date
    dieta: string
    actividadFisica: string
    pautasAlarma: string
    reposo?: string
    estudiosAdicionales: string[]
  }

  // Tratamiento farmacológico
  tratamiento: {
    medicamentos: string[]
    observaciones: string
  }

  // Metadatos
  medico: string // ID del médico
  createdAt?: Date
  updatedAt?: Date
}

export interface IHistoriaClinicaCreate {
  paciente: {
    nombre: string
    cedula: string
    tipoSeguro: string
  }
  fecha: Date
  datosBiometricos: {
    edad: number
    peso: number
    estatura: number
  }
  signosVitales: {
    presionArterial: string
    frecuenciaCardiaca: number
    satO2: number
    temperatura: number
  }
  motivoConsulta: string
  cie10: string
  enfermedadActual: string
  evolucionEnfermedad: string
  antecedentesPersonales: {
    factoresRiesgoCardiovascular: string[]
    antecedentesCardiovasculares: string
    antecedentesPatologicosPersonales: string
    antecedentesQuirurgicos: string
    medicacion: string[]
    alergias: string
    antecedentesPatologicosFamiliares: string
  }
  examenSistemas?: {
    pielFaneras?: string
    sistemaRespiratorio?: string
    sistemaCardiovascular?: string
    sistemaGastrointestinal?: string
    sistemaGenitourinario?: string
    sistemaMusculoesqueletico?: string
    sistemaEndocrino?: string
    sistemaNeurologico?: string
  }
  examenFisico?: {
    inspeccionGeneral?: string
    escalaGlasgow?: string
    cuello?: string
    torax?: string
    corazon?: string
    pulmones?: string
    abdomen?: string
    extremidadesSuperiores?: string
    extremidadesInferiores?: string
  }
  estudiosRealizados?: {
    estudios?: string[]
    conclusiones?: string
  }
  plan: {
    tiempoControl?: Date
    dieta: string
    actividadFisica: string
    pautasAlarma: string
    reposo?: string
    estudiosAdicionales: string[]
  }
  tratamiento: {
    medicamentos: string[]
    observaciones: string
  }
}

export interface IHistoriaClinicaResponse extends Omit<IHistoriaClinica, 'medico'> {
  _id: string
  medico: {
    _id: string
    firstName: string
    lastName: string
    profile: {
      speciality?: string
    }
  }
  createdAt: Date
  updatedAt: Date
}

// Opciones predefinidas para dropdowns
export const CIE10_OPTIONS = [
  'I25.9 - Enfermedad isquémica crónica del corazón, no especificada',
  'I50.9 - Insuficiencia cardíaca, no especificada',
  'I10 - Hipertensión esencial (primaria)',
  'I48.9 - Fibrilación auricular, no especificada',
  'I34.0 - Insuficiencia de la válvula mitral',
  'I35.0 - Estenosis aórtica',
  'I44.2 - Bloqueo auriculoventricular completo',
  'I20.9 - Angina de pecho, no especificada',
  'I21.9 - Infarto agudo del miocardio, no especificado',
  'Z51.11 - Quimioterapia para neoplasia'
]

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
]

export const ESTUDIOS_DISPONIBLES = [
  'Electrocardiograma',
  'Ecocardiograma',
  'Prueba de esfuerzo',
  'Holter de ritmo 24h',
  'Monitoreo ambulatorio de presión arterial',
  'Radiografía de tórax',
  'Cateterismo cardíaco',
  'Tomografía cardíaca',
  'Resonancia magnética cardíaca',
  'Laboratorios completos',
  'Perfil lipídico',
  'Hemograma completo'
]

export const MEDICAMENTOS_COMUNES = [
  'Aspirina 100mg',
  'Atorvastatina 20mg',
  'Enalapril 10mg',
  'Metoprolol 50mg',
  'Amlodipino 5mg',
  'Losartán 50mg',
  'Furosemida 40mg',
  'Carvedilol 6.25mg',
  'Simvastatina 20mg',
  'Clopidogrel 75mg'
]
