// components/historia-clinica/HistoriaClinicaForm.tsx - VERSIÓN CORREGIDA

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

// ✅ Esquema simplificado para debugging
const createHistoriaClinicaSchema = z.object({
  paciente: z.object({
    nombre: z.string().min(1, 'Nombre requerido'),
    cedula: z.string().min(1, 'Cédula requerida'),
    tipoSeguro: z.string().min(1, 'Tipo de seguro requerido')
  }),
  fecha: z.string().min(1, 'Fecha requerida'),
  datosBiometricos: z.object({
    edad: z.number().min(1, 'Edad requerida'),
    peso: z.number().min(1, 'Peso requerido'),
    estatura: z.number().min(1, 'Estatura requerida')
  }),
  signosVitales: z.object({
    presionArterial: z.string().min(1, 'Presión arterial requerida'),
    frecuenciaCardiaca: z.number().min(30, 'Frecuencia cardíaca requerida'),
    satO2: z.number().min(50, 'Saturación requerida'),
    temperatura: z.number().min(30, 'Temperatura requerida')
  }),
  motivoConsulta: z.string().min(1, 'Motivo de consulta requerido'),
  cie10: z.string().min(1, 'CIE-10 requerido'),
  enfermedadActual: z.string().min(1, 'Enfermedad actual requerida'),
  evolucionEnfermedad: z.string().min(1, 'Evolución de enfermedad requerida'),
  plan: z.object({
    dieta: z.string().min(1, 'Dieta requerida'),
    actividadFisica: z.string().min(1, 'Actividad física requerida'),
    pautasAlarma: z.string().min(1, 'Pautas de alarma requeridas')
  }),
  // Campos opcionales con defaults
  antecedentesPersonales: z.object({
    factoresRiesgoCardiovascular: z.array(z.string()).default([]),
    antecedentesCardiovasculares: z.string().default(''),
    antecedentesPatologicosPersonales: z.string().default(''),
    antecedentesQuirurgicos: z.string().default(''),
    medicacion: z.array(z.string()).default([]),
    alergias: z.string().default(''),
    antecedentesPatologicosFamiliares: z.string().default('')
  }).default({}),
  tratamiento: z.object({
    medicamentos: z.array(z.string()).default([]),
    observaciones: z.string().default('')
  }).default({})
})

type HistoriaFormData = z.infer<typeof createHistoriaClinicaSchema>

interface HistoriaClinicaFormProps {
  historia?: IHistoriaClinicaResponse
  onSuccess: (historia: IHistoriaClinicaResponse) => void
  onCancel: () => void
}

