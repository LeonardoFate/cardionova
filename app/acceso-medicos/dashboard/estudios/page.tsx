// app/acceso-medicos/dashboard/estudios/page.tsx

'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FileText, Plus, Search, FileDown, Edit, Calendar } from 'lucide-react'
import { IEstudioResponse, TipoEstudio, EstadoEstudio } from '@/types/estudio'
import { EstudioInformeForm } from '@/components/estudios/EstudioInformeForm'
import { EstudioPDFUpload } from '@/components/estudios/EstudioPDFUpload'
import { NuevoEstudioForm } from '@/components/estudios/NuevoEstudioForm'

export default function EstudiosPage() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const pacienteIdParam = searchParams.get('pacienteId')
  const [estudios, setEstudios] = useState<IEstudioResponse[]>([])
  const [filteredEstudios, setFilteredEstudios] = useState<IEstudioResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEstado, setFilterEstado] = useState<string>('TODOS')
  const [filterTipo, setFilterTipo] = useState<string>('TODOS')

  // Estados para diálogos
  const [showNuevoDialog, setShowNuevoDialog] = useState(false)
  const [showInformeDialog, setShowInformeDialog] = useState(false)
  const [showPDFDialog, setShowPDFDialog] = useState(false)
  const [selectedEstudio, setSelectedEstudio] = useState<IEstudioResponse | null>(null)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/acceso-medicos')
    }
  }, [authLoading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated) {
      loadEstudios()
    }
  }, [isAuthenticated])

  useEffect(() => {
    filterEstudiosData()
  }, [estudios, searchTerm, filterEstado, filterTipo])

  const loadEstudios = async () => {
    try {
      setIsLoading(true)
      const url = pacienteIdParam
        ? `/api/estudios?pacienteId=${pacienteIdParam}`
        : '/api/estudios'
      const response = await fetch(url)
      const data = await response.json()

      if (data.success) {
        setEstudios(data.estudios || [])
      }
    } catch (error) {
      console.error('Error cargando estudios:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterEstudiosData = () => {
    let filtered = [...estudios]

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(estudio =>
        estudio.pacienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        estudio.pacienteCedula.includes(searchTerm)
      )
    }

    // Filtrar por estado
    if (filterEstado !== 'TODOS') {
      filtered = filtered.filter(estudio => estudio.estado === filterEstado)
    }

    // Filtrar por tipo
    if (filterTipo !== 'TODOS') {
      filtered = filtered.filter(estudio => estudio.tipoEstudio === filterTipo)
    }

    setFilteredEstudios(filtered)
  }

  const getEstadoBadge = (estado: EstadoEstudio) => {
    const badges = {
      [EstadoEstudio.PENDIENTE]: 'bg-yellow-100 text-yellow-800',
      [EstadoEstudio.EN_PROCESO]: 'bg-blue-100 text-blue-800',
      [EstadoEstudio.COMPLETADO]: 'bg-green-100 text-green-800',
      [EstadoEstudio.CANCELADO]: 'bg-red-100 text-red-800'
    }
    return badges[estado] || 'bg-gray-100 text-gray-800'
  }

  const getTipoEstudioLabel = (tipo: TipoEstudio) => {
    const labels = {
      [TipoEstudio.ELECTROCARDIOGRAMA]: 'Electrocardiograma',
      [TipoEstudio.ECOCARDIOGRAMA]: 'Ecocardiograma',
      [TipoEstudio.HOLTER_RITMO]: 'Holter de Ritmo',
      [TipoEstudio.HOLTER_PRESION]: 'Holter de Presión',
      [TipoEstudio.PRUEBA_ESFUERZO]: 'Prueba de Esfuerzo',
      [TipoEstudio.MONITOREO_AMBULATORIO]: 'Monitoreo Ambulatorio',
      [TipoEstudio.OTRO]: 'Otro'
    }
    return labels[tipo] || tipo
  }

  const handleOpenInforme = (estudio: IEstudioResponse) => {
    setSelectedEstudio(estudio)
    setShowInformeDialog(true)
  }

  const handleOpenPDF = (estudio: IEstudioResponse) => {
    setSelectedEstudio(estudio)
    setShowPDFDialog(true)
  }

  const handleCloseDialogs = () => {
    setShowInformeDialog(false)
    setShowPDFDialog(false)
    setShowNuevoDialog(false)
    setSelectedEstudio(null)
    loadEstudios()
  }

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#1e3a8a]"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-[#1e3a8a]">Estudios y Procedimientos</h1>
            <p className="text-gray-600 mt-1">Gestión de estudios cardiológicos de pacientes</p>
          </div>
          {(user.role === 'MEDICO' || user.role === 'ADMIN') && (
            <Button
              onClick={() => setShowNuevoDialog(true)}
              className="bg-cardionova-red hover:bg-cardionova-darkred"
            >
              <Plus className="mr-2 h-4 w-4" />
              Solicitar Estudio
            </Button>
          )}
        </div>

        {/* Filtros y búsqueda */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar paciente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterEstado} onValueChange={setFilterEstado}>
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODOS">Todos los estados</SelectItem>
                  <SelectItem value={EstadoEstudio.PENDIENTE}>Pendiente</SelectItem>
                  <SelectItem value={EstadoEstudio.EN_PROCESO}>En Proceso</SelectItem>
                  <SelectItem value={EstadoEstudio.COMPLETADO}>Completado</SelectItem>
                  <SelectItem value={EstadoEstudio.CANCELADO}>Cancelado</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterTipo} onValueChange={setFilterTipo}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de estudio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODOS">Todos los tipos</SelectItem>
                  <SelectItem value={TipoEstudio.ELECTROCARDIOGRAMA}>Electrocardiograma</SelectItem>
                  <SelectItem value={TipoEstudio.ECOCARDIOGRAMA}>Ecocardiograma</SelectItem>
                  <SelectItem value={TipoEstudio.HOLTER_RITMO}>Holter de Ritmo</SelectItem>
                  <SelectItem value={TipoEstudio.HOLTER_PRESION}>Holter de Presión</SelectItem>
                  <SelectItem value={TipoEstudio.PRUEBA_ESFUERZO}>Prueba de Esfuerzo</SelectItem>
                  <SelectItem value={TipoEstudio.MONITOREO_AMBULATORIO}>Monitoreo Ambulatorio</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center text-sm text-gray-600">
                Total: <span className="font-bold ml-1">{filteredEstudios.length}</span> estudios
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de estudios */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e3a8a]"></div>
        </div>
      ) : filteredEstudios.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600">No se encontraron estudios</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredEstudios.map((estudio) => (
            <Card key={estudio._id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-[#1e3a8a]">
                        {estudio.pacienteNombre}
                      </h3>
                      <Badge className={getEstadoBadge(estudio.estado)}>
                        {estudio.estado}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Cédula</p>
                        <p className="font-medium">{estudio.pacienteCedula}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Tipo de Estudio</p>
                        <p className="font-medium">{getTipoEstudioLabel(estudio.tipoEstudio)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Médico Solicitante</p>
                        <p className="font-medium">Dr. {estudio.medicoSolicitante}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Fecha Solicitud</p>
                        <p className="font-medium flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(estudio.fechaSolicitud).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    </div>
                    {estudio.observaciones && (
                      <p className="text-sm text-gray-600 mt-3 italic">
                        {estudio.observaciones}
                      </p>
                    )}
                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                      <FileDown className="h-3 w-3" />
                      <span>{estudio.archivosPDF.length} archivo(s) PDF</span>
                      {estudio.informe && (
                        <>
                          <span className="mx-1">•</span>
                          <FileText className="h-3 w-3" />
                          <span>Informe completado</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenInforme(estudio)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      {estudio.informe ? 'Ver Informe' : 'Llenar Informe'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenPDF(estudio)}
                    >
                      <FileDown className="mr-2 h-4 w-4" />
                      Cargar PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog para nuevo estudio */}
      <Dialog open={showNuevoDialog} onOpenChange={setShowNuevoDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Solicitar Nuevo Estudio</DialogTitle>
          </DialogHeader>
          <NuevoEstudioForm onSuccess={handleCloseDialogs} onCancel={handleCloseDialogs} />
        </DialogContent>
      </Dialog>

      {/* Dialog para llenar informe */}
      <Dialog open={showInformeDialog} onOpenChange={setShowInformeDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedEstudio?.informe ? 'Ver/Editar Informe' : 'Llenar Informe del Estudio'}
            </DialogTitle>
          </DialogHeader>
          {selectedEstudio && (
            <EstudioInformeForm
              estudio={selectedEstudio}
              onSuccess={handleCloseDialogs}
              onCancel={handleCloseDialogs}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog para cargar PDFs */}
      <Dialog open={showPDFDialog} onOpenChange={setShowPDFDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Cargar Archivos PDF</DialogTitle>
          </DialogHeader>
          {selectedEstudio && (
            <EstudioPDFUpload
              estudio={selectedEstudio}
              onSuccess={handleCloseDialogs}
              onCancel={handleCloseDialogs}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
