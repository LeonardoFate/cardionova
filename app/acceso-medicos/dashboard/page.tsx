// app/acceso-medicos/dashboard/page.tsx - ACTUALIZADO

'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LogOut, User, Calendar, FileText, Users, BarChart3, Stethoscope, ClipboardList } from 'lucide-react'

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/acceso-medicos')
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#1e3a8a]"></div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  const handleLogout = async () => {
    await logout()
    router.push('/acceso-medicos')
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800'
      case 'SECRETARIA':
        return 'bg-blue-100 text-blue-800'
      case 'MEDICO':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1e3a8a]">
              Dashboard - Cardionova
            </h1>
            <p className="text-gray-600 mt-1">
              Bienvenido/a, {user.firstName} {user.lastName}
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Cerrar Sesión</span>
          </Button>
        </div>

        {/* User Info Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Información del Usuario</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Nombre Completo</p>
                <p className="font-medium">{user.firstName} {user.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Rol</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                  {getRoleDisplayName(user.role)}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Último acceso</p>
                <p className="font-medium">
                  {user.lastLogin
                    ? new Date(user.lastLogin).toLocaleString('es-ES')
                    : 'Primer acceso'
                  }
                </p>
              </div>
              {user.profile.speciality && (
                <div>
                  <p className="text-sm text-gray-500">Especialidad</p>
                  <p className="font-medium">{user.profile.speciality}</p>
                </div>
              )}
              {user.profile.licenseNumber && (
                <div>
                  <p className="text-sm text-gray-500">Número de Senecyt</p>
                  <p className="font-medium">{user.profile.licenseNumber}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Role-specific content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {user.role === 'ADMIN' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>Gestión de Usuarios</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Administrar médicos, secretarias y otros usuarios del sistema.
                  </p>
                  <Link href="/acceso-medicos/dashboard/usuarios">
                    <Button className="w-full">Gestionar Usuarios</Button>
                  </Link>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span>Historias Clínicas</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Ver y administrar todas las historias clínicas del sistema.
                  </p>
                  <Link href="/acceso-medicos/dashboard/historia-clinica">
                    <Button className="w-full">Ver Historiales</Button>
                  </Link>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4" />
                    <span>Reportes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Ver estadísticas y reportes del centro médico.
                  </p>
                  <Link href="/acceso-medicos/dashboard/reportes">
                    <Button className="w-full" variant="outline">Ver Reportes</Button>
                  </Link>
                </CardContent>
              </Card>
            </>
          )}

          {user.role === 'SECRETARIA' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Gestión de Citas</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Programar, modificar y cancelar citas de pacientes.
                  </p>
                  <Button className="w-full">Gestionar Citas</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>Pacientes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Administrar información de pacientes.
                  </p>
                  <Button className="w-full" variant="outline">Ver Pacientes</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span>Historias Clínicas</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Ver historias clínicas de pacientes (solo lectura).
                  </p>
                  <Link href="/acceso-medicos/dashboard/historia-clinica">
                    <Button className="w-full" variant="outline">Ver Historiales</Button>
                  </Link>
                </CardContent>
              </Card>
            </>
          )}

          {user.role === 'MEDICO' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Mis Citas</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Ver y gestionar sus citas programadas.
                  </p>
                  <Button className="w-full">Ver Mis Citas</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span>Historia Clínica</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Crear y gestionar historias clínicas de pacientes.
                  </p>
                  <Link href="/acceso-medicos/dashboard/historia-clinica">
                    <Button className="w-full bg-cardionova-red hover:bg-cardionova-darkred">
                      Gestionar Historiales
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ClipboardList className="h-4 w-4" />
                    <span>Mis Pacientes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Ver lista de pacientes atendidos y sus historiales.
                  </p>
                  <Button className="w-full" variant="outline">Ver Pacientes</Button>
                </CardContent>
              </Card>
            </>
          )}

          {/* Card común para todos los roles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Mi Perfil</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Actualizar información personal y configuración.
              </p>
              <Button className="w-full" variant="outline">Editar Perfil</Button>
            </CardContent>
          </Card>
        </div>

        {/* Información adicional para médicos */}
        {user.role === 'MEDICO' && (
          <div className="mt-8">
            <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-blue-800">
                  <Stethoscope className="h-5 w-5" />
                  <span>Portal Médico - Cardionova</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-blue-700 mb-2">Funcionalidades Disponibles:</h4>
                    <ul className="text-sm text-blue-600 space-y-1">
                      <li>• Crear y editar historias clínicas completas</li>
                      <li>• Calculadora automática de IMC</li>
                      <li>• Plantillas predefinidas para examen físico</li>
                      <li>• Códigos CIE-10 más utilizados</li>
                      <li>• Gestión de medicamentos y tratamientos</li>
                      <li>• Seguimiento de pacientes por cédula</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-700 mb-2">Próximamente:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Gestión de citas médicas</li>
                      <li>• Alertas de seguimiento de pacientes</li>
                      <li>• Generación automática de recetas</li>
                      <li>• Integración con estudios médicos</li>
                      <li>• Reportes estadísticos personalizados</li>
                      <li>• Recordatorios de control médico</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <Link href="/acceso-medicos/dashboard/historia-clinica">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      <FileText className="mr-2 h-4 w-4" />
                      Comenzar con Historia Clínica
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
