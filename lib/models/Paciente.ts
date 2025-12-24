// lib/models/Paciente.ts

import mongoose, { Schema, Document } from 'mongoose'
import { IPaciente, EstadoPaciente, TipoSeguro } from '@/types/paciente'

export interface IPacienteDocument extends IPaciente, Document {
  _id: string
  createdAt: Date
  updatedAt: Date
}

const PacienteSchema = new Schema<IPacienteDocument>(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del paciente es requerido'],
      trim: true,
      maxlength: [100, 'El nombre no puede exceder 100 caracteres']
    },
    apellido: {
      type: String,
      required: [true, 'El apellido del paciente es requerido'],
      trim: true,
      maxlength: [100, 'El apellido no puede exceder 100 caracteres']
    },
    cedula: {
      type: String,
      required: [true, 'La cédula es requerida'],
      trim: true,
      index: true
    },
    fechaNacimiento: {
      type: Date,
      required: [true, 'La fecha de nacimiento es requerida']
    },
    edad: {
      type: Number,
      required: [true, 'La edad es requerida'],
      min: [0, 'La edad no puede ser negativa'],
      max: [150, 'La edad no puede ser mayor a 150']
    },
    telefono: {
      type: String,
      required: [true, 'El teléfono es requerido'],
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    direccion: {
      type: String,
      trim: true
    },
    tipoSeguro: {
      type: String,
      enum: Object.values(TipoSeguro),
      required: [true, 'El tipo de seguro es requerido']
    },
    numeroSeguro: {
      type: String,
      trim: true
    },
    contactoEmergencia: {
      nombre: {
        type: String,
        trim: true
      },
      telefono: {
        type: String,
        trim: true
      },
      relacion: {
        type: String,
        trim: true
      }
    },
    observaciones: {
      type: String,
      trim: true
    },
    medicoAsignado: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El médico asignado es requerido'],
      index: true
    },
    estado: {
      type: String,
      enum: Object.values(EstadoPaciente),
      default: EstadoPaciente.EN_ESPERA,
      index: true
    },
    fechaRegistro: {
      type: Date,
      default: Date.now
    },
    horaLlegada: {
      type: Date,
      default: Date.now
    },
    registradoPor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El usuario que registra es requerido']
    },
    historiaClinicaId: {
      type: Schema.Types.ObjectId,
      ref: 'HistoriaClinica'
    }
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: function(doc, ret) {
        return ret
      }
    }
  }
)

// Índices para mejorar performance
PacienteSchema.index({ cedula: 1 })
PacienteSchema.index({ medicoAsignado: 1, estado: 1 })
PacienteSchema.index({ fechaRegistro: -1 })
PacienteSchema.index({ estado: 1, fechaRegistro: -1 })
PacienteSchema.index({ nombre: 'text', apellido: 'text' })

// Método pre-save para calcular edad si no se proporciona
PacienteSchema.pre('save', function(next) {
  if (this.fechaNacimiento && !this.edad) {
    const today = new Date()
    const birthDate = new Date(this.fechaNacimiento)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    this.edad = age
  }
  next()
})

// Métodos estáticos
PacienteSchema.statics.findByCedula = function(cedula: string) {
  return this.find({ cedula })
    .populate('medicoAsignado', 'firstName lastName profile.speciality')
    .populate('registradoPor', 'firstName lastName')
    .sort({ fechaRegistro: -1 })
}

PacienteSchema.statics.findByMedico = function(medicoId: string) {
  return this.find({ medicoAsignado: medicoId })
    .populate('medicoAsignado', 'firstName lastName profile.speciality')
    .populate('registradoPor', 'firstName lastName')
    .sort({ fechaRegistro: -1 })
}

PacienteSchema.statics.findEnEsperaByMedico = function(medicoId: string) {
  return this.find({
    medicoAsignado: medicoId,
    estado: EstadoPaciente.EN_ESPERA
  })
    .populate('medicoAsignado', 'firstName lastName profile.speciality')
    .populate('registradoPor', 'firstName lastName')
    .sort({ horaLlegada: 1 })
}

PacienteSchema.statics.findPacientesDelDia = function() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  return this.find({
    fechaRegistro: {
      $gte: today,
      $lt: tomorrow
    }
  })
    .populate('medicoAsignado', 'firstName lastName profile.speciality')
    .populate('registradoPor', 'firstName lastName')
    .sort({ horaLlegada: 1 })
}

// Evitar re-compilación del modelo en desarrollo
const Paciente = mongoose.models.Paciente ||
  mongoose.model<IPacienteDocument>('Paciente', PacienteSchema)

export default Paciente
