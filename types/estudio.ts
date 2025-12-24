// types/estudio.ts

export enum TipoEstudio {
  ELECTROCARDIOGRAMA = 'ELECTROCARDIOGRAMA',
  ECOCARDIOGRAMA = 'ECOCARDIOGRAMA',
  HOLTER_RITMO = 'HOLTER_RITMO',
  HOLTER_PRESION = 'HOLTER_PRESION',
  PRUEBA_ESFUERZO = 'PRUEBA_ESFUERZO',
  MONITOREO_AMBULATORIO = 'MONITOREO_AMBULATORIO',
  OTRO = 'OTRO'
}

export enum EstadoEstudio {
  PENDIENTE = 'PENDIENTE',
  EN_PROCESO = 'EN_PROCESO',
  COMPLETADO = 'COMPLETADO',
  CANCELADO = 'CANCELADO'
}

export interface IArchivoPDF {
  nombre: string
  url: string
  tamanio: number
  fechaCarga: Date
}

export interface IEstudio {
  pacienteId: string
  pacienteNombre: string
  pacienteCedula: string
  tipoEstudio: TipoEstudio
  estado: EstadoEstudio
  fechaSolicitud: Date
  fechaRealizacion?: Date
  medicoSolicitante: string
  medicoSolicitanteId: string
  informe?: string
  hallazgos?: string
  conclusion?: string
  recomendaciones?: string
  archivosPDF: IArchivoPDF[]
  observaciones?: string
  createdAt: Date
  updatedAt: Date
}

export interface IEstudioResponse extends IEstudio {
  _id: string
}

export interface IEstudioCreate {
  pacienteId: string
  pacienteNombre: string
  pacienteCedula: string
  tipoEstudio: TipoEstudio
  medicoSolicitante: string
  medicoSolicitanteId: string
  observaciones?: string
}

export interface IEstudioUpdate {
  tipoEstudio?: TipoEstudio
  estado?: EstadoEstudio
  fechaRealizacion?: Date
  informe?: string
  hallazgos?: string
  conclusion?: string
  recomendaciones?: string
  observaciones?: string
}
