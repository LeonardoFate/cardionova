// types/paciente.ts

export enum EstadoPaciente {
  EN_ESPERA = 'EN_ESPERA',
  EN_CONSULTA = 'EN_CONSULTA',
  ATENDIDO = 'ATENDIDO',
  CANCELADO = 'CANCELADO'
}

export enum TipoSeguro {
  PARTICULAR = 'PARTICULAR',
  IESS = 'IESS',
  ISSFA = 'ISSFA',
  ISSPOL = 'ISSPOL',
  PRIVADO = 'PRIVADO',
  OTRO = 'OTRO'
}

export interface IPaciente {
  nombre: string
  apellido: string
  cedula: string
  fechaNacimiento: Date
  edad: number
  telefono: string
  email?: string
  direccion?: string
  tipoSeguro: TipoSeguro
  numeroSeguro?: string
  contactoEmergencia?: {
    nombre: string
    telefono: string
    relacion: string
  }
  observaciones?: string
  medicoAsignado: string // ID del médico
  estado: EstadoPaciente
  fechaRegistro: Date
  horaLlegada: Date
  registradoPor: string // ID de la secretaria
  historiaClinicaId?: string // ID de la historia clínica si ya fue atendido
}

export interface IPacienteDocument extends IPaciente {
  _id: string
  createdAt: Date
  updatedAt: Date
}

export interface IPacienteResponse extends IPacienteDocument {
  medicoAsignado: {
    _id: string
    firstName: string
    lastName: string
    profile: {
      speciality?: string
    }
  }
  registradoPor: {
    _id: string
    firstName: string
    lastName: string
  }
}

export interface CreatePacienteInput {
  nombre: string
  apellido: string
  cedula: string
  fechaNacimiento: Date | string
  telefono: string
  email?: string
  direccion?: string
  tipoSeguro: TipoSeguro
  numeroSeguro?: string
  contactoEmergencia?: {
    nombre: string
    telefono: string
    relacion: string
  }
  observaciones?: string
  medicoAsignado: string
}

export interface UpdatePacienteInput extends Partial<CreatePacienteInput> {
  estado?: EstadoPaciente
  historiaClinicaId?: string
}
