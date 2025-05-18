// scripts/create-admin.ts
import dotenv from 'dotenv'
import path from 'path'
import dbConnect from '../lib/db/connection'
import User from '../lib/models/User'
import { UserRole } from '../types/user'

async function createAdmin() {
  try {
    console.log('👑 Creando usuario administrador...')

    // Conectar a la base de datos
    await dbConnect()

    // Verificar si ya existe un admin
    const existingAdmin = await User.findOne({
      email: 'admin@cardionova.com'
    })

    if (existingAdmin) {
      console.log('⚠️  El administrador ya existe')
      console.log(`   Email: ${existingAdmin.email}`)
      console.log(`   Nombre: ${existingAdmin.firstName} ${existingAdmin.lastName}`)
      process.exit(0)
    }

    // Crear administrador
    const adminData = {
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
    }

    const admin = new User(adminData)
    await admin.save()

    console.log('✅ Administrador creado exitosamente')
    console.log('📋 Credenciales de acceso:')
    console.log(`   Email: ${adminData.email}`)
    console.log(`   Contraseña: ${adminData.password}`)
    console.log('⚠️  Cambie la contraseña después del primer login')

  } catch (error) {
    console.error('❌ Error creando administrador:', error)
    process.exit(1)
  }

  process.exit(0)
}

createAdmin()
