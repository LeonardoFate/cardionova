// components/historia-clinica/HistoriaClinicaList.tsx

'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Loader2,
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Eye,
  FileText,
  Filter,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  Stethoscope
} from 'lucide-react'
import { IHistoriaClinicaResponse } from '@/types/historia-clinica'
import { useHistoriaClinica } from '@/hooks/useHistoriaClinica'
import { useAuth } from '@/contexts/AuthContext'

interface HistoriaClinicaListProps {
  onCreateHistoria: () => void
  onEditHistoria: (historia: IHistoriaClinicaResponse) => void
  onViewHistoria: (historia: IHistoriaClinicaResponse) => void
}

export function HistoriaClinicaList({
  onCreateHistoria,
  onEditHistoria,
  onViewHistoria
}: HistoriaClinicaListProps) {
  const { user } = useAuth()
  const {
    getHistorias,
    isLoading,
    error,
    clearError
  } = useHistoriaClinica()

  // Estado para la lista de historias y paginación
  const [historias, setHistorias] = useState<IHistoriaClinicaResponse[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  // Estado para filtros
  const [filters, setFilters] = useState<{
    search: string
    cedula: string
    fechaDesde: string
    fechaHasta: string
  }>({
    search: '',
    cedula: '',
    fechaDesde: '',
    fechaHasta: ''
  })

  // Cargar historias clínicas
  const loadHistorias = async () => {
    const query = {
      page: pagination.page,
      limit: pagination.limit,
      ...(filters.search && { search: filters.search }),
      ...(filters.cedula && { cedula: filters.cedula }),
      ...(filters.fechaDesde && { fechaDesde: new Date(filters.fechaDesde) }),
      ...(filters.fechaHasta && { fechaHasta: new Date(filters.fechaHasta) })
    }

    const result = await getHistorias(query)

    if (result) {
      setHistorias(result.historias)
      setPagination(result.pagination)
    }
  }

  // Cargar historias al montar y cuando cambien los filtros
  useEffect(() => {
    loadHistorias()
  }, [pagination.page, pagination.limit])

  // Cargar historias al montar el componente
  useEffect(() => {
    loadHistorias()
  }, [])

  // Aplicar filtros
  const applyFilters = () => {
    setPagination(prev => ({ ...prev, page: 1 }))
    loadHistorias()
  }

  // Limpiar filtros
  const clearFilters = () => {
    setFilters({
      search: '',
      cedula: '',
      fechaDesde: '',
      fechaHasta: ''
    })
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  // Manejar cambio de página
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  // Formatear fecha para mostrar
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Calcular edad a partir de fecha de nacimiento aproximada
  const calcularEdadAproximada = (edad: number) => {
    return `${edad} años`
  }

  return (
    <div className="space-y-6">
      {/* Header con título y botón crear */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-cardionova-blue">Historias Clínicas</h2>
          <p className="text-gray-600">
            {user?.role === 'MEDICO'
              ? 'Gestione las historias clínicas de sus pacientes'
              : 'Administre todas las historias clínicas del sistema'
            }
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={loadHistorias}
            variant="outline"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              'Recargar'
            )}
          </Button>
          {user?.role === 'MEDICO' && (
            <Button
              onClick={onCreateHistoria}
              className="bg-cardionova-red hover:bg-cardionova-darkred"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nueva Historia
            </Button>
          )}
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            Filtros de Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  id="search"
                  placeholder="Nombre o motivo..."
                  className="pl-8"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cedula">Cédula</Label>
              <Input
                id="cedula"
                placeholder="Número de cédula"
                value={filters.cedula}
                onChange={(e) => setFilters(prev => ({ ...prev, cedula: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fechaDesde">Fecha Desde</Label>
              <Input
                id="fechaDesde"
                type="date"
                value={filters.fechaDesde}
                onChange={(e) => setFilters(prev => ({ ...prev, fechaDesde: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fechaHasta">Fecha Hasta</Label>
              <Input
                id="fechaHasta"
                type="date"
                value={filters.fechaHasta}
                onChange={(e) => setFilters(prev => ({ ...prev, fechaHasta: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <Button
              onClick={applyFilters}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Aplicar Filtros'
              )}
            </Button>
            <Button
              variant="outline"
              onClick={clearFilters}
              disabled={isLoading}
            >
              Limpiar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mostrar errores */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Tabla de historias clínicas */}
      <Card>
        <CardHeader>
          <CardTitle>
            Historias Clínicas ({pagination.total})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && historias.length === 0 ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : historias.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No se encontraron historias clínicas</p>
              <p className="text-sm">
                {user?.role === 'MEDICO'
                  ? 'Comience creando su primera historia clínica'
                  : 'No hay historias clínicas en el sistema'
                }
              </p>
              {user?.role === 'MEDICO' && (
                <Button
                  onClick={onCreateHistoria}
                  className="mt-4 bg-cardionova-red hover:bg-cardionova-darkred"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Primera Historia
                </Button>
              )}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Cédula</TableHead>
                    <TableHead>Edad</TableHead>
                    <TableHead>Motivo de Consulta</TableHead>
                    <TableHead>CIE-10</TableHead>
                    {user?.role === 'ADMIN' && <TableHead>Médico</TableHead>}
                    <TableHead className="w-[50px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historias.map((historia) => (
                    <TableRow key={historia._id}>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          {formatDate(historia.fecha.toString())}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{historia.paciente.nombre}</div>
                          <div className="text-sm text-gray-500">{historia.paciente.tipoSeguro}</div>
                        </div>
                      </TableCell>
                      <TableCell>{historia.paciente.cedula}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {calcularEdadAproximada(historia.datosBiometricos.edad)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate" title={historia.motivoConsulta}>
                          {historia.motivoConsulta}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {historia.cie10.split(' - ')[0]}
                        </Badge>
                      </TableCell>
                      {user?.role === 'ADMIN' && (
                        <TableCell>
                          <div className="flex items-center">
                            <Stethoscope className="h-4 w-4 mr-2 text-gray-400" />
                            <div>
                              <div className="text-sm font-medium">
                                Dr. {historia.medico.firstName} {historia.medico.lastName}
                              </div>
                              <div className="text-xs text-gray-500">
                                {historia.medico.profile.speciality}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      )}
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => onViewHistoria(historia)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Ver Detalles
                            </DropdownMenuItem>
                            {user?.role === 'MEDICO' && (
                              <DropdownMenuItem
                                onClick={() => onEditHistoria(historia)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Paginación */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-600">
                    Mostrando {((pagination.page - 1) * pagination.limit) + 1} a{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} de{' '}
                    {pagination.total} historias clínicas
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1 || isLoading}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="flex items-center px-3 text-sm">
                      Página {pagination.page} de {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages || isLoading}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
