// app/acceso-medicos/dashboard/historia-clinica/page.tsx

'use client'

import { useState } from 'react'
import { useAuth, isAdmin, isDoctor, isSecretary } from '@/contexts/AuthContext'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { HistoriaClinicaList } from '@/components/historia-clinica/HistoriaClinicaList'
import { HistoriaClinicaForm } from '@/components/historia-clinica/HistoriaClinicaForm'
import { IHistoriaClinicaResponse } from '@/types/historia-clinica'
import { IPacienteResponse } from '@/types/paciente'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, FileText, Stethoscope } from 'lucide-react'

type ViewMode = 'list' | 'create' | 'edit' | 'view'

export default function HistoriaClinicaPage() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const pacienteId = searchParams.get('paciente')

  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedHistoria, setSelectedHistoria] = useState<IHistoriaClinicaResponse | undefined>()
  const [selectedPaciente, setSelectedPaciente] = useState<IPacienteResponse | undefined>()
  const [showDialog, setShowDialog] = useState(false)

  // Verificar autenticación y permisos
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || (!isDoctor(user) && !isAdmin(user) && !isSecretary(user)))) {
      router.push('/acceso-medicos')
    }
  }, [isLoading, isAuthenticated, user, router])

  // Cargar datos del paciente si viene el ID en la URL
  useEffect(() => {
    const loadPaciente = async () => {
      if (pacienteId && isAuthenticated) {
        try {
          const response = await fetch(`/api/pacientes/${pacienteId}`)
          const data = await response.json()

          if (data.success && data.paciente) {
            setSelectedPaciente(data.paciente)
            setViewMode('create')
            setShowDialog(true)
          } else {
            console.error('Error al cargar paciente:', data.message)
          }
        } catch (error) {
          console.error('Error cargando paciente:', error)
        }
      }
    }

    loadPaciente()
  }, [pacienteId, isAuthenticated])

  // Mostrar loading mientras verifica autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#1e3a8a]"></div>
      </div>
    )
  }

  // Verificar permisos
  if (!isAuthenticated || (!isDoctor(user) && !isAdmin(user) && !isSecretary(user))) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Alert className="max-w-md" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No tienes permisos para acceder a esta página.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Handlers para las acciones
  const handleCreateHistoria = () => {
    setSelectedHistoria(undefined)
    setViewMode('create')
    setShowDialog(true)
  }

  const handleEditHistoria = (historia: IHistoriaClinicaResponse) => {
    setSelectedHistoria(historia)
    setViewMode('edit')
    setShowDialog(true)
  }

  const handleViewHistoria = (historia: IHistoriaClinicaResponse) => {
    setSelectedHistoria(historia)
    setViewMode('view')
    setShowDialog(true)
  }

  const handleCloseDialog = () => {
    setShowDialog(false)
    setViewMode('list')
    setSelectedHistoria(undefined)
    setSelectedPaciente(undefined)
    // Limpiar el query param de la URL
    if (pacienteId) {
      router.push('/acceso-medicos/dashboard/historia-clinica')
    }
  }

  const handleHistoriaSuccess = (historia: IHistoriaClinicaResponse) => {
    handleCloseDialog()
    // La lista se actualizará automáticamente al refrescar
  }

  const getDialogTitle = () => {
    switch (viewMode) {
      case 'create':
        return 'Nueva Historia Clínica'
      case 'edit':
        return 'Editar Historia Clínica'
      case 'view':
        return 'Ver Historia Clínica'
      default:
        return 'Historia Clínica'
    }
  }

  const getDialogDescription = () => {
    switch (viewMode) {
      case 'create':
        if (selectedPaciente) {
          return `Creando historia clínica para: ${selectedPaciente.nombre} ${selectedPaciente.apellido} (${selectedPaciente.cedula})`
        }
        return 'Complete todos los campos requeridos para crear una nueva historia clínica.'
      case 'edit':
        return `Editando historia clínica de ${selectedHistoria?.paciente.nombre || ''}`
      case 'view':
        return `Historia clínica de ${selectedHistoria?.paciente.nombre || ''} - ${selectedHistoria ? new Date(selectedHistoria.fecha).toLocaleDateString('es-ES') : ''}`
      default:
        return ''
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header de la página */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-cardionova-red/10 p-2 rounded-lg">
              <FileText className="h-6 w-6 text-cardionova-red" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-cardionova-blue">
                Historia Clínica
              </h1>
              <p className="text-gray-600">
                {isDoctor(user)
                  ? 'Gestione las historias clínicas de sus pacientes'
                  : 'Administre todas las historias clínicas del sistema'
                }
              </p>
            </div>
          </div>

          {/* Información adicional para médicos */}
          {isDoctor(user) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <div className="flex items-start space-x-3">
                <Stethoscope className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Información importante:</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Complete todos los campos obligatorios de la historia clínica.
                    El IMC se calcula automáticamente a partir del peso y estatura.
                    Recuerde actualizar los signos vitales y tratamientos en cada consulta.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mostrar lista de historias clínicas */}
        <HistoriaClinicaList
          onCreateHistoria={handleCreateHistoria}
          onEditHistoria={handleEditHistoria}
          onViewHistoria={handleViewHistoria}
        />

        {/* Dialog para crear/editar/ver historia clínica */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-cardionova-red" />
                <span>{getDialogTitle()}</span>
              </DialogTitle>
              {getDialogDescription() && (
                <p className="text-sm text-gray-600 mt-2">
                  {getDialogDescription()}
                </p>
              )}
            </DialogHeader>

            {/* Mostrar formulario solo si es crear o editar */}
            {(viewMode === 'create' || viewMode === 'edit') && (
              <HistoriaClinicaForm
                historia={selectedHistoria}
                paciente={selectedPaciente}
                onSuccess={handleHistoriaSuccess}
                onCancel={handleCloseDialog}
              />
            )}

            {/* Mostrar vista detallada solo si es view */}
            {viewMode === 'view' && selectedHistoria && (
              <HistoriaClinicaDetailView
                historia={selectedHistoria}
                onEdit={() => {
                  setViewMode('edit')
                }}
                onClose={handleCloseDialog}
                canEdit={isDoctor(user)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

// Componente para mostrar los detalles de la historia clínica (solo lectura)
interface HistoriaClinicaDetailViewProps {
  historia: IHistoriaClinicaResponse
  onEdit: () => void
  onClose: () => void
  canEdit: boolean
}

function HistoriaClinicaDetailView({
  historia,
  onEdit,
  onClose,
  canEdit
}: HistoriaClinicaDetailViewProps) {
  return (
    <div className="space-y-6">
      {/* Botones de acción */}
      <div className="flex justify-end space-x-2">
        {canEdit && (
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-cardionova-red text-white rounded hover:bg-cardionova-darkred transition-colors"
          >
            Editar Historia
          </button>
        )}
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
        >
          Cerrar
        </button>
      </div>

      {/* Datos del paciente */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-cardionova-blue mb-4">Datos del Paciente</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">Fecha</p>
            <p className="font-medium">{new Date(historia.fecha).toLocaleDateString('es-ES')}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Nombre</p>
            <p className="font-medium">{historia.paciente.nombre}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Cédula</p>
            <p className="font-medium">{historia.paciente.cedula}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Seguro</p>
            <p className="font-medium">{historia.paciente.tipoSeguro}</p>
          </div>
        </div>
      </div>

      {/* Datos biométricos y signos vitales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-cardionova-blue mb-4">Datos Biométricos</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Edad</p>
              <p className="font-medium">{historia.datosBiometricos.edad} años</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Peso</p>
              <p className="font-medium">{historia.datosBiometricos.peso} kg</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Estatura</p>
              <p className="font-medium">{historia.datosBiometricos.estatura} cm</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">IMC</p>
              <p className="font-medium">{historia.datosBiometricos.imc}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-cardionova-blue mb-4">Signos Vitales</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Presión Arterial</p>
              <p className="font-medium">{historia.signosVitales.presionArterial}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Frecuencia Cardíaca</p>
              <p className="font-medium">{historia.signosVitales.frecuenciaCardiaca} lpm</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Sat O2</p>
              <p className="font-medium">{historia.signosVitales.satO2}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Temperatura</p>
              <p className="font-medium">{historia.signosVitales.temperatura}°C</p>
            </div>
          </div>
        </div>
      </div>

      {/* Información clínica */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-cardionova-blue mb-4">Información Clínica</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Motivo de Consulta</p>
            <p className="mt-1">{historia.motivoConsulta}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">CIE-10</p>
            <p className="mt-1 font-medium">{historia.cie10}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Enfermedad Actual</p>
              <p className="mt-1">{historia.enfermedadActual}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Evolución de la Enfermedad</p>
              <p className="mt-1">{historia.evolucionEnfermedad}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Plan y tratamiento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-cardionova-blue mb-4">Plan de Tratamiento</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Dieta</p>
              <p className="mt-1">{historia.plan.dieta}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Actividad Física</p>
              <p className="mt-1">{historia.plan.actividadFisica}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pautas de Alarma</p>
              <p className="mt-1">{historia.plan.pautasAlarma}</p>
            </div>
            {historia.plan.tiempoControl && (
              <div>
                <p className="text-sm text-gray-500">Próximo Control</p>
                <p className="mt-1 font-medium">
                  {new Date(historia.plan.tiempoControl).toLocaleDateString('es-ES')}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-cardionova-blue mb-4">Tratamiento</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Medicamentos</p>
              {historia.tratamiento.medicamentos.length > 0 ? (
                <ul className="mt-1 space-y-1">
                  {historia.tratamiento.medicamentos.map((med, index) => (
                    <li key={index} className="text-sm">• {med}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-gray-400">No se indicaron medicamentos</p>
              )}
            </div>
            {historia.tratamiento.observaciones && (
              <div>
                <p className="text-sm text-gray-500">Observaciones</p>
                <p className="mt-1">{historia.tratamiento.observaciones}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Información del médico */}
      <div className="bg-gray-50 p-4 rounded-lg border">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Médico:</span> Dr. {historia.medico.firstName} {historia.medico.lastName}
          {historia.medico.profile.speciality && (
            <span className="ml-2">({historia.medico.profile.speciality})</span>
          )}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Creado: {new Date(historia.createdAt).toLocaleString('es-ES')}
          {historia.updatedAt !== historia.createdAt && (
            <span className="ml-4">
              Última actualización: {new Date(historia.updatedAt).toLocaleString('es-ES')}
            </span>
          )}
        </p>
      </div>
    </div>
  )
}
