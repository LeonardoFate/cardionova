'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Plus, X, Loader2, Save } from 'lucide-react'
import { recetaSchema } from '@/lib/db/validations/orden-medica'
import { ViaAdministracion, PRESENTACIONES_MEDICAMENTO, FRECUENCIAS_COMUNES } from '@/types/orden-medica'
import { toast } from 'sonner'
import type { z } from 'zod'

type RecetaFormData = z.infer<typeof recetaSchema>

interface RecetaFormProps {
  historiaId: string
  onSuccess: (historia: any) => void
}

export function RecetaForm({ historiaId, onSuccess }: RecetaFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<RecetaFormData>({
    resolver: zodResolver(recetaSchema),
    defaultValues: {
      medicamentos: [{
        nombre: '',
        concentracion: '',
        presentacion: '',
        cantidad: '',
        dosificacion: '',
        frecuencia: '',
        duracion: '',
        viaAdministracion: ViaAdministracion.ORAL,
        indicaciones: ''
      }],
      observaciones: '',
      vigencia: '30 días'
    }
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'medicamentos'
  })

  const onSubmit = async (data: RecetaFormData) => {
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

      // Agregar nueva receta
      const ordenesMedicas = historia.ordenesMedicas || { recetas: [], estudios: [], reposos: [], interconsultas: [] }
      ordenesMedicas.recetas = [...(ordenesMedicas.recetas || []), data]

      // Actualizar historia
      const response = await fetch(`/api/historia-clinica/${historiaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ordenesMedicas })
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Receta creada exitosamente')
        onSuccess(result.historia)
        form.reset()
      } else {
        toast.error(result.message || 'Error al crear receta')
      }
    } catch (error) {
      toast.error('Error al crear receta')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-lg font-semibold">Medicamentos</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({
              nombre: '',
              concentracion: '',
              presentacion: '',
              cantidad: '',
              dosificacion: '',
              frecuencia: '',
              duracion: '',
              viaAdministracion: ViaAdministracion.ORAL,
              indicaciones: ''
            })}
          >
            <Plus className="mr-2 h-4 w-4" />
            Agregar Medicamento
          </Button>
        </div>

        {fields.map((field, index) => (
          <Card key={field.id} className="relative">
            <CardContent className="pt-6">
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => remove(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre del Medicamento *</Label>
                  <Input {...form.register(`medicamentos.${index}.nombre`)} placeholder="Ej: Enalapril" />
                  {form.formState.errors.medicamentos?.[index]?.nombre && (
                    <p className="text-sm text-red-600">{form.formState.errors.medicamentos[index]?.nombre?.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Concentración *</Label>
                  <Input {...form.register(`medicamentos.${index}.concentracion`)} placeholder="Ej: 10mg" />
                </div>

                <div className="space-y-2">
                  <Label>Presentación *</Label>
                  <Select onValueChange={(value) => form.setValue(`medicamentos.${index}.presentacion`, value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione presentación" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRESENTACIONES_MEDICAMENTO.map(pres => (
                        <SelectItem key={pres} value={pres}>{pres}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.medicamentos?.[index]?.presentacion && (
                    <p className="text-sm text-red-600">{form.formState.errors.medicamentos[index]?.presentacion?.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Cantidad *</Label>
                  <Input {...form.register(`medicamentos.${index}.cantidad`)} placeholder="Ej: 30 tabletas" />
                </div>

                <div className="space-y-2">
                  <Label>Dosificación *</Label>
                  <Input {...form.register(`medicamentos.${index}.dosificacion`)} placeholder="Ej: 1 tableta" />
                </div>

                <div className="space-y-2">
                  <Label>Frecuencia *</Label>
                  <Select onValueChange={(value) => form.setValue(`medicamentos.${index}.frecuencia`, value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione frecuencia" />
                    </SelectTrigger>
                    <SelectContent>
                      {FRECUENCIAS_COMUNES.map(freq => (
                        <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.medicamentos?.[index]?.frecuencia && (
                    <p className="text-sm text-red-600">{form.formState.errors.medicamentos[index]?.frecuencia?.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Duración *</Label>
                  <Input {...form.register(`medicamentos.${index}.duracion`)} placeholder="Ej: 30 días" />
                </div>

                <div className="space-y-2">
                  <Label>Vía de Administración *</Label>
                  <Select
                    defaultValue={ViaAdministracion.ORAL}
                    onValueChange={(value) => form.setValue(`medicamentos.${index}.viaAdministracion`, value as ViaAdministracion)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(ViaAdministracion).map(via => (
                        <SelectItem key={via} value={via}>{via}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-2 space-y-2">
                  <Label>Indicaciones Especiales</Label>
                  <Textarea {...form.register(`medicamentos.${index}.indicaciones`)} rows={2} placeholder="Indicaciones adicionales..." />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Observaciones Generales</Label>
          <Textarea {...form.register('observaciones')} rows={3} placeholder="Observaciones adicionales sobre la receta..." />
        </div>

        <div className="space-y-2">
          <Label>Vigencia de la Receta</Label>
          <Input {...form.register('vigencia')} placeholder="Ej: 30 días" />
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
              Guardar Receta
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
