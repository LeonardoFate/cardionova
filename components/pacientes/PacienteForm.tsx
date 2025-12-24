// components/pacientes/PacienteForm.tsx
'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Check, ChevronsUpDown } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { cn } from '@/lib/utils'
import { TipoSeguro } from '@/types/paciente'
import { usePacientes } from '@/hooks/usePacientes'

const pacienteFormSchema = z.object({
  nombre: z.string().min(2, 'Mínimo 2 caracteres'),
  apellido: z.string().min(2, 'Mínimo 2 caracteres'),
  cedula: z.string().min(10, 'Cédula inválida'),
  fechaNacimiento: z.string().min(1, 'Fecha requerida'),
  telefono: z.string().min(10, 'Teléfono inválido'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  direccion: z.string().optional(),
  tipoSeguro: z.nativeEnum(TipoSeguro),
  numeroSeguro: z.string().optional(),
  medicoAsignado: z.string().min(1, 'Debe seleccionar un médico'),
  observaciones: z.string().optional()
})

type PacienteFormData = z.infer<typeof pacienteFormSchema>

interface Medico {
  _id: string
  firstName: string
  lastName: string
  profile: { speciality?: string }
}

interface PacienteFormProps {
  medicos: Medico[]
  onSuccess: () => void
  onCancel: () => void
}

export function PacienteForm({ medicos, onSuccess, onCancel }: PacienteFormProps) {
  const { createPaciente, isLoading, error, clearError } = usePacientes()
  const [openMedico, setOpenMedico] = useState(false)
  const [selectedMedicoId, setSelectedMedicoId] = useState('')

  const form = useForm<PacienteFormData>({
    resolver: zodResolver(pacienteFormSchema),
    defaultValues: {
      tipoSeguro: TipoSeguro.PARTICULAR
    }
  })

  const { register, handleSubmit, setValue, formState: { errors } } = form

  useEffect(() => {
    clearError()
  }, [clearError])

  const selectedMedico = medicos.find((m) => m._id === selectedMedicoId)

  const onSubmit = async (data: PacienteFormData) => {
    const result = await createPaciente(data)
    if (result) {
      onSuccess()
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Registrar Nuevo Paciente</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input id="nombre" {...register('nombre')} />
              {errors.nombre && <p className="text-sm text-red-600">{errors.nombre.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="apellido">Apellido *</Label>
              <Input id="apellido" {...register('apellido')} />
              {errors.apellido && <p className="text-sm text-red-600">{errors.apellido.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cedula">Cédula *</Label>
              <Input id="cedula" {...register('cedula')} />
              {errors.cedula && <p className="text-sm text-red-600">{errors.cedula.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fechaNacimiento">Fecha de Nacimiento *</Label>
              <Input id="fechaNacimiento" type="date" {...register('fechaNacimiento')} />
              {errors.fechaNacimiento && <p className="text-sm text-red-600">{errors.fechaNacimiento.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono *</Label>
              <Input id="telefono" {...register('telefono')} />
              {errors.telefono && <p className="text-sm text-red-600">{errors.telefono.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register('email')} />
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input id="direccion" {...register('direccion')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipoSeguro">Tipo de Seguro *</Label>
              <Select onValueChange={(value) => setValue('tipoSeguro', value as TipoSeguro)} defaultValue={TipoSeguro.PARTICULAR}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(TipoSeguro).map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.tipoSeguro && <p className="text-sm text-red-600">{errors.tipoSeguro.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="numeroSeguro">Número de Seguro</Label>
              <Input id="numeroSeguro" {...register('numeroSeguro')} />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="medicoAsignado">Médico Asignado *</Label>
              {medicos && medicos.length > 0 ? (
                <>
                  <Popover open={openMedico} onOpenChange={setOpenMedico}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openMedico}
                        className="w-full justify-between"
                      >
                        {selectedMedicoId
                          ? `Dr. ${selectedMedico?.firstName} ${selectedMedico?.lastName}${selectedMedico?.profile?.speciality ? ` - ${selectedMedico.profile.speciality}` : ''}`
                          : "Seleccione un médico..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Buscar médico por nombre o especialidad..." />
                        <CommandList>
                          <CommandEmpty>No se encontró ningún médico.</CommandEmpty>
                          <CommandGroup>
                            {medicos.map((medico) => (
                              <CommandItem
                                key={medico._id}
                                value={`${medico.firstName} ${medico.lastName} ${medico.profile?.speciality || ''}`}
                                onSelect={() => {
                                  setSelectedMedicoId(medico._id)
                                  setValue('medicoAsignado', medico._id)
                                  setOpenMedico(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedMedicoId === medico._id ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    Dr. {medico.firstName} {medico.lastName}
                                  </span>
                                  {medico.profile?.speciality && (
                                    <span className="text-sm text-gray-500">
                                      {medico.profile.speciality}
                                    </span>
                                  )}
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {errors.medicoAsignado && <p className="text-sm text-red-600">{errors.medicoAsignado.message}</p>}
                </>
              ) : (
                <div className="border rounded p-4 bg-yellow-50 text-yellow-800">
                  <p className="text-sm">No hay médicos disponibles. Por favor, contacte al administrador.</p>
                  <p className="text-xs mt-1">Médicos cargados: {medicos?.length || 0}</p>
                </div>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="observaciones">Observaciones</Label>
              <Input id="observaciones" {...register('observaciones')} />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-cardionova-red hover:bg-cardionova-darkred">
              {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Registrando...</> : 'Registrar Paciente'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
