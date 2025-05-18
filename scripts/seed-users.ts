// scripts/seed-users.ts
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { createSeedUsers, clearUsers, listUsers } from '../lib/db/seeds/users'

// Obtener argumentos de la línea de comandos
const command = process.argv[2]

async function main() {
  switch (command) {
    case 'create':
      await createSeedUsers()
      break

    case 'clear':
      console.log('⚠️  ADVERTENCIA: Esta acción eliminará TODOS los usuarios')
      console.log('⏳ Esperando 3 segundos para cancelar (Ctrl+C)...')

      // Dar tiempo para cancelar
      await new Promise(resolve => setTimeout(resolve, 3000))
      await clearUsers()
      break

    case 'list':
      await listUsers()
      break

    case 'reset':
      console.log('🔄 Reiniciando base de datos de usuarios...')
      await clearUsers()
      await createSeedUsers()
      break

    default:
      console.log('📖 Uso del script:')
      console.log('  npm run seed:users create  - Crear usuarios semilla')
      console.log('  npm run seed:users list    - Listar usuarios existentes')
      console.log('  npm run seed:users clear   - Eliminar todos los usuarios')
      console.log('  npm run seed:users reset   - Eliminar y recrear usuarios')
      process.exit(1)
  }

  console.log('✅ Script completado')
  process.exit(0)
}

// Ejecutar función principal y manejar errores
main().catch(error => {
  console.error('💥 Error ejecutando script:', error)
  process.exit(1)
})
