// app/acceso-medicos/dashboard/pacientes/page.tsx
'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { usePacientes } from '@/hooks/usePacientes'
import { PacienteForm } from '@/components/pacientes/PacienteForm'
import { Plus, Search, UserPlus, Clock, CheckCircle, XCircle } from 'lucide-react'
import { EstadoPaciente } from '@/types/paciente'

export default function PacientesPage() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const { pacientes, isLoading, fetchPacientes, updatePaciente } = usePacientes()
  const [showForm, setShowForm] = useState(false)
  const [medicos, setMedicos] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEstado, setSelectedEstado] = useState<EstadoPaciente | ''>('')

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/acceso-medicos')
    }
  }, [authLoading, isAuthenticated, router])

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  const loadData = async () => {
    try {
      // Cargar pacientes
      const params: any = {}
      if (user?.role === 'MEDICO') {
        params.medicoId = user._id
      }
      if (selectedEstado) {
        params.estado = selectedEstado
      }
      if (searchTerm) {
        params.search = searchTerm
      }
      await fetchPacientes(params)

      // Cargar médicos si es secretaria o admin
      if (user?.role === 'SECRETARIA' || user?.role === 'ADMIN') {
        const response = await fetch('/api/users?role=MEDICO&limit=100&isActive=true')
        const data = await response.json()

        if (data.success && data.users) {
          setMedicos(data.users)
        } else {
          console.error('Error al cargar médicos:', data.message)
        }
      }
    } catch (error) {
      console.error('Error en loadData:', error)
    }
  }

  const handleSearch = () => {
    loadData()
  }

  const handleEstadoChange = async (pacienteId: string, nuevoEstado: EstadoPaciente) => {
    await updatePaciente(pacienteId, { estado: nuevoEstado })
    loadData()
  }

  const getEstadoBadge = (estado: EstadoPaciente) => {
    const config = {
      [EstadoPaciente.EN_ESPERA]: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'En Espera' },
      [EstadoPaciente.EN_CONSULTA]: { color: 'bg-blue-100 text-blue-800', icon: UserPlus, label: 'En Consulta' },
      [EstadoPaciente.ATENDIDO]: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Atendido' },
      [EstadoPaciente.CANCELADO]: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Cancelado' }
    }
    const { color, icon: Icon, label } = config[estado]
    return (
      <Badge className={color}>
        <Icon className="h-3 w-3 mr-1" />
        {label}
      </Badge>
    )
  }

  if (authLoading || !user) {
    return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#1e3a8a]"></div></div>
  }

  if (showForm && (user.role === 'SECRETARIA' || user.role === 'ADMIN')) {
    return (
      <div className="container mx-auto px-4 py-8">
        <PacienteForm
          medicos={medicos}
          onSuccess={() => {
            setShowForm(false)
            loadData()
          }}
          onCancel={() => setShowForm(false)}
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1e3a8a]">
            {user.role === 'MEDICO' ? 'Mis Pacientes' : 'Gestión de Pacientes'}
          </h1>
          <p className="text-gray-600 mt-1">
            {user.role === 'MEDICO' ? 'Pacientes asignados a tu consulta' : 'Registro y seguimiento de pacientes'}
          </p>
        </div>
        {(user.role === 'SECRETARIA' || user.role === 'ADMIN') && (
          <Button onClick={() => setShowForm(true)} className="bg-cardionova-red hover:bg-cardionova-darkred">
            <Plus className="h-4 w-4 mr-2" />
            Registrar Paciente
          </Button>
        )}
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por nombre, apellido o cédula..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <select
              className="border rounded px-3 py-2"
              value={selectedEstado}
              onChange={(e) => setSelectedEstado(e.target.value as EstadoPaciente | '')}
            >
              <option value="">Todos los estados</option>
              {Object.values(EstadoPaciente).map((estado) => (
                <option key={estado} value={estado}>{estado.replace('_', ' ')}</option>
              ))}
            </select>
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#1e3a8a]"></div>
        </div>
      ) : pacientes.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            No hay pacientes registrados
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {pacientes.map((paciente) => (
            <Card key={paciente._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{paciente.nombre} {paciente.apellido}</CardTitle>
                    <p className="text-sm text-gray-600">Cédula: {paciente.cedula}</p>
                  </div>
                  {getEstadoBadge(paciente.estado)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Edad</p>
                    <p className="font-medium">{paciente.edad} años</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Teléfono</p>
                    <p className="font-medium">{paciente.telefono}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Seguro</p>
                    <p className="font-medium">{paciente.tipoSeguro}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Médico</p>
                    <p className="font-medium">
                      Dr. {paciente.medicoAsignado.firstName} {paciente.medicoAsignado.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Hora de llegada</p>
                    <p className="font-medium">{new Date(paciente.horaLlegada).toLocaleTimeString('es-ES')}</p>
                  </div>
                </div>
                {user.role === 'MEDICO' && paciente.estado === EstadoPaciente.EN_ESPERA && (
                  <div className="mt-4 flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleEstadoChange(paciente._id, EstadoPaciente.EN_CONSULTA)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Iniciar Consulta
                    </Button>
                  </div>
                )}
                {user.role === 'MEDICO' && paciente.estado === EstadoPaciente.EN_CONSULTA && (
                  <div className="mt-4 flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => router.push(`/acceso-medicos/dashboard/historia-clinica?paciente=${paciente._id}`)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Crear Historia Clínica
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/acceso-medicos/dashboard/estudios?pacienteId=${paciente._id}`)}
                    >
                      Ver Estudios
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEstadoChange(paciente._id, EstadoPaciente.ATENDIDO)}
                    >
                      Marcar como Atendido
                    </Button>
                  </div>
                )}
                {paciente.estado === EstadoPaciente.ATENDIDO && (
                  <div className="mt-4 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/acceso-medicos/dashboard/estudios?pacienteId=${paciente._id}`)}
                    >
                      Ver Estudios
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
