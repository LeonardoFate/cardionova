// components/admin/UserForm.tsx

'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { UserRole, IUserResponse } from '@/types/user'
import { useUsers } from '@/hooks/useUsers'

// Esquema de validación para el formulario
const userFormSchema = z.object({
  email: z.string().email('Email inválido').toLowerCase(),
  firstName: z.string().min(2, 'Mínimo 2 caracteres').max(50, 'Máximo 50 caracteres'),
  lastName: z.string().min(2, 'Mínimo 2 caracteres').max(50, 'Máximo 50 caracteres'),
  role: z.nativeEnum(UserRole, { required_error: 'Seleccione un rol' }),
  password: z.string().min(8, 'Mínimo 8 caracteres').optional(),
  confirmPassword: z.string().optional(),
  phone: z.string().optional(),
  speciality: z.string().optional(),
  licenseNumber: z.string().optional(),
  department: z.string().optional(),
}).refine((data) => {
  // Solo validar contraseñas si estamos creando un usuario nuevo
  if (data.password || data.confirmPassword) {
    return data.password === data.confirmPassword
  }
  return true
}, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword']
}).refine((data) => {
  // Validar campos requeridos para médicos
  if (data.role === UserRole.MEDICO) {
    return data.speciality && data.licenseNumber
  }
  return true
}, {
  message: 'Especialidad y número de licencia son requeridos para médicos',
  path: ['speciality']
})

type UserFormData = z.infer<typeof userFormSchema>

interface UserFormProps {
  user?: IUserResponse // Si se pasa, es edición; si no, es creación
  onSuccess: (user: IUserResponse) => void
  onCancel: () => void
}

export function UserForm({ user, onSuccess, onCancel }: UserFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { createUser, updateUser, isLoading, error, clearError } = useUsers()

  const isEditing = !!user

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: user?.email || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      role: user?.role || UserRole.MEDICO,
      password: '',
      confirmPassword: '',
      phone: user?.profile?.phone || '',
      speciality: user?.profile?.speciality || '',
      licenseNumber: user?.profile?.licenseNumber || '',
      department: user?.profile?.department || '',
    }
  })

  const { register, handleSubmit, watch, setValue, formState: { errors } } = form
  const watchedRole = watch('role')

  // Limpiar errores cuando se monta el componente
  useEffect(() => {
    clearError()
  }, [clearError])

  // Limpiar campos específicos de médico cuando se cambia el rol
  useEffect(() => {
    if (watchedRole !== UserRole.MEDICO) {
      setValue('speciality', '')
      setValue('licenseNumber', '')
    }
  }, [watchedRole, setValue])

  const onSubmit = async (data: UserFormData) => {
    try {
      clearError()

      if (isEditing) {
        // Actualizar usuario existente
        const updateData = {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role,
          profile: {
            phone: data.phone,
            speciality: data.speciality,
            licenseNumber: data.licenseNumber,
            department: data.department,
          }
        }

        const updatedUser = await updateUser(user._id, updateData)
        if (updatedUser) {
          onSuccess(updatedUser)
        }
      } else {
        // Crear nuevo usuario
        if (!data.password) {
          form.setError('password', { message: 'La contraseña es requerida' })
          return
        }

        const createData = {
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword || '',
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role,
          profile: {
            phone: data.phone,
            speciality: data.speciality,
            licenseNumber: data.licenseNumber,
            department: data.department,
          }
        }

        const newUser = await createUser(createData)
        if (newUser) {
          onSuccess(newUser)
        }
      }
    } catch (error) {
      console.error('Error en formulario:', error)
    }
  }

  const getRoleDisplayName = (role: UserRole) => {
    const roleNames = {
      [UserRole.ADMIN]: 'Administrador',
      [UserRole.SECRETARIA]: 'Secretaria',
      [UserRole.MEDICO]: 'Médico'
    }
    return roleNames[role]
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Mostrar errores de la API */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Información Básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información Básica</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nombre *</Label>
                <Input
                  id="firstName"
                  {...register('firstName')}
                  placeholder="Ingrese el nombre"
                />
                {errors.firstName && (
                  <p className="text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Apellido *</Label>
                <Input
                  id="lastName"
                  {...register('lastName')}
                  placeholder="Ingrese el apellido"
                />
                {errors.lastName && (
                  <p className="text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="usuario@cardionova.com"
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Rol *</Label>
              <Select
                onValueChange={(value) => setValue('role', value as UserRole)}
                defaultValue={watch('role')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserRole.MEDICO}>
                    {getRoleDisplayName(UserRole.MEDICO)}
                  </SelectItem>
                  <SelectItem value={UserRole.SECRETARIA}>
                    {getRoleDisplayName(UserRole.SECRETARIA)}
                  </SelectItem>
                  <SelectItem value={UserRole.ADMIN}>
                    {getRoleDisplayName(UserRole.ADMIN)}
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-red-600">{errors.role.message}</p>
              )}
            </div>
          </div>

          {/* Contraseña (solo para creación o cambio) */}
          {!isEditing && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Credenciales</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      {...register('password')}
                      placeholder="Mínimo 8 caracteres"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...register('confirmPassword')}
                      placeholder="Repita la contraseña"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Información Adicional */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información Adicional</h3>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                {...register('phone')}
                placeholder="+54 11 4567-8900"
              />
              {errors.phone && (
                <p className="text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Departamento</Label>
              <Input
                id="department"
                {...register('department')}
                placeholder="Ej: Cardiología, Administración"
              />
              {errors.department && (
                <p className="text-sm text-red-600">{errors.department.message}</p>
              )}
            </div>

            {/* Campos específicos para médicos */}
            {watchedRole === UserRole.MEDICO && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="speciality">Especialidad *</Label>
                  <Input
                    id="speciality"
                    {...register('speciality')}
                    placeholder="Ej: Cardiología Clínica, Electrofisiología"
                  />
                  {errors.speciality && (
                    <p className="text-sm text-red-600">{errors.speciality.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">Número de Licencia *</Label>
                  <Input
                    id="licenseNumber"
                    {...register('licenseNumber')}
                    placeholder="Ej: MN-12345"
                  />
                  {errors.licenseNumber && (
                    <p className="text-sm text-red-600">{errors.licenseNumber.message}</p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
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
                  {isEditing ? 'Actualizando...' : 'Creando...'}
                </>
              ) : (
                <>
                  {isEditing ? 'Actualizar Usuario' : 'Crear Usuario'}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
