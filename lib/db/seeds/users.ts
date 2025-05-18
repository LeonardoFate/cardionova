// lib/db/seeds/users.ts

import dbConnect from '../connection'
import User from '../../models/User'
import { UserRole } from '@/types/user'

// Usuarios predefinidos para desarrollo
export const seedUsers = [
  {
    email: 'admin@cardionova.com',
    password: 'Admin123!',
    firstName: 'Administrador',
    lastName: 'Sistema',
    role: UserRole.ADMIN,
    isActive: true,
    profile: {
      phone: '+54 11 4567-8900',
      department: 'Administración'
    }
  },
  {
    email: 'secretaria@cardionova.com',
    password: 'Secretaria123!',
    firstName: 'María',
    lastName: 'González',
    role: UserRole.SECRETARIA,
    isActive: true,
    profile: {
      phone: '+54 11 4567-8901',
      department: 'Recepción'
    }
  },
  {
    email: 'dr.rodriguez@cardionova.com',
    password: 'Doctor123!',
    firstName: 'María',
    lastName: 'Rodríguez',
    role: UserRole.MEDICO,
    isActive: true,
    profile: {
      phone: '+54 11 4567-8902',
      speciality: 'Cardiología Clínica',
      licenseNumber: 'MN-12345',
      department: 'Cardiología'
    }
  },
  {
    email: 'dr.mendoza@cardionova.com',
    password: 'Doctor123!',
    firstName: 'Carlos',
    lastName: 'Mendoza',
    role: UserRole.MEDICO,
    isActive: true,
    profile: {
      phone: '+54 11 4567-8903',
      speciality: 'Electrofisiología Cardíaca',
      licenseNumber: 'MN-12346',
      department: 'Cardiología'
    }
  },
  {
    email: 'dra.gomez@cardionova.com',
    password: 'Doctor123!',
    firstName: 'Ana',
    lastName: 'Gómez',
    role: UserRole.MEDICO,
    isActive: true,
    profile: {
      phone: '+54 11 4567-8904',
      speciality: 'Cardiología Intervencionista',
      licenseNumber: 'MN-12347',
      department: 'Cardiología'
    }
  }
]

/**
 * Función para crear todos los usuarios semilla
 */
export async function createSeedUsers() {
  console.log('🌱 Iniciando creación de usuarios semilla...')

  try {
    // Conectar a la base de datos
    await dbConnect()
    console.log('✅ Conectado a MongoDB')

    // Crear usuarios uno por uno
    for (const userData of seedUsers) {
      try {
        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email: userData.email })

        if (existingUser) {
          console.log(`⚠️  Usuario ${userData.email} ya existe, omitiendo...`)
          continue
        }

        // Crear nuevo usuario
        const user = new User(userData)
        await user.save()

        console.log(`✅ Usuario creado: ${userData.email} (${userData.role})`)

      } catch (userError) {
        console.error(`❌ Error creando usuario ${userData.email}:`, userError)
      }
    }

    console.log('🎉 Proceso de creación de usuarios completado')

  } catch (error) {
    console.error('❌ Error en el proceso de seeding:', error)
    throw error
  }
}

/**
 * Función para eliminar todos los usuarios (usar con cuidado)
 */
export async function clearUsers() {
  console.log('🗑️  Eliminando todos los usuarios...')

  try {
    await dbConnect()
    const result = await User.deleteMany({})
    console.log(`✅ ${result.deletedCount} usuarios eliminados`)
  } catch (error) {
    console.error('❌ Error eliminando usuarios:', error)
    throw error
  }
}

/**
 * Función para mostrar todos los usuarios existentes
 */
export async function listUsers() {
  console.log('📋 Listando usuarios existentes...')

  try {
    await dbConnect()
    const users = await User.find({}, '-password').sort({ role: 1, firstName: 1 })

    console.log('\n=== USUARIOS EXISTENTES ===')
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.firstName} ${user.lastName}`)
      console.log(`   Email: ${user.email}`)
      console.log(`   Rol: ${user.role}`)
      console.log(`   Activo: ${user.isActive ? 'Sí' : 'No'}`)
      console.log(`   Creado: ${user.createdAt?.toLocaleDateString()}`)
      console.log('   ---')
    })

    return users
  } catch (error) {
    console.error('❌ Error listando usuarios:', error)
    throw error
  }
}
