// app/acceso-medicos/dashboard/perfil/page.tsx
'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, User, Mail, Phone, Building, Stethoscope, IdCard, Save, Eye, EyeOff } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const perfilFormSchema = z.object({
  firstName: z.string().min(2, 'Mínimo 2 caracteres'),
  lastName: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  department: z.string().optional(),
  speciality: z.string().optional(),
  licenseNumber: z.string().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8, 'Mínimo 8 caracteres').optional().or(z.literal('')),
  confirmPassword: z.string().optional()
}).refine((data) => {
  if (data.newPassword || data.confirmPassword) {
    return data.newPassword === data.confirmPassword
  }
  return true
}, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword']
})

type PerfilFormData = z.infer<typeof perfilFormSchema>

export default function PerfilPage() {
  const { user, isLoading: authLoading, isAuthenticated, refreshUser } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useForm<PerfilFormData>({
    resolver: zodResolver(perfilFormSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.profile?.phone || '',
      department: user?.profile?.department || '',
      speciality: user?.profile?.speciality || '',
      licenseNumber: user?.profile?.licenseNumber || ''
    }
  })

  const { register, handleSubmit, formState: { errors }, reset } = form

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/acceso-medicos')
    }
    // Solo ADMIN puede acceder a esta página
    if (!authLoading && isAuthenticated && user && user.role !== 'ADMIN') {
      router.push('/acceso-medicos/dashboard')
    }
  }, [authLoading, isAuthenticated, user, router])

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.profile?.phone || '',
        department: user.profile?.department || '',
        speciality: user.profile?.speciality || '',
        licenseNumber: user.profile?.licenseNumber || ''
      })
    }
  }, [user, reset])

  const onSubmit = async (data: PerfilFormData) => {
    try {
      setIsLoading(true)
      setError(null)
      setSuccess(null)

      const updateData: any = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        profile: {
          phone: data.phone,
          department: data.department,
          speciality: data.speciality,
          licenseNumber: data.licenseNumber
        }
      }

      // Si se proporciona nueva contraseña, agregarla
      if (data.newPassword && data.currentPassword) {
        updateData.currentPassword = data.currentPassword
        updateData.password = data.newPassword
        updateData.confirmPassword = data.confirmPassword
      }

      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Error al actualizar perfil')
      }

      setSuccess('Perfil actualizado correctamente')

      // Refrescar datos del usuario
      if (refreshUser) {
        await refreshUser()
      }

      // Limpiar campos de contraseña
      reset({
        ...data,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#1e3a8a]"></div>
      </div>
    )
  }

  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      'ADMIN': 'Administrador',
      'SECRETARIA': 'Secretaria',
      'MEDICO': 'Médico'
    }
    return roleNames[role as keyof typeof roleNames] || role
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1e3a8a]">Mi Perfil</h1>
          <p className="text-gray-600 mt-1">Administra tu información personal y configuración</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          {/* Información de la Cuenta */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Información de la Cuenta</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre *</Label>
                  <Input id="firstName" {...register('firstName')} />
                  {errors.firstName && <p className="text-sm text-red-600">{errors.firstName.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido *</Label>
                  <Input id="lastName" {...register('lastName')} />
                  {errors.lastName && <p className="text-sm text-red-600">{errors.lastName.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" {...register('email')} />
                  {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Rol</Label>
                  <Input value={getRoleDisplayName(user.role)} disabled />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información Adicional */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>Información Adicional</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" {...register('phone')} placeholder="+593 99 123 4567" />
                  {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Departamento</Label>
                  <Input id="department" {...register('department')} placeholder="Ej: Cardiología" />
                  {errors.department && <p className="text-sm text-red-600">{errors.department.message}</p>}
                </div>

                {user.role === 'MEDICO' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="speciality">Especialidad</Label>
                      <Input id="speciality" {...register('speciality')} placeholder="Ej: Cardiología Clínica" />
                      {errors.speciality && <p className="text-sm text-red-600">{errors.speciality.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="licenseNumber">Número de Registro</Label>
                      <Input id="licenseNumber" {...register('licenseNumber')} placeholder="Ej: MSP-12345" />
                      {errors.licenseNumber && <p className="text-sm text-red-600">{errors.licenseNumber.message}</p>}
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Cambiar Contraseña */}
          <Card>
            <CardHeader>
              <CardTitle>Cambiar Contraseña</CardTitle>
              <p className="text-sm text-gray-600">Deja estos campos vacíos si no deseas cambiar tu contraseña</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Contraseña Actual</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    {...register('currentPassword')}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.currentPassword && <p className="text-sm text-red-600">{errors.currentPassword.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nueva Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      {...register('newPassword')}
                      placeholder="Mínimo 8 caracteres"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.newPassword && <p className="text-sm text-red-600">{errors.newPassword.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...register('confirmPassword')}
                      placeholder="Repetir contraseña"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botones de Acción */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/acceso-medicos/dashboard')}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-cardionova-red hover:bg-cardionova-darkred"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Cambios
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
