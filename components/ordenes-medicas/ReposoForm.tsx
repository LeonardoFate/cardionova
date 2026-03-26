'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Save } from 'lucide-react'
import { reposoSchema } from '@/lib/db/validations/orden-medica'
import { TipoReposo } from '@/types/orden-medica'
import { toast } from 'sonner'
import type { z } from 'zod'

type ReposoFormData = z.infer<typeof reposoSchema>

interface ReposoFormProps {
  historiaId: string
  onSuccess: (historia: any) => void
}

export function ReposoForm({ historiaId, onSuccess }: ReposoFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ReposoFormData>({
    resolver: zodResolver(reposoSchema),
    defaultValues: {
      tipo: TipoReposo.LABORAL,
      dias: 7,
      desde: new Date(),
      hasta: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      diagnostico: '',
      recomendaciones: ''
    }
  })

  const dias = form.watch('dias')
  const desde = form.watch('desde')

  // Auto-calcular fecha hasta basado en días
  useEffect(() => {
    if (dias && desde) {
      const desdeDate = new Date(desde)
      const hastaDate = new Date(desdeDate.getTime() + (dias - 1) * 24 * 60 * 60 * 1000)
      form.setValue('hasta', hastaDate)
    }
  }, [dias, desde, form])

  const onSubmit = async (data: ReposoFormData) => {
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

      // Agregar nuevo reposo
      const ordenesMedicas = historia.ordenesMedicas || { recetas: [], estudios: [], reposos: [], interconsultas: [] }
      ordenesMedicas.reposos = [...(ordenesMedicas.reposos || []), data]

      // Actualizar historia
      const response = await fetch(`/api/historia-clinica/${historiaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ordenesMedicas })
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Constancia de reposo creada exitosamente')
        onSuccess(result.historia)
        form.reset()
      } else {
        toast.error(result.message || 'Error al crear constancia de reposo')
      }
    } catch (error) {
      toast.error('Error al crear constancia de reposo')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tipo de Reposo *</Label>
          <Select
            defaultValue={TipoReposo.LABORAL}
            onValueChange={(value) => form.setValue('tipo', value as TipoReposo)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(TipoReposo).map(tipo => (
                <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Duración (días) *</Label>
          <Input
            type="number"
            {...form.register('dias', { valueAsNumber: true })}
            min={1}
            max={365}
            placeholder="Ej: 7"
          />
          {form.formState.errors.dias && (
            <p className="text-sm text-red-600">{form.formState.errors.dias.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Fecha Desde *</Label>
          <Input
            type="date"
            {...form.register('desde', {
              setValueAs: (value) => value ? new Date(value) : new Date()
            })}
          />
          {form.formState.errors.desde && (
            <p className="text-sm text-red-600">{form.formState.errors.desde.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Fecha Hasta *</Label>
          <Input
            type="date"
            value={form.watch('hasta') ? new Date(form.watch('hasta')).toISOString().split('T')[0] : ''}
            readOnly
            className="bg-gray-50"
          />
          <p className="text-xs text-gray-500">Calculado automáticamente según los días</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Diagnóstico *</Label>
        <Textarea
          {...form.register('diagnostico')}
          rows={3}
          placeholder="Diagnóstico que justifica el reposo..."
        />
        {form.formState.errors.diagnostico && (
          <p className="text-sm text-red-600">{form.formState.errors.diagnostico.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Recomendaciones</Label>
        <Textarea
          {...form.register('recomendaciones')}
          rows={3}
          placeholder="Recomendaciones adicionales durante el reposo..."
        />
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
              Guardar Constancia
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
