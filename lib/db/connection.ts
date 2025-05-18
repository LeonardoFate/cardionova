import mongoose from 'mongoose'

const MONGODB_URI: string = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

// Definimos una interfaz para el objeto en caché
interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

// Usamos el objeto global para mantener la caché entre recargas (importante para desarrollo)
const globalWithMongoose = globalThis as typeof globalThis & {
  mongoose: MongooseCache
}

// Inicializamos la caché si no existe
let cached = globalWithMongoose.mongoose

if (!cached) {
  cached = globalWithMongoose.mongoose = { conn: null, promise: null }
}

// Función principal de conexión
async function dbConnect(): Promise<typeof mongoose> {
  // Retorna la conexión en caché si existe
  if (cached.conn) {
    return cached.conn
  }

  // Opciones de conexión recomendadas
  const opts = {
    bufferCommands: false,
    dbName: 'cardionova',
  }

  // Si no hay una promesa activa, se crea una nueva
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, opts)
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export async function dbDisconnect(): Promise<void> {
  if (cached.conn) {
    await cached.conn.disconnect()
    cached.conn = null
    cached.promise = null
  }
}

export default dbConnect
