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
import { interconsultaSchema } from '@/lib/db/validations/orden-medica'
import { EspecialidadInterconsulta } from '@/types/orden-medica'
import { toast } from 'sonner'
import type { z } from 'zod'

type InterconsultaFormData = z.infer<typeof interconsultaSchema>

interface InterconsultaFormProps {
  historiaId: string
  onSuccess: (historia: any) => void
}

export function InterconsultaForm({ historiaId, onSuccess }: InterconsultaFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<InterconsultaFormData>({
    resolver: zodResolver(interconsultaSchema),
    defaultValues: {
      especialidad: EspecialidadInterconsulta.MEDICINA_INTERNA,
      profesionalSolicitado: '',
      motivo: '',
      antecedentes: '',
      examenesRealizados: '',
      diagnosticoPresuntivo: '',
      urgente: false
    }
  })

  const onSubmit = async (data: InterconsultaFormData) => {
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

      // Agregar nueva interconsulta
      const ordenesMedicas = historia.ordenesMedicas || { recetas: [], estudios: [], reposos: [], interconsultas: [] }
      ordenesMedicas.interconsultas = [...(ordenesMedicas.interconsultas || []), data]

      // Actualizar historia
      const response = await fetch(`/api/historia-clinica/${historiaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ordenesMedicas })
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Solicitud de interconsulta creada exitosamente')
        onSuccess(result.historia)
        form.reset()
      } else {
        toast.error(result.message || 'Error al crear solicitud de interconsulta')
      }
    } catch (error) {
      toast.error('Error al crear solicitud de interconsulta')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Especialidad Solicitada *</Label>
          <Select
            defaultValue={EspecialidadInterconsulta.MEDICINA_INTERNA}
            onValueChange={(value) => form.setValue('especialidad', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(EspecialidadInterconsulta).map(especialidad => (
                <SelectItem key={especialidad} value={especialidad}>{especialidad}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.especialidad && (
            <p className="text-sm text-red-600">{form.formState.errors.especialidad.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Profesional Solicitado (Opcional)</Label>
          <Input {...form.register('profesionalSolicitado')} placeholder="Dr/a. Nombre del profesional" />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="urgente-inter"
          checked={form.watch('urgente')}
          onCheckedChange={(checked) => form.setValue('urgente', !!checked)}
        />
        <Label htmlFor="urgente-inter" className="text-sm cursor-pointer font-semibold text-red-600">
          INTERCONSULTA URGENTE
        </Label>
      </div>

      <div className="space-y-2">
        <Label>Motivo de Interconsulta *</Label>
        <Textarea
          {...form.register('motivo')}
          rows={3}
          placeholder="Razón por la que se solicita la interconsulta..."
        />
        {form.formState.errors.motivo && (
          <p className="text-sm text-red-600">{form.formState.errors.motivo.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Diagnóstico Presuntivo *</Label>
        <Textarea
          {...form.register('diagnosticoPresuntivo')}
          rows={2}
          placeholder="Diagnóstico preliminar..."
        />
        {form.formState.errors.diagnosticoPresuntivo && (
          <p className="text-sm text-red-600">{form.formState.errors.diagnosticoPresuntivo.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Antecedentes Relevantes *</Label>
        <Textarea
          {...form.register('antecedentes')}
          rows={3}
          placeholder="Antecedentes médicos relevantes para la interconsulta..."
        />
        {form.formState.errors.antecedentes && (
          <p className="text-sm text-red-600">{form.formState.errors.antecedentes.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Exámenes Realizados</Label>
        <Textarea
          {...form.register('examenesRealizados')}
          rows={3}
          placeholder="Estudios y exámenes ya realizados al paciente..."
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
              Guardar Solicitud
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
