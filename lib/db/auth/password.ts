// lib/auth/password.ts

import bcrypt from 'bcryptjs'

/**
 * Hashea una contraseña usando bcrypt
 * @param password - Contraseña en texto plano
 * @returns Promise con la contraseña hasheada
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    return hashedPassword
  } catch (error) {
    throw new Error('Error al hashear la contraseña')
  }
}

/**
 * Compara una contraseña en texto plano con una hasheada
 * @param password - Contraseña en texto plano
 * @param hashedPassword - Contraseña hasheada
 * @returns Promise con true si coinciden, false si no
 */
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword)
    return isMatch
  } catch (error) {
    throw new Error('Error al comparar contraseñas')
  }
}

/**
 * Valida la fortaleza de una contraseña
 * @param password - Contraseña a validar
 * @returns Objeto con validación y errores
 */
export function validatePasswordStrength(password: string) {
  const errors: string[] = []
  let isValid = true

  // Mínimo 8 caracteres
  if (password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres')
    isValid = false
  }

  // Al menos una letra minúscula
  if (!/[a-z]/.test(password)) {
    errors.push('La contraseña debe tener al menos una letra minúscula')
    isValid = false
  }

  // Al menos una letra mayúscula
  if (!/[A-Z]/.test(password)) {
    errors.push('La contraseña debe tener al menos una letra mayúscula')
    isValid = false
  }

  // Al menos un número
  if (!/\d/.test(password)) {
    errors.push('La contraseña debe tener al menos un número')
    isValid = false
  }

  // Al menos un caracter especial
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('La contraseña debe tener al menos un caracter especial')
    isValid = false
  }

  return {
    isValid,
    errors,
    strength: calculatePasswordStrength(password)
  }
}

/**
 * Calcula la fuerza de una contraseña (1-5)
 * @param password - Contraseña a evaluar
 * @returns Número del 1 al 5 representando la fuerza
 */
function calculatePasswordStrength(password: string): number {
  let strength = 0

  // Longitud
  if (password.length >= 8) strength++
  if (password.length >= 12) strength++

  // Variedad de caracteres
  if (/[a-z]/.test(password)) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/\d/.test(password)) strength++
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++

  // Máximo 5
  return Math.min(strength, 5)
}

/**
 * Genera una contraseña aleatoria segura
 * @param length - Longitud de la contraseña (default: 12)
 * @returns Contraseña aleatoria
 */
export function generateSecurePassword(length: number = 12): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'
  const symbols = '!@#$%^&*(),.?":{}|<>'

  const allChars = lowercase + uppercase + numbers + symbols
  let password = ''

  // Asegurar al menos un caracter de cada tipo
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += symbols[Math.floor(Math.random() * symbols.length)]

  // Completar con caracteres aleatorios
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)]
  }

  // Mezclar la contraseña
  return password.split('').sort(() => Math.random() - 0.5).join('')
}
