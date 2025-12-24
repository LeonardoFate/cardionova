// components/estudios/NuevoEstudioForm.tsx

'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Save, X, Search } from 'lucide-react'
import { TipoEstudio } from '@/types/estudio'
import { IPacienteResponse } from '@/types/paciente'

const nuevoEstudioSchema = z.object({
  pacienteId: z.string().min(1, 'Debe seleccionar un paciente'),
  tipoEstudio: z.nativeEnum(TipoEstudio),
  observaciones: z.string().optional()
})

type NuevoEstudioFormData = z.infer<typeof nuevoEstudioSchema>

interface NuevoEstudioFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export function NuevoEstudioForm({ onSuccess, onCancel }: NuevoEstudioFormProps) {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pacientes, setPacientes] = useState<IPacienteResponse[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPaciente, setSelectedPaciente] = useState<IPacienteResponse | null>(null)

  const form = useForm<NuevoEstudioFormData>({
    resolver: zodResolver(nuevoEstudioSchema),
    defaultValues: {
      pacienteId: '',
      tipoEstudio: TipoEstudio.ELECTROCARDIOGRAMA,
      observaciones: ''
    }
  })

  const { register, handleSubmit, formState: { errors }, setValue, watch } = form

  useEffect(() => {
    loadPacientes()
  }, [])

  const loadPacientes = async () => {
    try {
      const response = await fetch('/api/pacientes')
      const data = await response.json()
      if (data.success) {
        setPacientes(data.pacientes || [])
      }
    } catch (error) {
      console.error('Error cargando pacientes:', error)
    }
  }

  const filteredPacientes = pacientes.filter(p =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.cedula.includes(searchTerm)
  )

  const handleSelectPaciente = (paciente: IPacienteResponse) => {
    setSelectedPaciente(paciente)
    setValue('pacienteId', paciente._id)
    setSearchTerm('')
  }

  const onSubmit = async (data: NuevoEstudioFormData) => {
    try {
      if (!user || !selectedPaciente) {
        setError('Información incompleta')
        return
      }

      setIsLoading(true)
      setError(null)

      const nuevoEstudio = {
        pacienteId: data.pacienteId,
        pacienteNombre: `${selectedPaciente.nombre} ${selectedPaciente.apellido}`,
        pacienteCedula: selectedPaciente.cedula,
        tipoEstudio: data.tipoEstudio,
        medicoSolicitante: `${user.firstName} ${user.lastName}`,
        medicoSolicitanteId: user._id,
        observaciones: data.observaciones
      }

      const response = await fetch('/api/estudios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoEstudio)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Error al crear estudio')
      }

      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setIsLoading(false)
    }
  }

  const getTipoEstudioLabel = (tipo: TipoEstudio) => {
    const labels = {
      [TipoEstudio.ELECTROCARDIOGRAMA]: 'Electrocardiograma (ECG)',
      [TipoEstudio.ECOCARDIOGRAMA]: 'Ecocardiograma',
      [TipoEstudio.HOLTER_RITMO]: 'Holter de Ritmo (24h)',
      [TipoEstudio.HOLTER_PRESION]: 'Holter de Presión Arterial (MAPA)',
      [TipoEstudio.PRUEBA_ESFUERZO]: 'Prueba de Esfuerzo',
      [TipoEstudio.MONITOREO_AMBULATORIO]: 'Monitoreo Ambulatorio',
      [TipoEstudio.OTRO]: 'Otro Estudio'
    }
    return labels[tipo] || tipo
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Selección de paciente */}
      <div className="space-y-2">
        <Label>Paciente *</Label>
        {selectedPaciente ? (
          <div className="p-4 bg-gray-50 rounded-lg border">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-[#1e3a8a]">
                  {selectedPaciente.nombre} {selectedPaciente.apellido}
                </p>
                <p className="text-sm text-gray-600">CI: {selectedPaciente.cedula}</p>
                <p className="text-sm text-gray-600">
                  {selectedPaciente.edad} años • {selectedPaciente.tipoSeguro}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedPaciente(null)
                  setValue('pacienteId', '')
                }}
              >
                Cambiar
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar paciente por nombre o cédula..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            {searchTerm && filteredPacientes.length > 0 && (
              <div className="border rounded-lg max-h-60 overflow-y-auto">
                {filteredPacientes.map((paciente) => (
                  <button
                    key={paciente._id}
                    type="button"
                    onClick={() => handleSelectPaciente(paciente)}
                    className="w-full text-left p-3 hover:bg-gray-50 border-b last:border-b-0"
                  >
                    <p className="font-medium">
                      {paciente.nombre} {paciente.apellido}
                    </p>
                    <p className="text-sm text-gray-600">
                      CI: {paciente.cedula} • {paciente.edad} años
                    </p>
                  </button>
                ))}
              </div>
            )}
            {searchTerm && filteredPacientes.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No se encontraron pacientes
              </p>
            )}
          </div>
        )}
        {errors.pacienteId && (
          <p className="text-sm text-red-600">{errors.pacienteId.message}</p>
        )}
      </div>

      {/* Tipo de estudio */}
      <div className="space-y-2">
        <Label htmlFor="tipoEstudio">Tipo de Estudio *</Label>
        <Select
          value={watch('tipoEstudio')}
          onValueChange={(value) => setValue('tipoEstudio', value as TipoEstudio)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.values(TipoEstudio).map((tipo) => (
              <SelectItem key={tipo} value={tipo}>
                {getTipoEstudioLabel(tipo)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.tipoEstudio && (
          <p className="text-sm text-red-600">{errors.tipoEstudio.message}</p>
        )}
      </div>

      {/* Observaciones */}
      <div className="space-y-2">
        <Label htmlFor="observaciones">Observaciones / Motivo del Estudio</Label>
        <Textarea
          id="observaciones"
          {...register('observaciones')}
          rows={4}
          placeholder="Indique el motivo del estudio, síntomas del paciente, o cualquier información relevante..."
        />
        {errors.observaciones && (
          <p className="text-sm text-red-600">{errors.observaciones.message}</p>
        )}
      </div>

      {/* Información adicional */}
      <Alert>
        <AlertDescription className="text-sm">
          <strong>Información:</strong> Una vez creada la solicitud del estudio, podrá llenar
          el informe y cargar los archivos PDF correspondientes desde la lista de estudios.
        </AlertDescription>
      </Alert>

      {/* Botones de acción */}
      <div className="flex justify-end space-x-4 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          <X className="mr-2 h-4 w-4" />
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
              Creando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Crear Solicitud
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
