// test-connection.js (en la raíz del proyecto)

// Como usamos TypeScript, necesitamos compilar o usar una ruta diferente
const path = require('path')

async function testConnection() {
  try {
    // Importación dinámica para TypeScript
    const { default: dbConnect } = await import('./lib/db/connection.js')
    await dbConnect()
    console.log('✅ Conexión exitosa a MongoDB')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error)
    process.exit(1)
  }
}

testConnection()
