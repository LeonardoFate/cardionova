// components/auth/LoginForm.tsx

'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { LockKeyhole, Eye, EyeOff, Loader2, Mail } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors([])
    setIsSubmitting(true)

    // Validaciones básicas del frontend
    const newErrors: string[] = []

    if (!email) {
      newErrors.push('El email es requerido')
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.push('El email no es válido')
    }

    if (!password) {
      newErrors.push('La contraseña es requerida')
    }

    if (newErrors.length > 0) {
      setErrors(newErrors)
      setIsSubmitting(false)
      return
    }

    // Intentar login
    try {
      const result = await login(email, password)

      if (result.success) {
        // Redirigir al dashboard
        router.push('/acceso-medicos/dashboard')
        router.refresh()
      } else {
        setErrors([result.message])
      }
    } catch (error) {
      setErrors(['Error de conexión. Inténtelo de nuevo.'])
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full py-12 md:py-24 lg:py-32 bg-white">
      <div className="container px-4 md:px-6 max-w-md">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl text-[#1e3a8a]">
              Acceso Médicos
            </h1>
            <p className="text-gray-600">
              Portal exclusivo para profesionales de Cardionova
            </p>
          </div>
        </div>
        <div className="text-center mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
            <strong>¿No eres personal médico?</strong>
            </p>
            <p className="text-sm text-blue-600 mt-1">
            <Link href="/" className="hover:underline font-medium">
                Volver a la página principal
            </Link>
            {' '}o{' '}
            <Link href="/contacto" className="hover:underline font-medium">
                agenda tu cita como paciente
            </Link>
            </p>
        </div>
        </div>
        <Card className="border-gray-200">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-2">
              <LockKeyhole className="h-12 w-12 text-[#e11d48]" />
            </div>
            <CardTitle className="text-2xl text-center text-[#1e3a8a]">
              Iniciar Sesión
            </CardTitle>
            <CardDescription className="text-center">
              Ingrese sus credenciales para acceder al sistema
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {/* Mostrar errores */}
              {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <ul className="text-sm text-red-600 space-y-1">
                    {errors.map((error, index) => (
                      <li key={index} className="flex items-center">
                        <span className="mr-2">•</span>
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Campo Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="doctor@cardionova.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={isSubmitting}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Campo Contraseña */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium">
                    Contraseña
                  </label>
                  <button
                    type="button"
                    className="text-sm text-[#e11d48] hover:underline"
                    onClick={() => {
                      // TODO: Implement forgot password
                      alert('Función próximamente disponible')
                    }}
                  >
                    ¿Olvidó su contraseña?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                    disabled={isSubmitting}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-[#e11d48] hover:bg-[#be123c] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  'Ingresar'
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Información para desarrollo
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg border">
            <h3 className="font-medium text-gray-700 mb-2">
              Usuarios de prueba:
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Admin:</strong> admin@cardionova.com / Admin123!</p>
              <p><strong>Secretaria:</strong> secretaria@cardionova.com / Secretaria123!</p>
              <p><strong>Médico:</strong> dr.rodriguez@cardionova.com / Doctor123!</p>

            </div>
          </div>

        )} */}

      </div>
    </div>

  )

}
