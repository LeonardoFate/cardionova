// lib/models/Estudio.ts

import mongoose, { Schema, Document, Model } from 'mongoose'
import { TipoEstudio, EstadoEstudio, IArchivoPDF } from '@/types/estudio'

export interface IEstudioDocument extends Document {
  pacienteId: mongoose.Types.ObjectId
  pacienteNombre: string
  pacienteCedula: string
  tipoEstudio: TipoEstudio
  estado: EstadoEstudio
  fechaSolicitud: Date
  fechaRealizacion?: Date
  medicoSolicitante: string
  medicoSolicitanteId: mongoose.Types.ObjectId
  informe?: string
  hallazgos?: string
  conclusion?: string
  recomendaciones?: string
  archivosPDF: IArchivoPDF[]
  observaciones?: string
  createdAt: Date
  updatedAt: Date
}

const ArchivoPDFSchema = new Schema({
  nombre: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  tamanio: {
    type: Number,
    required: true
  },
  fechaCarga: {
    type: Date,
    default: Date.now
  }
}, { _id: false })

const EstudioSchema = new Schema<IEstudioDocument>({
  pacienteId: {
    type: Schema.Types.ObjectId,
    ref: 'Paciente',
    required: true,
    index: true
  },
  pacienteNombre: {
    type: String,
    required: true
  },
  pacienteCedula: {
    type: String,
    required: true,
    index: true
  },
  tipoEstudio: {
    type: String,
    enum: Object.values(TipoEstudio),
    required: true
  },
  estado: {
    type: String,
    enum: Object.values(EstadoEstudio),
    default: EstadoEstudio.PENDIENTE
  },
  fechaSolicitud: {
    type: Date,
    default: Date.now,
    required: true
  },
  fechaRealizacion: {
    type: Date
  },
  medicoSolicitante: {
    type: String,
    required: true
  },
  medicoSolicitanteId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  informe: {
    type: String
  },
  hallazgos: {
    type: String
  },
  conclusion: {
    type: String
  },
  recomendaciones: {
    type: String
  },
  archivosPDF: {
    type: [ArchivoPDFSchema],
    default: []
  },
  observaciones: {
    type: String
  }
}, {
  timestamps: true
})

// Índices compuestos para búsquedas eficientes
EstudioSchema.index({ pacienteCedula: 1, tipoEstudio: 1 })
EstudioSchema.index({ estado: 1, fechaSolicitud: -1 })
EstudioSchema.index({ medicoSolicitanteId: 1, estado: 1 })

// Método estático para buscar estudios por paciente
EstudioSchema.statics.findByPaciente = function(pacienteId: string) {
  return this.find({ pacienteId }).sort({ fechaSolicitud: -1 })
}

// Método estático para buscar estudios por médico
EstudioSchema.statics.findByMedico = function(medicoId: string) {
  return this.find({ medicoSolicitanteId: medicoId }).sort({ fechaSolicitud: -1 })
}

// Método estático para buscar estudios por estado
EstudioSchema.statics.findByEstado = function(estado: EstadoEstudio) {
  return this.find({ estado }).sort({ fechaSolicitud: -1 })
}

const Estudio: Model<IEstudioDocument> = mongoose.models.Estudio || mongoose.model<IEstudioDocument>('Estudio', EstudioSchema)

export default Estudio
