'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2, Save } from 'lucide-react'
import { estudioOrdenSchema } from '@/lib/db/validations/orden-medica'
import { TipoEstudioOrden, ESTUDIOS_LABORATORIO, ESTUDIOS_IMAGEN, ESTUDIOS_ELECTRODIAGNOSTICO, ESTUDIOS_PROCEDIMIENTO } from '@/types/orden-medica'
import { toast } from 'sonner'
import type { z } from 'zod'

type EstudioFormData = z.infer<typeof estudioOrdenSchema>

interface EstudioOrdenFormProps {
  historiaId: string
  onSuccess: (historia: any) => void
}

export function EstudioOrdenForm({ historiaId, onSuccess }: EstudioOrdenFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [tipoEstudio, setTipoEstudio] = useState<TipoEstudioOrden>(TipoEstudioOrden.LABORATORIO)

  const form = useForm<EstudioFormData>({
    resolver: zodResolver(estudioOrdenSchema),
    defaultValues: {
      tipo: TipoEstudioOrden.LABORATORIO,
      nombre: '',
      justificacion: '',
      urgente: false,
      ayunas: false,
      preparacion: '',
      indicaciones: ''
    }
  })

  const onSubmit = async (data: EstudioFormData) => {
    setIsLoading(true)
    try {
      // Obtener historia actual
      const getRes = await fetch(`/api/historia-clinica/${historiaId}`)
      const getData = await getRes.json()

      if (!getData.success) {
        toast.error('No se pudo obtener la historia clínica')
        return
      }

      const historia = getData.historia

      // Agregar nuevo estudio
      const ordenesMedicas = historia.ordenesMedicas || { recetas: [], estudios: [], reposos: [], interconsultas: [] }
      ordenesMedicas.estudios = [...(ordenesMedicas.estudios || []), data]

      // Actualizar historia
      const response = await fetch(`/api/historia-clinica/${historiaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ordenesMedicas })
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Orden de estudio creada exitosamente')
        onSuccess(result.historia)
        form.reset()
      } else {
        toast.error(result.message || 'Error al crear orden de estudio')
      }
    } catch (error) {
      toast.error('Error al crear orden de estudio')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const getEstudiosDisponibles = () => {
    switch (tipoEstudio) {
      case TipoEstudioOrden.LABORATORIO:
        return ESTUDIOS_LABORATORIO
      case TipoEstudioOrden.IMAGEN:
        return ESTUDIOS_IMAGEN
      case TipoEstudioOrden.ELECTRODIAGNOSTICO:
        return ESTUDIOS_ELECTRODIAGNOSTICO
      case TipoEstudioOrden.PROCEDIMIENTO:
        return ESTUDIOS_PROCEDIMIENTO
      default:
        return []
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tipo de Estudio *</Label>
          <Select
            defaultValue={TipoEstudioOrden.LABORATORIO}
            onValueChange={(value) => {
              const tipo = value as TipoEstudioOrden
              setTipoEstudio(tipo)
              form.setValue('tipo', tipo)
              form.setValue('nombre', '')
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(TipoEstudioOrden).map(tipo => (
                <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Nombre del Estudio *</Label>
          <Select onValueChange={(value) => form.setValue('nombre', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione un estudio" />
            </SelectTrigger>
            <SelectContent>
              {getEstudiosDisponibles().map(estudio => (
                <SelectItem key={estudio} value={estudio}>{estudio}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.nombre && (
            <p className="text-sm text-red-600">{form.formState.errors.nombre.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Justificación Clínica *</Label>
        <Textarea
          {...form.register('justificacion')}
          rows={3}
          placeholder="Explique la razón médica para solicitar este estudio..."
        />
        {form.formState.errors.justificacion && (
          <p className="text-sm text-red-600">{form.formState.errors.justificacion.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Preparación del Paciente</Label>
        <Textarea
          {...form.register('preparacion')}
          rows={2}
          placeholder="Instrucciones de preparación antes del estudio..."
        />
      </div>

      <div className="space-y-2">
        <Label>Indicaciones Adicionales</Label>
        <Textarea
          {...form.register('indicaciones')}
          rows={2}
          placeholder="Indicaciones específicas para el laboratorio..."
        />
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="urgente"
            checked={form.watch('urgente')}
            onCheckedChange={(checked) => form.setValue('urgente', !!checked)}
          />
          <Label htmlFor="urgente" className="text-sm cursor-pointer">
            Estudio URGENTE
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="ayunas"
            checked={form.watch('ayunas')}
            onCheckedChange={(checked) => form.setValue('ayunas', !!checked)}
          />
          <Label htmlFor="ayunas" className="text-sm cursor-pointer">
            Requiere ayunas
          </Label>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={isLoading} className="bg-cardionova-red hover:bg-cardionova-darkred">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Guardar Orden
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
