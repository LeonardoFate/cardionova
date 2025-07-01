// components/historia-clinica/HistoriaClinicaForm.tsx

'use client'

import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Plus, X, Calendar, Save, Calculator } from 'lucide-react'
import {
  IHistoriaClinicaResponse,
  IHistoriaClinicaCreate,
  CIE10_OPTIONS,
  FACTORES_RIESGO_CARDIOVASCULAR,
  ESTUDIOS_DISPONIBLES,
  MEDICAMENTOS_COMUNES
} from '@/types/historia-clinica'
import { useHistoriaClinica } from '@/hooks/useHistoriaClinica'
import { createHistoriaClinicaSchema } from '@/lib/db/validations/historia-clinica'

type HistoriaFormData = z.infer<typeof createHistoriaClinicaSchema>

interface HistoriaClinicaFormProps {
  historia?: IHistoriaClinicaResponse
  onSuccess: (historia: IHistoriaClinicaResponse) => void
  onCancel: () => void
}

export function HistoriaClinicaForm({ historia, onSuccess, onCancel }: HistoriaClinicaFormProps) {
  const [showCalculadoraIMC, setShowCalculadoraIMC] = useState(false)
  const { createHistoria, updateHistoria, isLoading, error, clearError, calcularIMC } = useHistoriaClinica()

  const isEditing = !!historia

  const form = useForm<HistoriaFormData>({
    resolver: zodResolver(createHistoriaClinicaSchema),
    defaultValues: {
      paciente: {
        nombre: historia?.paciente.nombre || '',
        cedula: historia?.paciente.cedula || '',
        tipoSeguro: historia?.paciente.tipoSeguro || ''
      },
      fecha: historia?.fecha ? new Date(historia.fecha).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      datosBiometricos: {
        edad: historia?.datosBiometricos.edad || 0,
        peso: historia?.datosBiometricos.peso || 0,
        estatura: historia?.datosBiometricos.estatura || 0
      },
      signosVitales: {
        presionArterial: historia?.signosVitales.presionArterial || '',
        frecuenciaCardiaca: historia?.signosVitales.frecuenciaCardiaca || 0,
        satO2: historia?.signosVitales.satO2 || 0,
        temperatura: historia?.signosVitales.temperatura || 0
      },
      motivoConsulta: historia?.motivoConsulta || '',
      cie10: historia?.cie10 || '',
      enfermedadActual: historia?.enfermedadActual || '',
      evolucionEnfermedad: historia?.evolucionEnfermedad || '',
      antecedentesPersonales: {
        factoresRiesgoCardiovascular: historia?.antecedentesPersonales.factoresRiesgoCardiovascular || [],
        antecedentesCardiovasculares: historia?.antecedentesPersonales.antecedentesCardiovasculares || '',
        antecedentesPatologicosPersonales: historia?.antecedentesPersonales.antecedentesPatologicosPersonales || '',
        antecedentesQuirurgicos: historia?.antecedentesPersonales.antecedentesQuirurgicos || '',
        medicacion: historia?.antecedentesPersonales.medicacion || [],
        alergias: historia?.antecedentesPersonales.alergias || '',
        antecedentesPatologicosFamiliares: historia?.antecedentesPersonales.antecedentesPatologicosFamiliares || ''
      },
      examenSistemas: {
        pielFaneras: historia?.examenSistemas.pielFaneras || 'NADA QUE LLAME LA ATENCIÓN',
        sistemaRespiratorio: historia?.examenSistemas.sistemaRespiratorio || 'NADA QUE LLAME LA ATENCIÓN',
        sistemaCardiovascular: historia?.examenSistemas.sistemaCardiovascular || 'NADA QUE LLAME LA ATENCIÓN',
        sistemaGastrointestinal: historia?.examenSistemas.sistemaGastrointestinal || 'NADA QUE LLAME LA ATENCIÓN',
        sistemaGenitourinario: historia?.examenSistemas.sistemaGenitourinario || 'NADA QUE LLAME LA ATENCIÓN',
        sistemaMusculoesqueletico: historia?.examenSistemas.sistemaMusculoesqueletico || 'NADA QUE LLAME LA ATENCIÓN',
        sistemaEndocrino: historia?.examenSistemas.sistemaEndocrino || 'NADA QUE LLAME LA ATENCIÓN',
        sistemaNeurologico: historia?.examenSistemas.sistemaNeurologico || 'NADA QUE LLAME LA ATENCIÓN'
      },
      examenFisico: {
        inspeccionGeneral: historia?.examenFisico.inspeccionGeneral || 'PACIENTE ORIENTADO EN TIEMPO Y ESPACIO, COLABORA CON EL INTERROGATORIO',
        escalaGlasgow: historia?.examenFisico.escalaGlasgow || '15/15',
        cuello: historia?.examenFisico.cuello || 'MOVIL - NO ADENOPATIAS PALPABLES - YUGULAR 0/3',
        torax: historia?.examenFisico.torax || 'SIMETRICO',
        corazon: historia?.examenFisico.corazon || 'RUIDOS CARDIACOS RITMICOS, NO SOPLOS, NO RUIDOS AGREGADOS',
        pulmones: historia?.examenFisico.pulmones || 'CLAROS Y VENTILADOS',
        abdomen: historia?.examenFisico.abdomen || 'BLANDO DEPRESIBLE NO DOLOROSO, NO MASAS RUIDOS HIDROAEREOS PRESENTES',
        extremidadesSuperiores: historia?.examenFisico.extremidadesSuperiores || 'SIMETRICAS - MOVILES - NO DOLOROSOS - PULSOS PRESENTES',
        extremidadesInferiores: historia?.examenFisico.extremidadesInferiores || 'SIMETRICAS - MOVILES - NO DOLOROSOS - PULSOS PRESENTES - NO EDEMA'
      },
      estudiosRealizados: {
        estudios: historia?.estudiosRealizados.estudios || [],
        conclusiones: historia?.estudiosRealizados.conclusiones || ''
      },
      plan: {
        tiempoControl: historia?.plan.tiempoControl ? new Date(historia.plan.tiempoControl).toISOString().split('T')[0] : undefined,
        dieta: historia?.plan.dieta || '',
        actividadFisica: historia?.plan.actividadFisica || '',
        pautasAlarma: historia?.plan.pautasAlarma || '',
        reposo: historia?.plan.reposo || '',
        estudiosAdicionales: historia?.plan.estudiosAdicionales || []
      },
      tratamiento: {
        medicamentos: historia?.tratamiento.medicamentos || [],
        observaciones: historia?.tratamiento.observaciones || ''
      }
    }
  })

  const { register, handleSubmit, watch, setValue, control, formState: { errors } } = form

  // Field arrays para listas dinámicas
  const { fields: factoresRiesgo, append: appendFactor, remove: removeFactor } = useFieldArray({
    control,
    name: 'antecedentesPersonales.factoresRiesgoCardiovascular'
  })

  const { fields: medicacionHabitual, append: appendMedicacion, remove: removeMedicacion } = useFieldArray({
    control,
    name: 'antecedentesPersonales.medicacion'
  })

  const { fields: estudios, append: appendEstudio, remove: removeEstudio } = useFieldArray({
    control,
    name: 'estudiosRealizados.estudios'
  })

  const { fields: estudiosAdicionales, append: appendEstudioAdicional, remove: removeEstudioAdicional } = useFieldArray({
    control,
    name: 'plan.estudiosAdicionales'
  })

  const { fields: medicamentosTratamiento, append: appendMedicamentoTratamiento, remove: removeMedicamentoTratamiento } = useFieldArray({
    control,
    name: 'tratamiento.medicamentos'
  })

  // Watch para calcular IMC automáticamente
  const peso = watch('datosBiometricos.peso')
  const estatura = watch('datosBiometricos.estatura')

  useEffect(() => {
    if (peso && estatura && peso > 0 && estatura > 0) {
      const imc = calcularIMC(peso, estatura)
      setValue('datosBiometricos.imc' as any, imc)
    }
  }, [peso, estatura, calcularIMC, setValue])

  // Limpiar errores al montar
  useEffect(() => {
    clearError()
  }, [clearError])

  const onSubmit = async (data: HistoriaFormData) => {
    try {
      clearError()

      let result: IHistoriaClinicaResponse | null = null

      if (isEditing && historia) {
        result = await updateHistoria(historia._id, data)
      } else {
        result = await createHistoria(data as IHistoriaClinicaCreate)
      }

      if (result) {
        onSuccess(result)
      }
    } catch (error) {
      console.error('Error en formulario:', error)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-cardionova-blue">
            {isEditing ? 'Editar Historia Clínica' : 'Nueva Historia Clínica'}
          </h1>
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
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
                  {isEditing ? 'Actualizando...' : 'Guardando...'}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isEditing ? 'Actualizar' : 'Guardar'}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Errores */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Datos del Paciente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Datos del Paciente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fecha">Fecha *</Label>
                <Input
                  id="fecha"
                  type="date"
                  {...register('fecha')}
                />
                {errors.fecha && (
                  <p className="text-sm text-red-600">{errors.fecha.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre del Paciente *</Label>
                <Input
                  id="nombre"
                  {...register('paciente.nombre')}
                  placeholder="Nombre completo del paciente"
                />
                {errors.paciente?.nombre && (
                  <p className="text-sm text-red-600">{errors.paciente.nombre.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cedula">Cédula *</Label>
                <Input
                  id="cedula"
                  {...register('paciente.cedula')}
                  placeholder="Número de cédula"
                />
                {errors.paciente?.cedula && (
                  <p className="text-sm text-red-600">{errors.paciente.cedula.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipoSeguro">Tipo de Seguro *</Label>
              <Input
                id="tipoSeguro"
                {...register('paciente.tipoSeguro')}
                placeholder="Tipo de seguro médico"
              />
              {errors.paciente?.tipoSeguro && (
                <p className="text-sm text-red-600">{errors.paciente.tipoSeguro.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Datos Biométricos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Calculator className="mr-2 h-5 w-5" />
                Datos Biométricos
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowCalculadoraIMC(!showCalculadoraIMC)}
              >
                {showCalculadoraIMC ? 'Ocultar' : 'Mostrar'} Calculadora IMC
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edad">Edad *</Label>
                <Input
                  id="edad"
                  type="number"
                  {...register('datosBiometricos.edad', { valueAsNumber: true })}
                  placeholder="Años"
                />
                {errors.datosBiometricos?.edad && (
                  <p className="text-sm text-red-600">{errors.datosBiometricos.edad.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="peso">Peso *</Label>
                <Input
                  id="peso"
                  type="number"
                  step="0.1"
                  {...register('datosBiometricos.peso', { valueAsNumber: true })}
                  placeholder="Kg"
                />
                {errors.datosBiometricos?.peso && (
                  <p className="text-sm text-red-600">{errors.datosBiometricos.peso.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="estatura">Estatura *</Label>
                <Input
                  id="estatura"
                  type="number"
                  {...register('datosBiometricos.estatura', { valueAsNumber: true })}
                  placeholder="cm"
                />
                {errors.datosBiometricos?.estatura && (
                  <p className="text-sm text-red-600">{errors.datosBiometricos.estatura.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>IMC (Calculado)</Label>
                <div className="p-2 bg-gray-100 rounded text-center font-semibold">
                  {peso && estatura ? calcularIMC(peso, estatura) : '--'}
                </div>
              </div>
            </div>

            {showCalculadoraIMC && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Clasificación del IMC:</h4>
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">Bajo peso:</span> &lt; 18.5</p>
                  <p><span className="font-medium">Normal:</span> 18.5 - 24.9</p>
                  <p><span className="font-medium">Sobrepeso:</span> 25.0 - 29.9</p>
                  <p><span className="font-medium">Obesidad:</span> ≥ 30.0</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Signos Vitales */}
        <Card>
          <CardHeader>
            <CardTitle>Signos Vitales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="presionArterial">Presión Arterial *</Label>
                <Input
                  id="presionArterial"
                  {...register('signosVitales.presionArterial')}
                  placeholder="120/80"
                />
                {errors.signosVitales?.presionArterial && (
                  <p className="text-sm text-red-600">{errors.signosVitales.presionArterial.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="frecuenciaCardiaca">Frecuencia Cardíaca *</Label>
                <Input
                  id="frecuenciaCardiaca"
                  type="number"
                  {...register('signosVitales.frecuenciaCardiaca', { valueAsNumber: true })}
                  placeholder="lpm"
                />
                {errors.signosVitales?.frecuenciaCardiaca && (
                  <p className="text-sm text-red-600">{errors.signosVitales.frecuenciaCardiaca.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="satO2">Sat O2 *</Label>
                <Input
                  id="satO2"
                  type="number"
                  {...register('signosVitales.satO2', { valueAsNumber: true })}
                  placeholder="%"
                />
                {errors.signosVitales?.satO2 && (
                  <p className="text-sm text-red-600">{errors.signosVitales.satO2.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="temperatura">Temperatura *</Label>
                <Input
                  id="temperatura"
                  type="number"
                  step="0.1"
                  {...register('signosVitales.temperatura', { valueAsNumber: true })}
                  placeholder="°C"
                />
                {errors.signosVitales?.temperatura && (
                  <p className="text-sm text-red-600">{errors.signosVitales.temperatura.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información Clínica */}
        <Card>
          <CardHeader>
            <CardTitle>Información Clínica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="motivoConsulta">Motivo de Consulta *</Label>
              <Textarea
                id="motivoConsulta"
                {...register('motivoConsulta')}
                placeholder="Describa el motivo de la consulta"
                rows={3}
              />
              {errors.motivoConsulta && (
                <p className="text-sm text-red-600">{errors.motivoConsulta.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cie10">CIE-10 *</Label>
              <Select onValueChange={(value) => setValue('cie10', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un código CIE-10" />
                </SelectTrigger>
                <SelectContent>
                  {CIE10_OPTIONS.map((codigo) => (
                    <SelectItem key={codigo} value={codigo}>
                      {codigo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                {...register('cie10')}
                placeholder="O escriba un código personalizado"
                className="mt-2"
              />
              {errors.cie10 && (
                <p className="text-sm text-red-600">{errors.cie10.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="enfermedadActual">Enfermedad Actual *</Label>
                <Textarea
                  id="enfermedadActual"
                  {...register('enfermedadActual')}
                  placeholder="Describa la enfermedad actual"
                  rows={4}
                />
                {errors.enfermedadActual && (
                  <p className="text-sm text-red-600">{errors.enfermedadActual.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="evolucionEnfermedad">Evolución de la Enfermedad *</Label>
                <Textarea
                  id="evolucionEnfermedad"
                  {...register('evolucionEnfermedad')}
                  placeholder="Describa la evolución de la enfermedad"
                  rows={4}
                />
                {errors.evolucionEnfermedad && (
                  <p className="text-sm text-red-600">{errors.evolucionEnfermedad.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botones de acción final */}
        <div className="flex justify-end space-x-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
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
                {isEditing ? 'Actualizando...' : 'Guardando...'}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isEditing ? 'Actualizar Historia' : 'Guardar Historia'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
