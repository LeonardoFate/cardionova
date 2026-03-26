// types/orden-medica.ts

// ========================================
// ENUMS
// ========================================

export enum TipoOrden {
  RECETA = 'RECETA',
  ESTUDIO = 'ESTUDIO',
  REPOSO = 'REPOSO',
  INTERCONSULTA = 'INTERCONSULTA'
}

export enum ViaAdministracion {
  ORAL = 'ORAL',
  INTRAVENOSA = 'INTRAVENOSA',
  INTRAMUSCULAR = 'INTRAMUSCULAR',
  SUBCUTANEA = 'SUBCUTANEA',
  TOPICA = 'TOPICA',
  RECTAL = 'RECTAL',
  INHALATORIA = 'INHALATORIA',
  OFTALMICA = 'OFTALMICA',
  OTICA = 'OTICA'
}

export enum TipoEstudioOrden {
  LABORATORIO = 'LABORATORIO',
  IMAGEN = 'IMAGEN',
  PROCEDIMIENTO = 'PROCEDIMIENTO',
  ELECTRODIAGNOSTICO = 'ELECTRODIAGNOSTICO'
}

export enum TipoReposo {
  ABSOLUTO = 'ABSOLUTO',
  RELATIVO = 'RELATIVO',
  LABORAL = 'LABORAL'
}

export enum EspecialidadInterconsulta {
  CARDIOLOGIA = 'CARDIOLOGIA',
  MEDICINA_INTERNA = 'MEDICINA INTERNA',
  NEUROLOGIA = 'NEUROLOGIA',
  ENDOCRINOLOGIA = 'ENDOCRINOLOGIA',
  NEFROLOGIA = 'NEFROLOGIA',
  NEUMOLOGIA = 'NEUMOLOGIA',
  GASTROENTEROLOGIA = 'GASTROENTEROLOGIA',
  CIRUGIA_CARDIOVASCULAR = 'CIRUGIA CARDIOVASCULAR',
  NUTRICION = 'NUTRICION',
  PSICOLOGIA = 'PSICOLOGIA',
  REHABILITACION = 'REHABILITACION',
  OTRA = 'OTRA'
}

// ========================================
// INTERFACES DE MEDICAMENTOS
// ========================================

export interface IMedicamentoOrden {
  nombre: string
  concentracion: string
  presentacion: string
  cantidad: string
  dosificacion: string
  frecuencia: string
  duracion: string
  viaAdministracion: ViaAdministracion
  indicaciones?: string
}

export interface IReceta {
  numero?: string
  medicamentos: IMedicamentoOrden[]
  observaciones?: string
  fechaEmision: Date
  vigencia: string
}

// ========================================
// INTERFACES DE ESTUDIOS
// ========================================

export interface IEstudioOrden {
  numero?: string
  tipo: TipoEstudioOrden
  nombre: string
  justificacion: string
  urgente: boolean
  ayunas: boolean
  preparacion?: string
  indicaciones?: string
  fechaEmision: Date
}

// ========================================
// INTERFACES DE REPOSO
// ========================================

export interface IReposo {
  numero?: string
  tipo: TipoReposo
  dias: number
  desde: Date
  hasta: Date
  diagnostico: string
  recomendaciones?: string
  fechaEmision: Date
}

// ========================================
// INTERFACES DE INTERCONSULTA
// ========================================

export interface IInterconsulta {
  numero?: string
  especialidad: EspecialidadInterconsulta | string
  profesionalSolicitado?: string
  motivo: string
  antecedentes: string
  examenesRealizados?: string
  diagnosticoPresuntivo: string
  urgente: boolean
  fechaEmision: Date
}

// ========================================
// INTERFACE PRINCIPAL
// ========================================

export interface IOrdenesMedicas {
  recetas: IReceta[]
  estudios: IEstudioOrden[]
  reposos: IReposo[]
  interconsultas: IInterconsulta[]
}

// ========================================
// CONSTANTES PARA UI
// ========================================

export const PRESENTACIONES_MEDICAMENTO = [
  'Tabletas',
  'Cápsulas',
  'Jarabe',
  'Suspensión',
  'Solución',
  'Gotas',
  'Crema',
  'Ungüento',
  'Gel',
  'Parche',
  'Inyectable',
  'Supositorio',
  'Inhalador',
  'Aerosol'
] as const

export const FRECUENCIAS_COMUNES = [
  'Cada 4 horas',
  'Cada 6 horas',
  'Cada 8 horas',
  'Cada 12 horas',
  'Cada 24 horas',
  'Una vez al día',
  'Dos veces al día',
  'Tres veces al día',
  'Antes de dormir',
  'Según necesidad'
] as const

export const ESTUDIOS_LABORATORIO = [
  'Hemograma completo',
  'Química sanguínea',
  'Perfil lipídico',
  'Perfil tiroideo',
  'Perfil renal',
  'Perfil hepático',
  'Electrolitos',
  'Troponina',
  'BNP / NT-proBNP',
  'Dímero D',
  'Proteína C reactiva',
  'Hemoglobina glicosilada (HbA1c)',
  'Glucosa en ayunas',
  'Examen general de orina',
  'Coagulación (TP, TPT, INR)'
] as const

export const ESTUDIOS_IMAGEN = [
  'Radiografía de tórax',
  'Ecocardiograma transtorácico',
  'Ecocardiograma transesofágico',
  'Tomografía cardíaca',
  'Resonancia magnética cardíaca',
  'Angiografía coronaria',
  'Ultrasonido Doppler vascular',
  'Tomografía de tórax',
  'PET cardíaco'
] as const

export const ESTUDIOS_ELECTRODIAGNOSTICO = [
  'Electrocardiograma de reposo',
  'Holter de ritmo 24 horas',
  'Holter de presión 24 horas',
  'Prueba de esfuerzo',
  'Ecocardiograma de estrés',
  'Estudio electrofisiológico',
  'Monitoreo ambulatorio de presión'
] as const

export const ESTUDIOS_PROCEDIMIENTO = [
  'Cateterismo cardíaco diagnóstico',
  'Coronariografía',
  'Angioplastia coronaria',
  'Implante de marcapasos',
  'Cardioversión eléctrica',
  'Ablación por catéter',
  'Biopsia endomiocárdica'
] as const
