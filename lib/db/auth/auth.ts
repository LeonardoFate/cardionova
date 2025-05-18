// lib/auth/auth.ts

import { cookies } from 'next/headers'
import { verifyAccessToken, TokenPayload } from './jwt'

// Configuración de cookies
export const AUTH_COOKIE_NAME = 'cardionova-auth-token'
export const REFRESH_COOKIE_NAME = 'cardionova-refresh-token'

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7 // 7 días
}

export const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 30 // 30 días
}

/**
 * Obtiene el usuario actual desde las cookies
 * @returns Payload del token o null si no está autenticado
 */
export async function getCurrentUser(): Promise<TokenPayload | null> {
  try {
    const cookieStore = await cookies() // ✅ Agregar await
    const token = cookieStore.get(AUTH_COOKIE_NAME)

    if (!token) {
      return null
    }

    const payload = verifyAccessToken(token.value)
    return payload
  } catch (error) {
    console.error('Error obteniendo usuario actual:', error)
    return null
  }
}

/**
 * Verifica si el usuario tiene un rol específico
 */
export function hasRole(userRole: string, requiredRole: string): boolean {
  return userRole === requiredRole
}

/**
 * Verifica si el usuario tiene cualquiera de los roles especificados
 */
export function hasAnyRole(userRole: string, allowedRoles: string[]): boolean {
  return allowedRoles.includes(userRole)
}

/**
 * Verifica si el usuario es administrador
 */
export function isAdmin(userRole: string): boolean {
  return userRole === 'ADMIN'
}

/**
 * Elimina las cookies de autenticación
 */
export async function clearAuthCookies() {
  const cookieStore = await cookies() // ✅ Agregar await

  cookieStore.delete(AUTH_COOKIE_NAME)
  cookieStore.delete(REFRESH_COOKIE_NAME)
}
