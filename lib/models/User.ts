// lib/db/models/User.ts

import mongoose, { Schema, Document } from 'mongoose'
import { IUser, UserRole } from '@/types/user'

// Extendemos IUser con Document de Mongoose
export interface IUserDocument extends IUser, Document {
  _id: string
  createdAt: Date
  updatedAt: Date
}

// Definimos el esquema de MongoDB
const UserSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: [true, 'El email es requerido'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Por favor ingrese un email válido'
      ]
    },

    password: {
      type: String,
      required: [true, 'La contraseña es requerida'],
      minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
    },

    firstName: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true,
      maxlength: [50, 'El nombre no puede exceder 50 caracteres']
    },

    lastName: {
      type: String,
      required: [true, 'El apellido es requerido'],
      trim: true,
      maxlength: [50, 'El apellido no puede exceder 50 caracteres']
    },

    role: {
      type: String,
      enum: Object.values(UserRole),
      required: [true, 'El rol es requerido'],
      default: UserRole.MEDICO
    },

    isActive: {
      type: Boolean,
      default: true
    },

    profile: {
      phone: {
        type: String,
        trim: true,
        match: [/^[\+]?[0-9\s\-\(\)]+$/, 'Por favor ingrese un teléfono válido']
      },

      speciality: {
        type: String,
        trim: true,
        maxlength: [100, 'La especialidad no puede exceder 100 caracteres']
      },

      licenseNumber: {
        type: String,
        trim: true,
        sparse: true // Permite múltiples documentos con null/undefined
      },

      department: {
        type: String,
        trim: true,
        maxlength: [100, 'El departamento no puede exceder 100 caracteres']
      },

      avatar: {
        type: String,
        trim: true
      }
    },

    lastLogin: {
      type: Date
    }
  },
  {
    // Opciones del esquema
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
    versionKey: false, // Elimina el campo __v

    // Configuración del JSON de salida
    toJSON: {
      transform: function(doc, ret) {
        // Eliminar campos sensibles al convertir a JSON
        delete ret.password
        return ret
      }
    }
  }
)

// Índices para mejorar performance
UserSchema.index({ email: 1 })
UserSchema.index({ role: 1 })
UserSchema.index({ isActive: 1 })

// Middleware pre-save para hash de contraseña
UserSchema.pre('save', async function(next) {
  // Solo hash la contraseña si ha sido modificada
  if (!this.isModified('password')) {
    return next()
  }

  try {
    // Importamos bcrypt dinámicamente
    const bcrypt = await import('bcryptjs')
    const saltRounds = 12
    this.password = await bcrypt.hash(this.password, saltRounds)
    next()
  } catch (error) {
    next(error)
  }
})

// Método de instancia para comparar contraseñas
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    const bcrypt = await import('bcryptjs')
    return await bcrypt.compare(candidatePassword, this.password)
  } catch (error) {
    throw new Error('Error al comparar contraseñas')
  }
}

// Método de instancia para obtener nombre completo
UserSchema.methods.getFullName = function(): string {
  return `${this.firstName} ${this.lastName}`
}

// Método estático para buscar por email
UserSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ email: email.toLowerCase(), isActive: true })
}

// Método estático para buscar por rol
UserSchema.statics.findByRole = function(role: UserRole) {
  return this.find({ role, isActive: true })
}

// Evitar re-compilación del modelo en desarrollo (hot reload)
const User = mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema)

export default User
