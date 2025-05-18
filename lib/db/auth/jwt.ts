// lib/auth/jwt.ts

import jwt from 'jsonwebtoken'
import { UserRole } from '@/types/user'

// Tipos para los tokens
export interface TokenPayload {
  userId: string
  email: string
  role: UserRole
  iat?: number
  exp?: number
}

export interface RefreshTokenPayload {
  userId: string
  tokenVersion?: number
  iat?: number
  exp?: number
}

/**
 * Genera un token de acceso JWT
 * @param payload - Datos del usuario para incluir en el token
 * @returns Token JWT firmado
 */
export function generateAccessToken(payload: TokenPayload): string {
  const secret = process.env.JWT_SECRET
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d'

  if (!secret) {
    throw new Error('JWT_SECRET no está definido en las variables de entorno')
  }

  try {
    const token = jwt.sign(
      {
        userId: payload.userId,
        email: payload.email,
        role: payload.role
      },
      secret,
      {
        expiresIn,
        algorithm: 'HS256'
      }
    )

    return token
  } catch (error) {
    throw new Error('Error al generar el token de acceso')
  }
}

/**
 * Genera un refresh token JWT
 * @param payload - Datos para el refresh token
 * @returns Refresh token firmado
 */
export function generateRefreshToken(payload: RefreshTokenPayload): string {
  const secret = process.env.REFRESH_TOKEN_SECRET
  const expiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN || '30d'

  if (!secret) {
    throw new Error('REFRESH_TOKEN_SECRET no está definido en las variables de entorno')
  }

  try {
    const token = jwt.sign(
      {
        userId: payload.userId,
        tokenVersion: payload.tokenVersion || 0
      },
      secret,
      {
        expiresIn,
        algorithm: 'HS256'
      }
    )

    return token
  } catch (error) {
    throw new Error('Error al generar el refresh token')
  }
}

/**
 * Verifica y decodifica un token de acceso
 * @param token - Token JWT a verificar
 * @returns Payload decodificado del token
 */
export function verifyAccessToken(token: string): TokenPayload {
  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new Error('JWT_SECRET no está definido en las variables de entorno')
  }

  try {
    const decoded = jwt.verify(token, secret, {
      algorithms: ['HS256']
    }) as TokenPayload

    return decoded
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token expirado')
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Token inválido')
    } else {
      throw new Error('Error al verificar el token')
    }
  }
}

/**
 * Verifica y decodifica un refresh token
 * @param token - Refresh token a verificar
 * @returns Payload decodificado del refresh token
 */
export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const secret = process.env.REFRESH_TOKEN_SECRET

  if (!secret) {
    throw new Error('REFRESH_TOKEN_SECRET no está definido en las variables de entorno')
  }

  try {
    const decoded = jwt.verify(token, secret, {
      algorithms: ['HS256']
    }) as RefreshTokenPayload

    return decoded
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Refresh token expirado')
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Refresh token inválido')
    } else {
      throw new Error('Error al verificar el refresh token')
    }
  }
}

/**
 * Extrae el token del header Authorization
 * @param authHeader - Header de autorización
 * @returns Token extraído o null
 */
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader) {
    return null
  }

  // Formato esperado: "Bearer <token>"
  const parts = authHeader.split(' ')

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null
  }

  return parts[1]
}

/**
 * Genera tanto access token como refresh token
 * @param userId - ID del usuario
 * @param email - Email del usuario
 * @param role - Rol del usuario
 * @returns Objeto con ambos tokens
 */
export function generateTokenPair(userId: string, email: string, role: UserRole) {
  const accessToken = generateAccessToken({ userId, email, role })
  const refreshToken = generateRefreshToken({ userId })

  return {
    accessToken,
    refreshToken
  }
}
