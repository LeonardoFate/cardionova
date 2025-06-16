// app/acceso-medicos/dashboard/reportes/page.tsx

'use client'

import { useAuth, isAdmin } from '@/contexts/AuthContext'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, BarChart3, Users, Calendar, TrendingUp, Activity, FileText } from 'lucide-react'

export default function ReportesPage() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  // Verificar autenticación y permisos
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin(user))) {
      router.push('/acceso-medicos')
    }
  }, [isLoading, isAuthenticated, user, router])

  // Mostrar loading mientras verifica autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#1e3a8a]"></div>
      </div>
    )
  }

  // Verificar permisos
  if (!isAuthenticated || !isAdmin(user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Alert className="max-w-md" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No tienes permisos para acceder a esta página. Solo los administradores pueden ver reportes.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Datos simulados para mostrar
  const statsData = [
    {
      title: "Total Usuarios",
      value: "6",
      change: "+2 este mes",
      icon: <Users className="h-8 w-8 text-blue-600" />,
      color: "bg-blue-50"
    },
    {
      title: "Médicos Activos",
      value: "4",
      change: "+1 este mes",
      icon: <Activity className="h-8 w-8 text-green-600" />,
      color: "bg-green-50"
    },
    {
      title: "Citas del Mes",
      value: "124",
      change: "+15%",
      icon: <Calendar className="h-8 w-8 text-purple-600" />,
      color: "bg-purple-50"
    },
    {
      title: "Tasa de Ocupación",
      value: "87%",
      change: "+3%",
      icon: <TrendingUp className="h-8 w-8 text-orange-600" />,
      color: "bg-orange-50"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1e3a8a] mb-2">
            Reportes y Estadísticas
          </h1>
          <p className="text-gray-600">
            Dashboard con métricas y reportes del centro médico
          </p>
        </div>

        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <Card key={index} className="border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Secciones de reportes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Reportes de usuarios */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Reportes de Usuarios</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Médicos registrados</span>
                  <span className="text-sm text-blue-600 font-bold">4</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Secretarias activas</span>
                  <span className="text-sm text-blue-600 font-bold">1</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Administradores</span>
                  <span className="text-sm text-blue-600 font-bold">1</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Próximas funcionalidades */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Próximas Funcionalidades</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-600">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-sm">Reportes de citas médicas</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-sm">Estadísticas de pacientes</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-sm">Reportes financieros</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-sm">Análisis de ocupación</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-sm">Exportación de datos</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mensaje informativo */}
        <div className="mt-8">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Esta es una versión inicial del módulo de reportes. Las funcionalidades completas de análisis de citas,
              pacientes y métricas avanzadas estarán disponibles en próximas versiones.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  )
}
