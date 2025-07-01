// lib/models/HistoriaClinica.ts

import mongoose, { Schema, Document } from 'mongoose'
import { IHistoriaClinica } from '@/types/historia-clinica'

export interface IHistoriaClinicaDocument extends IHistoriaClinica, Document {
  _id: string
  createdAt: Date
  updatedAt: Date
}

const HistoriaClinicaSchema = new Schema<IHistoriaClinicaDocument>(
  {
    // Datos del paciente
    paciente: {
      nombre: {
        type: String,
        required: [true, 'El nombre del paciente es requerido'],
        trim: true
      },
      cedula: {
        type: String,
        required: [true, 'La cédula del paciente es requerida'],
        trim: true,
        unique: false // Un paciente puede tener múltiples historias
      },
      tipoSeguro: {
        type: String,
        required: [true, 'El tipo de seguro es requerido'],
        trim: true
      }
    },

    fecha: {
      type: Date,
      required: [true, 'La fecha es requerida'],
      default: Date.now
    },

    // Datos biométricos
    datosBiometricos: {
      edad: {
        type: Number,
        required: [true, 'La edad es requerida'],
        min: [0, 'La edad no puede ser negativa'],
        max: [150, 'La edad no puede ser mayor a 150']
      },
      peso: {
        type: Number,
        required: [true, 'El peso es requerido'],
        min: [1, 'El peso debe ser mayor a 1 kg'],
        max: [500, 'El peso no puede ser mayor a 500 kg']
      },
      estatura: {
        type: Number,
        required: [true, 'La estatura es requerida'],
        min: [30, 'La estatura debe ser mayor a 30 cm'],
        max: [250, 'La estatura no puede ser mayor a 250 cm']
      },
      imc: {
        type: Number,
        min: [10, 'IMC inválido'],
        max: [100, 'IMC inválido']
      }
    },

    // Signos vitales
    signosVitales: {
      presionArterial: {
        type: String,
        required: [true, 'La presión arterial es requerida'],
        trim: true
      },
      frecuenciaCardiaca: {
        type: Number,
        required: [true, 'La frecuencia cardíaca es requerida'],
        min: [30, 'Frecuencia cardíaca muy baja'],
        max: [220, 'Frecuencia cardíaca muy alta']
      },
      satO2: {
        type: Number,
        required: [true, 'La saturación de oxígeno es requerida'],
        min: [50, 'Saturación muy baja'],
        max: [100, 'Saturación no puede ser mayor a 100']
      },
      temperatura: {
        type: Number,
        required: [true, 'La temperatura es requerida'],
        min: [30, 'Temperatura muy baja'],
        max: [45, 'Temperatura muy alta']
      }
    },

    // Información clínica
    motivoConsulta: {
      type: String,
      required: [true, 'El motivo de consulta es requerido'],
      trim: true
    },

    cie10: {
      type: String,
      required: [true, 'El código CIE-10 es requerido'],
      trim: true
    },

    enfermedadActual: {
      type: String,
      required: [true, 'La enfermedad actual es requerida'],
      trim: true
    },

    evolucionEnfermedad: {
      type: String,
      required: [true, 'La evolución de la enfermedad es requerida'],
      trim: true
    },

    // Antecedentes personales
    antecedentesPersonales: {
      factoresRiesgoCardiovascular: [{
        type: String,
        trim: true
      }],
      antecedentesCardiovasculares: {
        type: String,
        trim: true,
        default: ''
      },
      antecedentesPatologicosPersonales: {
        type: String,
        trim: true,
        default: ''
      },
      antecedentesQuirurgicos: {
        type: String,
        trim: true,
        default: ''
      },
      medicacion: [{
        type: String,
        trim: true
      }],
      alergias: {
        type: String,
        trim: true,
        default: ''
      },
      antecedentesPatologicosFamiliares: {
        type: String,
        trim: true,
        default: ''
      }
    },

    // Examen por sistemas
    examenSistemas: {
      pielFaneras: {
        type: String,
        trim: true,
        default: 'NADA QUE LLAME LA ATENCIÓN'
      },
      sistemaRespiratorio: {
        type: String,
        trim: true,
        default: 'NADA QUE LLAME LA ATENCIÓN'
      },
      sistemaCardiovascular: {
        type: String,
        trim: true,
        default: 'NADA QUE LLAME LA ATENCIÓN'
      },
      sistemaGastrointestinal: {
        type: String,
        trim: true,
        default: 'NADA QUE LLAME LA ATENCIÓN'
      },
      sistemaGenitourinario: {
        type: String,
        trim: true,
        default: 'NADA QUE LLAME LA ATENCIÓN'
      },
      sistemaMusculoesqueletico: {
        type: String,
        trim: true,
        default: 'NADA QUE LLAME LA ATENCIÓN'
      },
      sistemaEndocrino: {
        type: String,
        trim: true,
        default: 'NADA QUE LLAME LA ATENCIÓN'
      },
      sistemaNeurologico: {
        type: String,
        trim: true,
        default: 'NADA QUE LLAME LA ATENCIÓN'
      }
    },

    // Examen físico
    examenFisico: {
      inspeccionGeneral: {
        type: String,
        trim: true,
        default: 'PACIENTE ORIENTADO EN TIEMPO Y ESPACIO, COLABORA CON EL INTERROGATORIO'
      },
      escalaGlasgow: {
        type: String,
        trim: true,
        default: '15/15'
      },
      cuello: {
        type: String,
        trim: true,
        default: 'MOVIL - NO ADENOPATIAS PALPABLES - YUGULAR 0/3'
      },
      torax: {
        type: String,
        trim: true,
        default: 'SIMETRICO'
      },
      corazon: {
        type: String,
        trim: true,
        default: 'RUIDOS CARDIACOS RITMICOS, NO SOPLOS, NO RUIDOS AGREGADOS'
      },
      pulmones: {
        type: String,
        trim: true,
        default: 'CLAROS Y VENTILADOS'
      },
      abdomen: {
        type: String,
        trim: true,
        default: 'BLANDO DEPRESIBLE NO DOLOROSO, NO MASAS RUIDOS HIDROAEREOS PRESENTES'
      },
      extremidadesSuperiores: {
        type: String,
        trim: true,
        default: 'SIMETRICAS - MOVILES - NO DOLOROSOS - PULSOS PRESENTES'
      },
      extremidadesInferiores: {
        type: String,
        trim: true,
        default: 'SIMETRICAS - MOVILES - NO DOLOROSOS - PULSOS PRESENTES - NO EDEMA'
      }
    },

    // Estudios realizados
    estudiosRealizados: {
      estudios: [{
        type: String,
        trim: true
      }],
      conclusiones: {
        type: String,
        trim: true,
        default: ''
      }
    },

    // Plan de tratamiento
    plan: {
      tiempoControl: {
        type: Date
      },
      dieta: {
        type: String,
        trim: true,
        required: [true, 'La dieta es requerida']
      },
      actividadFisica: {
        type: String,
        trim: true,
        required: [true, 'La actividad física es requerida']
      },
      pautasAlarma: {
        type: String,
        trim: true,
        required: [true, 'Las pautas de alarma son requeridas']
      },
      reposo: {
        type: String,
        trim: true
      },
      estudiosAdicionales: [{
        type: String,
        trim: true
      }]
    },

    // Tratamiento farmacológico
    tratamiento: {
      medicamentos: [{
        type: String,
        trim: true
      }],
      observaciones: {
        type: String,
        trim: true,
        default: ''
      }
    },

    // Médico responsable
    medico: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El médico es requerido']
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

// Middleware pre-save para calcular IMC automáticamente
HistoriaClinicaSchema.pre('save', function(next) {
  if (this.datosBiometricos.peso && this.datosBiometricos.estatura) {
    const estaturaEnMetros = this.datosBiometricos.estatura / 100
    this.datosBiometricos.imc = Math.round(
      (this.datosBiometricos.peso / (estaturaEnMetros * estaturaEnMetros)) * 100
    ) / 100
  }
  next()
})

// Índices para mejorar performance
HistoriaClinicaSchema.index({ 'paciente.cedula': 1 })
HistoriaClinicaSchema.index({ medico: 1 })
HistoriaClinicaSchema.index({ fecha: -1 })
HistoriaClinicaSchema.index({ 'paciente.nombre': 'text' })

// Métodos estáticos
HistoriaClinicaSchema.statics.findByPaciente = function(cedula: string) {
  return this.find({ 'paciente.cedula': cedula })
    .populate('medico', 'firstName lastName profile.speciality')
    .sort({ fecha: -1 })
}

HistoriaClinicaSchema.statics.findByMedico = function(medicoId: string) {
  return this.find({ medico: medicoId })
    .populate('medico', 'firstName lastName profile.speciality')
    .sort({ fecha: -1 })
}

// Evitar re-compilación del modelo en desarrollo
const HistoriaClinica = mongoose.models.HistoriaClinica ||
  mongoose.model<IHistoriaClinicaDocument>('HistoriaClinica', HistoriaClinicaSchema)

export default HistoriaClinica
