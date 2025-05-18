// lib/validations/index.ts

// Exportar validaciones de autenticación
export * from './auth'

// Exportar validaciones de usuario
export * from './user'

// Función auxiliar para formatear errores de Zod
export function formatZodError(error: any): string[] {
  if (error.errors) {
    return error.errors.map((err: any) => {
      const path = err.path.join('.')
      return path ? `${path}: ${err.message}` : err.message
    })
  }
  return [error.message || 'Error de validación']
}

// Función auxiliar para manejar errores de Zod en APIs
export function handleValidationError(error: any) {
  const errors = formatZodError(error)
  return {
    success: false,
    message: 'Errores de validación',
    errors
  }
}
