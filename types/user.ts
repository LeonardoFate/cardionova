// types/user.ts

export enum UserRole {
  ADMIN = 'ADMIN',
  SECRETARIA = 'SECRETARIA',
  MEDICO = 'MEDICO'
}

export interface IUser {
  _id?: string
  email: string
  password: string
  firstName: string
  lastName: string
  role: UserRole
  isActive: boolean
  profile: {
    phone?: string
    speciality?: string // Solo para médicos
    licenseNumber?: string // Solo para médicos
    department?: string
    avatar?: string
  }
  createdAt?: Date
  updatedAt?: Date
  lastLogin?: Date
}

// Tipo para crear usuario (sin campos auto-generados)
export interface IUserCreate {
  email: string
  password: string
  firstName: string
  lastName: string
  role: UserRole
  profile?: {
    phone?: string
    speciality?: string
    licenseNumber?: string
    department?: string
  }
}

// Tipo para respuesta (sin password)
export interface IUserResponse {
  _id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  isActive: boolean
  profile: {
    phone?: string
    speciality?: string
    licenseNumber?: string
    department?: string
    avatar?: string
  }
  createdAt: Date
  updatedAt: Date
  lastLogin?: Date
}