export function HistoriaClinicaForm({ historia, onSuccess, onCancel }: HistoriaClinicaFormProps) {
  const [showCalculadoraIMC, setShowCalculadoraIMC] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>(null) // ✅ Para debugging
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
      fecha: historia?.fecha
        ? new Date(historia.fecha).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
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
      plan: {
        dieta: historia?.plan.dieta || '',
        actividadFisica: historia?.plan.actividadFisica || '',
        pautasAlarma: historia?.plan.pautasAlarma || ''
      },
      antecedentesPersonales: {
        factoresRiesgoCardiovascular: historia?.antecedentesPersonales.factoresRiesgoCardiovascular || [],
        antecedentesCardiovasculares: historia?.antecedentesPersonales.antecedentesCardiovasculares || '',
        antecedentesPatologicosPersonales: historia?.antecedentesPersonales.antecedentesPatologicosPersonales || '',
        antecedentesQuirurgicos: historia?.antecedentesPersonales.antecedentesQuirurgicos || '',
        medicacion: historia?.antecedentesPersonales.medicacion || [],
        alergias: historia?.antecedentesPersonales.alergias || '',
        antecedentesPatologicosFamiliares: historia?.antecedentesPersonales.antecedentesPatologicosFamiliares || ''
      },
      tratamiento: {
        medicamentos: historia?.tratamiento.medicamentos || [],
        observaciones: historia?.tratamiento.observaciones || ''
      }
    }
  })

  const { register, handleSubmit, watch, setValue, formState: { errors } } = form

  // Watch para calcular IMC automáticamente
  const peso = watch('datosBiometricos.peso')
  const estatura = watch('datosBiometricos.estatura')

  useEffect(() => {
    if (peso && estatura && peso > 0 && estatura > 0) {
      const imc = calcularIMC(peso, estatura)
      console.log('🧮 IMC calculado:', imc)
    }
  }, [peso, estatura, calcularIMC])

  // Limpiar errores al montar
  useEffect(() => {
    clearError()
  }, [clearError])

  // ✅ Función de submit con debugging mejorado
  const onSubmit = async (data: HistoriaFormData) => {
    console.log('📝 Datos del formulario:', data)
    console.log('⚙️ Errores de validación:', errors)

    try {
      clearError()
      setDebugInfo({ step: 'Iniciando envío...', data })

      // ✅ Transformar datos para el API
      const transformedData = {
        ...data,
        fecha: new Date(data.fecha),
        datosBiometricos: {
          ...data.datosBiometricos,
          imc: calcularIMC(data.datosBiometricos.peso, data.datosBiometricos.estatura)
        }
      }

      console.log('🔄 Datos transformados:', transformedData)
      setDebugInfo({ step: 'Datos transformados', data: transformedData })

      let result: IHistoriaClinicaResponse | null = null

      if (isEditing && historia) {
        console.log('✏️ Actualizando historia existente...')
        result = await updateHistoria(historia._id, transformedData)
      } else {
        console.log('➕ Creando nueva historia...')
        result = await createHistoria(transformedData as IHistoriaClinicaCreate)
      }

      console.log('📋 Resultado del API:', result)
      setDebugInfo({ step: 'Respuesta del API', data: result })

      if (result) {
        console.log('✅ Historia guardada exitosamente')
        onSuccess(result)
      } else {
        console.log('❌ No se recibió resultado del API')
        setDebugInfo({ step: 'Error: No hay resultado', data: null })
      }
    } catch (error) {
      console.error('💥 Error en formulario:', error)
      setDebugInfo({ step: 'Error capturado', error: error.message })
    }
  }

  // ✅ Función de submit con prevención de comportamiento por defecto
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🎯 Submit disparado')
    handleSubmit(onSubmit)(e)
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* ✅ Información de debugging */}
      {debugInfo && (
        <Alert>
          <AlertDescription>
            <strong>Debug:</strong> {debugInfo.step}
            {debugInfo.error && <div className="text-red-600">Error: {debugInfo.error}</div>}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleFormSubmit} className="space-y-6">
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

        {/* Plan de Tratamiento */}
        <Card>
          <CardHeader>
            <CardTitle>Plan de Tratamiento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dieta">Dieta *</Label>
              <Textarea
                id="dieta"
                {...register('plan.dieta')}
                placeholder="Describa el plan de dieta"
                rows={3}
              />
              {errors.plan?.dieta && (
                <p className="text-sm text-red-600">{errors.plan.dieta.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="actividadFisica">Actividad Física *</Label>
              <Textarea
                id="actividadFisica"
                {...register('plan.actividadFisica')}
                placeholder="Describa el plan de actividad física"
                rows={3}
              />
              {errors.plan?.actividadFisica && (
                <p className="text-sm text-red-600">{errors.plan.actividadFisica.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="pautasAlarma">Pautas de Alarma *</Label>
              <Textarea
                id="pautasAlarma"
                {...register('plan.pautasAlarma')}
                placeholder="Describa las pautas de alarma"
                rows={3}
              />
              {errors.plan?.pautasAlarma && (
                <p className="text-sm text-red-600">{errors.plan.pautasAlarma.message}</p>
              )}
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
