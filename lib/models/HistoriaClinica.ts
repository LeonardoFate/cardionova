// lib/models/HistoriaClinica.ts - ARREGLO TYPESCRIPT

import mongoose, { Schema, Document } from 'mongoose'
import { IHistoriaClinica } from '@/types/historia-clinica'

// ✅ ARREGLO: Extender correctamente la interfaz
export interface IHistoriaClinicaDocument extends Omit<IHistoriaClinica, 'medico'>, Document {
  _id: string
  medico: mongoose.Types.ObjectId
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
        unique: false
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
        min: [0, 'La temperatura debe ser un número positivo']

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
    examenPorSistemas: {
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
      estudiosSeleccionados: [{
        type: String,
        trim: true
      }],
      resultados: {
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

    // Órdenes médicas (opcional)
    ordenesMedicas: {
      recetas: [{
        numero: { type: String },
        medicamentos: [{
          nombre: { type: String, required: true },
          concentracion: { type: String, required: true },
          presentacion: { type: String, required: true },
          cantidad: { type: String, required: true },
          dosificacion: { type: String, required: true },
          frecuencia: { type: String, required: true },
          duracion: { type: String, required: true },
          viaAdministracion: { type: String, required: true },
          indicaciones: { type: String }
        }],
        observaciones: { type: String },
        fechaEmision: { type: Date, default: Date.now },
        vigencia: { type: String, default: '30 días' }
      }],
      estudios: [{
        numero: { type: String },
        tipo: { type: String, required: true },
        nombre: { type: String, required: true },
        justificacion: { type: String, required: true },
        urgente: { type: Boolean, default: false },
        ayunas: { type: Boolean, default: false },
        preparacion: { type: String },
        indicaciones: { type: String },
        fechaEmision: { type: Date, default: Date.now }
      }],
      reposos: [{
        numero: { type: String },
        tipo: { type: String, required: true },
        dias: { type: Number, required: true },
        desde: { type: Date, required: true },
        hasta: { type: Date, required: true },
        diagnostico: { type: String, required: true },
        recomendaciones: { type: String },
        fechaEmision: { type: Date, default: Date.now }
      }],
      interconsultas: [{
        numero: { type: String },
        especialidad: { type: String, required: true },
        profesionalSolicitado: { type: String },
        motivo: { type: String, required: true },
        antecedentes: { type: String, required: true },
        examenesRealizados: { type: String },
        diagnosticoPresuntivo: { type: String, required: true },
        urgente: { type: Boolean, default: false },
        fechaEmision: { type: Date, default: Date.now }
      }]
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

// ✅ ARREGLO: Middleware pre-save con tipo correcto
HistoriaClinicaSchema.pre('save', function(this: IHistoriaClinicaDocument, next) {
  // Verificar que los datos biométricos existen antes de calcular IMC
  if (this.datosBiometricos?.peso && this.datosBiometricos?.estatura) {
    const estaturaEnMetros = this.datosBiometricos.estatura / 100
    this.datosBiometricos.imc = Math.round(
      (this.datosBiometricos.peso / (estaturaEnMetros * estaturaEnMetros)) * 100
    ) / 100
  }

  // Generar números de orden automáticamente
  if (this.ordenesMedicas) {
    const fecha = new Date()
    const fechaStr = fecha.toISOString().split('T')[0].replace(/-/g, '')
    const medicoId = this.medico.toString().slice(-4)

    // Generar números para recetas
    if (this.ordenesMedicas.recetas) {
      this.ordenesMedicas.recetas.forEach((receta: any, idx: number) => {
        if (!receta.numero) {
          receta.numero = `RX-${fechaStr}-${medicoId}-${(idx + 1).toString().padStart(3, '0')}`
        }
      })
    }

    // Generar números para estudios
    if (this.ordenesMedicas.estudios) {
      this.ordenesMedicas.estudios.forEach((estudio: any, idx: number) => {
        if (!estudio.numero) {
          estudio.numero = `EST-${fechaStr}-${medicoId}-${(idx + 1).toString().padStart(3, '0')}`
        }
      })
    }

    // Generar números para reposos
    if (this.ordenesMedicas.reposos) {
      this.ordenesMedicas.reposos.forEach((reposo: any, idx: number) => {
        if (!reposo.numero) {
          reposo.numero = `REP-${fechaStr}-${medicoId}-${(idx + 1).toString().padStart(3, '0')}`
        }
      })
    }

    // Generar números para interconsultas
    if (this.ordenesMedicas.interconsultas) {
      this.ordenesMedicas.interconsultas.forEach((inter: any, idx: number) => {
        if (!inter.numero) {
          inter.numero = `INT-${fechaStr}-${medicoId}-${(idx + 1).toString().padStart(3, '0')}`
        }
      })
    }
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