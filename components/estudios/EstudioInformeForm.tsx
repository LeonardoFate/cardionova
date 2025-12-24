// components/estudios/EstudioInformeForm.tsx

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
import { Loader2, Save, X } from 'lucide-react'
import { IEstudioResponse, EstadoEstudio } from '@/types/estudio'

const informeSchema = z.object({
  estado: z.nativeEnum(EstadoEstudio),
  fechaRealizacion: z.string().optional(),
  informe: z.string().min(10, 'El informe debe tener al menos 10 caracteres'),
  hallazgos: z.string().optional(),
  conclusion: z.string().min(10, 'La conclusión debe tener al menos 10 caracteres'),
  recomendaciones: z.string().optional()
})

type InformeFormData = z.infer<typeof informeSchema>

interface EstudioInformeFormProps {
  estudio: IEstudioResponse
  onSuccess: () => void
  onCancel: () => void
}

export function EstudioInformeForm({ estudio, onSuccess, onCancel }: EstudioInformeFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<InformeFormData>({
    resolver: zodResolver(informeSchema),
    defaultValues: {
      estado: estudio.estado || EstadoEstudio.EN_PROCESO,
      fechaRealizacion: estudio.fechaRealizacion
        ? new Date(estudio.fechaRealizacion).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      informe: estudio.informe || '',
      hallazgos: estudio.hallazgos || '',
      conclusion: estudio.conclusion || '',
      recomendaciones: estudio.recomendaciones || ''
    }
  })

  const { register, handleSubmit, formState: { errors }, watch, setValue } = form

  const onSubmit = async (data: InformeFormData) => {
    try {
      setIsLoading(true)
      setError(null)

      const updateData = {
        ...data,
        fechaRealizacion: data.fechaRealizacion ? new Date(data.fechaRealizacion) : new Date()
      }

      const response = await fetch(`/api/estudios/${estudio._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Error al guardar informe')
      }

      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Información del paciente y estudio */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-[#1e3a8a] mb-2">Información del Estudio</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Paciente</p>
            <p className="font-medium">{estudio.pacienteNombre}</p>
          </div>
          <div>
            <p className="text-gray-500">Cédula</p>
            <p className="font-medium">{estudio.pacienteCedula}</p>
          </div>
          <div>
            <p className="text-gray-500">Tipo de Estudio</p>
            <p className="font-medium">{estudio.tipoEstudio.replace(/_/g, ' ')}</p>
          </div>
          <div>
            <p className="text-gray-500">Fecha Solicitud</p>
            <p className="font-medium">
              {new Date(estudio.fechaSolicitud).toLocaleDateString('es-ES')}
            </p>
          </div>
        </div>
      </div>

      {/* Formulario del informe */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="estado">Estado del Estudio *</Label>
          <Select
            value={watch('estado')}
            onValueChange={(value) => setValue('estado', value as EstadoEstudio)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={EstadoEstudio.PENDIENTE}>Pendiente</SelectItem>
              <SelectItem value={EstadoEstudio.EN_PROCESO}>En Proceso</SelectItem>
              <SelectItem value={EstadoEstudio.COMPLETADO}>Completado</SelectItem>
              <SelectItem value={EstadoEstudio.CANCELADO}>Cancelado</SelectItem>
            </SelectContent>
          </Select>
          {errors.estado && (
            <p className="text-sm text-red-600">{errors.estado.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="fechaRealizacion">Fecha de Realización</Label>
          <Input
            id="fechaRealizacion"
            type="date"
            {...register('fechaRealizacion')}
          />
          {errors.fechaRealizacion && (
            <p className="text-sm text-red-600">{errors.fechaRealizacion.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="informe">Informe Detallado *</Label>
        <Textarea
          id="informe"
          {...register('informe')}
          rows={6}
          placeholder="Descripción detallada del procedimiento realizado, condiciones del estudio, etc."
        />
        {errors.informe && (
          <p className="text-sm text-red-600">{errors.informe.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="hallazgos">Hallazgos</Label>
        <Textarea
          id="hallazgos"
          {...register('hallazgos')}
          rows={4}
          placeholder="Principales hallazgos encontrados durante el estudio..."
        />
        {errors.hallazgos && (
          <p className="text-sm text-red-600">{errors.hallazgos.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="conclusion">Conclusión *</Label>
        <Textarea
          id="conclusion"
          {...register('conclusion')}
          rows={4}
          placeholder="Conclusión médica del estudio realizado..."
        />
        {errors.conclusion && (
          <p className="text-sm text-red-600">{errors.conclusion.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="recomendaciones">Recomendaciones</Label>
        <Textarea
          id="recomendaciones"
          {...register('recomendaciones')}
          rows={3}
          placeholder="Recomendaciones para el paciente o médico tratante..."
        />
        {errors.recomendaciones && (
          <p className="text-sm text-red-600">{errors.recomendaciones.message}</p>
        )}
      </div>

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
              Guardando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Guardar Informe
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
