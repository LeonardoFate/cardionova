// components/historia-clinica/HistoriaClinicaForm.tsx - VERSIÓN COMPLETA ACTUALIZADA

'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Loader2, Plus, X, Calendar, Save, Calculator, User, Activity, Stethoscope, FileText, Heart } from 'lucide-react'
import {
  IHistoriaClinicaResponse,
  IHistoriaClinicaCreate,
  FACTORES_RIESGO_CARDIOVASCULAR,
  ESTUDIOS_DISPONIBLES,
  MEDICAMENTOS_COMUNES,
  CIE10_OPTIONS,
  EXAMEN_POR_SISTEMAS_DEFAULT,
  EXAMEN_FISICO_DEFAULT
} from '@/types/historia-clinica'
import { createHistoriaClinicaSchema } from '@/lib/db/validations/historia-clinica'
import { useHistoriaClinica } from '@/hooks/useHistoriaClinica'

// ✅ ESQUEMA ACTUALIZADO PARA EL FORMULARIO
const historiaFormSchema = z.object({
  paciente: z.object({
    nombre: z.string().min(1, 'Nombre requerido'),
    cedula: z.string().min(1, 'Cédula requerida'),
    tipoSeguro: z.string().min(1, 'Tipo de seguro requerido')
  }),
  fecha: z.string().min(1, 'Fecha requerida'),
  datosBiometricos: z.object({
    edad: z.number().min(0, 'La edad no puede ser negativa').max(150, 'La edad no puede ser mayor a 150'),
    peso: z.number().min(1, 'El peso debe ser mayor a 1 kg').max(500, 'El peso no puede ser mayor a 500 kg'),
    estatura: z.number().min(30, 'La estatura debe ser mayor a 30 cm').max(250, 'La estatura no puede ser mayor a 250 cm')
  }),
  signosVitales: z.object({
    presionArterial: z.string().min(1, 'Presión arterial requerida'),
    frecuenciaCardiaca: z.number().min(30, 'Frecuencia cardíaca muy baja').max(220, 'Frecuencia cardíaca muy alta'),
    satO2: z.number().min(50, 'Saturación muy baja').max(100, 'La saturación no puede ser mayor a 100%'),
    temperatura: z.number().min(0, 'La temperatura debe ser un número positivo').max(50, 'La temperatura no puede ser mayor a 50°C')
  }),
  motivoConsulta: z.string().min(1, 'Motivo de consulta requerido'),
  cie10: z.string().min(1, 'CIE-10 requerido'),
  enfermedadActual: z.string().min(1, 'Enfermedad actual requerida'),
  evolucionEnfermedad: z.string().min(1, 'Evolución de enfermedad requerida'),

  // ✅ NUEVOS CAMPOS
  antecedentesPersonales: z.object({
    factoresRiesgoCardiovascular: z.array(z.string()).default([]),
    antecedentesCardiovasculares: z.string().default(''),
    antecedentesPatologicosPersonales: z.string().default(''),
    antecedentesQuirurgicos: z.string().default(''),
    medicacion: z.array(z.string()).default([]),
    alergias: z.string().default(''),
    antecedentesPatologicosFamiliares: z.string().default('')
  }).default({}),

  examenPorSistemas: z.object({
    pielFaneras: z.string().default(EXAMEN_POR_SISTEMAS_DEFAULT.pielFaneras),
    sistemaRespiratorio: z.string().default(EXAMEN_POR_SISTEMAS_DEFAULT.sistemaRespiratorio),
    sistemaCardiovascular: z.string().default(EXAMEN_POR_SISTEMAS_DEFAULT.sistemaCardiovascular),
    sistemaGastrointestinal: z.string().default(EXAMEN_POR_SISTEMAS_DEFAULT.sistemaGastrointestinal),
    sistemaGenitourinario: z.string().default(EXAMEN_POR_SISTEMAS_DEFAULT.sistemaGenitourinario),
    sistemaMusculoesqueletico: z.string().default(EXAMEN_POR_SISTEMAS_DEFAULT.sistemaMusculoesqueletico),
    sistemaEndocrino: z.string().default(EXAMEN_POR_SISTEMAS_DEFAULT.sistemaEndocrino),
    sistemaNeurologico: z.string().default(EXAMEN_POR_SISTEMAS_DEFAULT.sistemaNeurologico)
  }).default({}),

  examenFisico: z.object({
    inspeccionGeneral: z.string().default(EXAMEN_FISICO_DEFAULT.inspeccionGeneral),
    escalaGlasgow: z.string().default(EXAMEN_FISICO_DEFAULT.escalaGlasgow),
    cuello: z.string().default(EXAMEN_FISICO_DEFAULT.cuello),
    torax: z.string().default(EXAMEN_FISICO_DEFAULT.torax),
    corazon: z.string().default(EXAMEN_FISICO_DEFAULT.corazon),
    pulmones: z.string().default(EXAMEN_FISICO_DEFAULT.pulmones),
    abdomen: z.string().default(EXAMEN_FISICO_DEFAULT.abdomen),
    extremidadesSuperiores: z.string().default(EXAMEN_FISICO_DEFAULT.extremidadesSuperiores),
    extremidadesInferiores: z.string().default(EXAMEN_FISICO_DEFAULT.extremidadesInferiores)
  }).default({}),

  estudiosRealizados: z.object({
    estudiosSeleccionados: z.array(z.string()).default([]),
    resultados: z.string().default('')
  }).default({}),

  plan: z.object({
    tiempoControl: z.string().optional(),
    dieta: z.string().min(1, 'Dieta requerida'),
    actividadFisica: z.string().min(1, 'Actividad física requerida'),
    pautasAlarma: z.string().min(1, 'Pautas de alarma requeridas'),
    reposo: z.string().default(''),
    estudiosAdicionales: z.array(z.string()).default([])
  }),

  tratamiento: z.object({
    medicamentos: z.array(z.string()).default([]),
    observaciones: z.string().default('')
  }).default({})
})

type HistoriaFormData = z.infer<typeof historiaFormSchema>

interface HistoriaClinicaFormProps {
  historia?: IHistoriaClinicaResponse
  paciente?: any // IPacienteResponse from pacientes
  onSuccess: (historia: IHistoriaClinicaResponse) => void
  onCancel: () => void
}

export function HistoriaClinicaForm({ historia, paciente, onSuccess, onCancel }: HistoriaClinicaFormProps) {
  const [showCalculadoraIMC, setShowCalculadoraIMC] = useState(false)
  const [newMedicamento, setNewMedicamento] = useState('')
  const [newMedicacionHabitual, setNewMedicacionHabitual] = useState('')

  const { createHistoria, updateHistoria, isLoading, error, clearError, calcularIMC } = useHistoriaClinica()

  const isEditing = !!historia

  // ✅ VALORES POR DEFECTO ACTUALIZADOS (con soporte para paciente pre-cargado)
  const form = useForm<HistoriaFormData>({
    resolver: zodResolver(historiaFormSchema),
    defaultValues: {
      paciente: {
        nombre: historia?.paciente.nombre || (paciente ? `${paciente.nombre} ${paciente.apellido}` : ''),
        cedula: historia?.paciente.cedula || paciente?.cedula || '',
        tipoSeguro: historia?.paciente.tipoSeguro || paciente?.tipoSeguro || ''
      },
      fecha: historia?.fecha
        ? new Date(historia.fecha).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      datosBiometricos: {
        edad: historia?.datosBiometricos.edad || paciente?.edad || 0,
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

      // ✅ NUEVOS VALORES POR DEFECTO
      antecedentesPersonales: {
        factoresRiesgoCardiovascular: historia?.antecedentesPersonales?.factoresRiesgoCardiovascular || [],
        antecedentesCardiovasculares: historia?.antecedentesPersonales?.antecedentesCardiovasculares || '',
        antecedentesPatologicosPersonales: historia?.antecedentesPersonales?.antecedentesPatologicosPersonales || '',
        antecedentesQuirurgicos: historia?.antecedentesPersonales?.antecedentesQuirurgicos || '',
        medicacion: historia?.antecedentesPersonales?.medicacion || [],
        alergias: historia?.antecedentesPersonales?.alergias || '',
        antecedentesPatologicosFamiliares: historia?.antecedentesPersonales?.antecedentesPatologicosFamiliares || ''
      },

      examenPorSistemas: {
        pielFaneras: historia?.examenPorSistemas?.pielFaneras || EXAMEN_POR_SISTEMAS_DEFAULT.pielFaneras,
        sistemaRespiratorio: historia?.examenPorSistemas?.sistemaRespiratorio || EXAMEN_POR_SISTEMAS_DEFAULT.sistemaRespiratorio,
        sistemaCardiovascular: historia?.examenPorSistemas?.sistemaCardiovascular || EXAMEN_POR_SISTEMAS_DEFAULT.sistemaCardiovascular,
        sistemaGastrointestinal: historia?.examenPorSistemas?.sistemaGastrointestinal || EXAMEN_POR_SISTEMAS_DEFAULT.sistemaGastrointestinal,
        sistemaGenitourinario: historia?.examenPorSistemas?.sistemaGenitourinario || EXAMEN_POR_SISTEMAS_DEFAULT.sistemaGenitourinario,
        sistemaMusculoesqueletico: historia?.examenPorSistemas?.sistemaMusculoesqueletico || EXAMEN_POR_SISTEMAS_DEFAULT.sistemaMusculoesqueletico,
        sistemaEndocrino: historia?.examenPorSistemas?.sistemaEndocrino || EXAMEN_POR_SISTEMAS_DEFAULT.sistemaEndocrino,
        sistemaNeurologico: historia?.examenPorSistemas?.sistemaNeurologico || EXAMEN_POR_SISTEMAS_DEFAULT.sistemaNeurologico
      },

      examenFisico: {
        inspeccionGeneral: historia?.examenFisico?.inspeccionGeneral || EXAMEN_FISICO_DEFAULT.inspeccionGeneral,
        escalaGlasgow: historia?.examenFisico?.escalaGlasgow || EXAMEN_FISICO_DEFAULT.escalaGlasgow,
        cuello: historia?.examenFisico?.cuello || EXAMEN_FISICO_DEFAULT.cuello,
        torax: historia?.examenFisico?.torax || EXAMEN_FISICO_DEFAULT.torax,
        corazon: historia?.examenFisico?.corazon || EXAMEN_FISICO_DEFAULT.corazon,
        pulmones: historia?.examenFisico?.pulmones || EXAMEN_FISICO_DEFAULT.pulmones,
        abdomen: historia?.examenFisico?.abdomen || EXAMEN_FISICO_DEFAULT.abdomen,
        extremidadesSuperiores: historia?.examenFisico?.extremidadesSuperiores || EXAMEN_FISICO_DEFAULT.extremidadesSuperiores,
        extremidadesInferiores: historia?.examenFisico?.extremidadesInferiores || EXAMEN_FISICO_DEFAULT.extremidadesInferiores
      },

      estudiosRealizados: {
        estudiosSeleccionados: historia?.estudiosRealizados?.estudiosSeleccionados || [],
        resultados: historia?.estudiosRealizados?.resultados || ''
      },

      plan: {
        tiempoControl: historia?.plan.tiempoControl
          ? new Date(historia.plan.tiempoControl).toISOString().split('T')[0]
          : '',
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

  const { register, handleSubmit, watch, setValue, formState: { errors } } = form

  // Watch para calcular IMC automáticamente
  const peso = watch('datosBiometricos.peso')
  const estatura = watch('datosBiometricos.estatura')
  const factoresRiesgo = watch('antecedentesPersonales.factoresRiesgoCardiovascular')
  const medicacionHabitual = watch('antecedentesPersonales.medicacion')
  const medicamentos = watch('tratamiento.medicamentos')
  const estudiosSeleccionados = watch('estudiosRealizados.estudiosSeleccionados')
  const estudiosAdicionales = watch('plan.estudiosAdicionales')

  // Calcular IMC automáticamente
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

  // ✅ FUNCIÓN DE SUBMIT ACTUALIZADA
  const onSubmit = async (data: HistoriaFormData) => {
    console.log('📝 Datos del formulario:', data)
    console.log('⚙️ Errores de validación:', errors)

    try {
      clearError()

      // Transformar datos para el API
      const transformedData = {
        ...data,
        fecha: new Date(data.fecha),
        datosBiometricos: {
          ...data.datosBiometricos,
          imc: calcularIMC(data.datosBiometricos.peso, data.datosBiometricos.estatura)
        },
        plan: {
          ...data.plan,
          tiempoControl: data.plan.tiempoControl ? new Date(data.plan.tiempoControl) : undefined
        }
      }

      console.log('🔄 Datos transformados:', transformedData)

      let result: IHistoriaClinicaResponse | null = null

      if (isEditing && historia) {
        console.log('✏️ Actualizando historia existente...')
        result = await updateHistoria(historia._id, transformedData)
      } else {
        console.log('➕ Creando nueva historia...')
        result = await createHistoria(transformedData as IHistoriaClinicaCreate)
      }

      console.log('📋 Resultado del API:', result)

      if (result) {
        console.log('✅ Historia guardada exitosamente')
        onSuccess(result)
      } else {
        console.log('❌ No se recibió resultado del API')
      }
    } catch (error) {
      console.error('💥 Error en formulario:', error)
    }
  }

  // ✅ FUNCIONES AUXILIARES
  const addMedicamento = () => {
    if (newMedicamento.trim()) {
      const currentMedicamentos = medicamentos || []
      setValue('tratamiento.medicamentos', [...currentMedicamentos, newMedicamento.trim()])
      setNewMedicamento('')
    }
  }

  const removeMedicamento = (index: number) => {
    const currentMedicamentos = medicamentos || []
    setValue('tratamiento.medicamentos', currentMedicamentos.filter((_, i) => i !== index))
  }

  const addMedicacionHabitual = () => {
    if (newMedicacionHabitual.trim()) {
      const currentMedicacion = medicacionHabitual || []
      setValue('antecedentesPersonales.medicacion', [...currentMedicacion, newMedicacionHabitual.trim()])
      setNewMedicacionHabitual('')
    }
  }

  const removeMedicacionHabitual = (index: number) => {
    const currentMedicacion = medicacionHabitual || []
    setValue('antecedentesPersonales.medicacion', currentMedicacion.filter((_, i) => i !== index))
  }

  const handleFactorRiesgoChange = (factor: string, checked: boolean) => {
    const current = factoresRiesgo || []
    if (checked) {
      setValue('antecedentesPersonales.factoresRiesgoCardiovascular', [...current, factor])
    } else {
      setValue('antecedentesPersonales.factoresRiesgoCardiovascular', current.filter(f => f !== factor))
    }
  }

  const handleEstudioSeleccionadoChange = (estudio: string, checked: boolean) => {
    const current = estudiosSeleccionados || []
    if (checked) {
      setValue('estudiosRealizados.estudiosSeleccionados', [...current, estudio])
    } else {
      setValue('estudiosRealizados.estudiosSeleccionados', current.filter(e => e !== estudio))
    }
  }

  const handleEstudioAdicionalChange = (estudio: string, checked: boolean) => {
    const current = estudiosAdicionales || []
    if (checked) {
      setValue('plan.estudiosAdicionales', [...current, estudio])
    } else {
      setValue('plan.estudiosAdicionales', current.filter(e => e !== estudio))
    }
  }

const getIMCClassification = (peso: number, estatura: number) => {
  if (!peso || !estatura) return { text: 'No calculado', color: 'bg-gray-100 text-gray-800' }
  
  const imcValue = calcularIMC(peso, estatura) // esto es number
  // Eliminar parseFloat() porque ya es number
  
  if (imcValue < 18.5) return { text: 'Bajo peso', color: 'bg-blue-100 text-blue-800' }
  if (imcValue < 25) return { text: 'Normal', color: 'bg-green-100 text-green-800' }
  if (imcValue < 30) return { text: 'Sobrepeso', color: 'bg-yellow-100 text-yellow-800' }
  return { text: 'Obesidad', color: 'bg-red-100 text-red-800' }
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
            <CardTitle className="flex items-center text-cardionova-blue">
              <User className="mr-2 h-5 w-5" />
              Datos del Paciente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            </div>
          </CardContent>
        </Card>

        {/* Datos Biométricos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-cardionova-blue">
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
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-gray-100 rounded text-center font-semibold flex-1">
                    {peso && estatura ? calcularIMC(peso, estatura) : '--'}
                  </div>
                  {peso && estatura && (
                    <Badge className={getIMCClassification(peso, estatura).color}>
                      {getIMCClassification(peso, estatura).text}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {showCalculadoraIMC && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2 text-blue-800">Clasificación del IMC:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <Badge className="bg-blue-100 text-blue-800">Bajo peso: &lt; 18.5</Badge>
                    <Badge className="bg-green-100 text-green-800">Normal: 18.5 - 24.9</Badge>
                    <Badge className="bg-yellow-100 text-yellow-800">Sobrepeso: 25.0 - 29.9</Badge>
                    <Badge className="bg-red-100 text-red-800">Obesidad: ≥ 30.0</Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Signos Vitales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-cardionova-blue">
              <Activity className="mr-2 h-5 w-5" />
              Signos Vitales
            </CardTitle>
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

        {/* Motivo de Consulta y Diagnóstico */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-cardionova-blue">
              <FileText className="mr-2 h-5 w-5" />
              Consulta y Diagnóstico
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="motivoConsulta">Motivo de Consulta *</Label>
                <Textarea
                  id="motivoConsulta"
                  {...register('motivoConsulta')}
                  placeholder="Describe el motivo de la consulta..."
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
                    <SelectValue placeholder="Selecciona un diagnóstico CIE-10" />
                  </SelectTrigger>
                  <SelectContent>
                    {CIE10_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.cie10 && (
                  <p className="text-sm text-red-600">{errors.cie10.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="enfermedadActual">Enfermedad Actual *</Label>
              <Textarea
                id="enfermedadActual"
                {...register('enfermedadActual')}
                placeholder="Describe la enfermedad actual..."
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
                placeholder="Describe la evolución de la enfermedad..."
                rows={4}
              />
              {errors.evolucionEnfermedad && (
                <p className="text-sm text-red-600">{errors.evolucionEnfermedad.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Antecedentes Personales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-cardionova-blue">
              <Heart className="mr-2 h-5 w-5" />
              Antecedentes Personales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Factores de Riesgo Cardiovascular */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Factores de Riesgo Cardiovascular</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {FACTORES_RIESGO_CARDIOVASCULAR.map((factor) => (
                  <div key={factor} className="flex items-center space-x-2">
                    <Checkbox
                      id={`factor-${factor}`}
                      checked={factoresRiesgo?.includes(factor) || false}
                      onCheckedChange={(checked) => handleFactorRiesgoChange(factor, !!checked)}
                    />
                    <Label htmlFor={`factor-${factor}`} className="text-sm cursor-pointer">
                      {factor}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Antecedentes Cardiovasculares */}
            <div className="space-y-2">
              <Label htmlFor="antecedentesCardiovasculares">Antecedentes Cardiovasculares</Label>
              <Textarea
                id="antecedentesCardiovasculares"
                {...register('antecedentesPersonales.antecedentesCardiovasculares')}
                placeholder="Describe antecedentes cardiovasculares..."
                rows={3}
              />
            </div>

            {/* Antecedentes Patológicos Personales */}
            <div className="space-y-2">
              <Label htmlFor="antecedentesPatologicosPersonales">Antecedentes Patológicos Personales</Label>
              <Textarea
                id="antecedentesPatologicosPersonales"
                {...register('antecedentesPersonales.antecedentesPatologicosPersonales')}
                placeholder="Describe antecedentes patológicos personales..."
                rows={3}
              />
            </div>

            {/* Antecedentes Quirúrgicos */}
            <div className="space-y-2">
              <Label htmlFor="antecedentesQuirurgicos">Antecedentes Quirúrgicos</Label>
              <Textarea
                id="antecedentesQuirurgicos"
                {...register('antecedentesPersonales.antecedentesQuirurgicos')}
                placeholder="Describe antecedentes quirúrgicos..."
                rows={3}
              />
            </div>

            {/* Medicación Habitual */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Medicación Habitual</Label>
              <div className="flex space-x-2">
                <Input
                  value={newMedicacionHabitual}
                  onChange={(e) => setNewMedicacionHabitual(e.target.value)}
                  placeholder="Agregar medicamento habitual..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMedicacionHabitual())}
                />
                <Button type="button" onClick={addMedicacionHabitual} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {medicacionHabitual?.map((med, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                    <span>{med}</span>
                    <button
                      type="button"
                      onClick={() => removeMedicacionHabitual(index)}
                      className="ml-1 hover:bg-red-100 rounded-full p-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="text-sm text-gray-600">
                <Label className="font-medium">Medicamentos comunes:</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {MEDICAMENTOS_COMUNES.map((med) => (
                    <Button
                      key={med}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setNewMedicacionHabitual(med)}
                      className="h-6 text-xs"
                    >
                      {med}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Alergias */}
            <div className="space-y-2">
              <Label htmlFor="alergias">Alergias</Label>
              <Textarea
                id="alergias"
                {...register('antecedentesPersonales.alergias')}
                placeholder="Describe alergias conocidas..."
                rows={2}
              />
            </div>

            {/* Antecedentes Patológicos Familiares */}
            <div className="space-y-2">
              <Label htmlFor="antecedentesPatologicosFamiliares">Antecedentes Patológicos Familiares</Label>
              <Textarea
                id="antecedentesPatologicosFamiliares"
                {...register('antecedentesPersonales.antecedentesPatologicosFamiliares')}
                placeholder="Describe antecedentes patológicos familiares..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Examen por Sistemas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-cardionova-blue">
              <Stethoscope className="mr-2 h-5 w-5" />
              Examen por Sistemas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pielFaneras">Piel y Faneras</Label>
                <Textarea
                  id="pielFaneras"
                  {...register('examenPorSistemas.pielFaneras')}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sistemaRespiratorio">Sistema Respiratorio</Label>
                <Textarea
                  id="sistemaRespiratorio"
                  {...register('examenPorSistemas.sistemaRespiratorio')}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sistemaCardiovascular">Sistema Cardiovascular</Label>
                <Textarea
                  id="sistemaCardiovascular"
                  {...register('examenPorSistemas.sistemaCardiovascular')}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sistemaGastrointestinal">Sistema Gastrointestinal</Label>
                <Textarea
                  id="sistemaGastrointestinal"
                  {...register('examenPorSistemas.sistemaGastrointestinal')}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sistemaGenitourinario">Sistema Genitourinario</Label>
                <Textarea
                  id="sistemaGenitourinario"
                  {...register('examenPorSistemas.sistemaGenitourinario')}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sistemaMusculoesqueletico">Sistema Musculoesquelético</Label>
                <Textarea
                  id="sistemaMusculoesqueletico"
                  {...register('examenPorSistemas.sistemaMusculoesqueletico')}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sistemaEndocrino">Sistema Endocrino</Label>
                <Textarea
                  id="sistemaEndocrino"
                  {...register('examenPorSistemas.sistemaEndocrino')}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sistemaNeurologico">Sistema Neurológico</Label>
                <Textarea
                  id="sistemaNeurologico"
                  {...register('examenPorSistemas.sistemaNeurologico')}
                  rows={2}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Examen Físico */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-cardionova-blue">
              <Stethoscope className="mr-2 h-5 w-5" />
              Examen Físico
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="inspeccionGeneral">Inspección General</Label>
                <Textarea
                  id="inspeccionGeneral"
                  {...register('examenFisico.inspeccionGeneral')}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="escalaGlasgow">Escala de Glasgow</Label>
                <Input
                  id="escalaGlasgow"
                  {...register('examenFisico.escalaGlasgow')}
                  placeholder="15/15"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cuello">Cuello</Label>
                <Textarea
                  id="cuello"
                  {...register('examenFisico.cuello')}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="torax">Tórax</Label>
                <Textarea
                  id="torax"
                  {...register('examenFisico.torax')}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="corazon">Corazón</Label>
                <Textarea
                  id="corazon"
                  {...register('examenFisico.corazon')}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pulmones">Pulmones</Label>
                <Textarea
                  id="pulmones"
                  {...register('examenFisico.pulmones')}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="abdomen">Abdomen</Label>
                <Textarea
                  id="abdomen"
                  {...register('examenFisico.abdomen')}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="extremidadesSuperiores">Extremidades Superiores</Label>
                <Textarea
                  id="extremidadesSuperiores"
                  {...register('examenFisico.extremidadesSuperiores')}
                  rows={2}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="extremidadesInferiores">Extremidades Inferiores</Label>
                <Textarea
                  id="extremidadesInferiores"
                  {...register('examenFisico.extremidadesInferiores')}
                  rows={2}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estudios Realizados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-cardionova-blue">
              <FileText className="mr-2 h-5 w-5" />
              Estudios Realizados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label className="text-base font-semibold">Estudios Seleccionados</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {ESTUDIOS_DISPONIBLES.map((estudio) => (
                  <div key={estudio} className="flex items-center space-x-2">
                    <Checkbox
                      id={`estudio-${estudio}`}
                      checked={estudiosSeleccionados?.includes(estudio) || false}
                      onCheckedChange={(checked) => handleEstudioSeleccionadoChange(estudio, !!checked)}
                    />
                    <Label htmlFor={`estudio-${estudio}`} className="text-sm cursor-pointer">
                      {estudio}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="resultados">Resultados</Label>
              <Textarea
                id="resultados"
                {...register('estudiosRealizados.resultados')}
                placeholder="Describe los resultados de los estudios realizados..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-cardionova-blue">
              <Calendar className="mr-2 h-5 w-5" />
              Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tiempoControl">Tiempo de Control</Label>
                <Input
                  id="tiempoControl"
                  type="date"
                  {...register('plan.tiempoControl')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reposo">Reposo</Label>
                <Input
                  id="reposo"
                  {...register('plan.reposo')}
                  placeholder="Indicaciones de reposo..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dieta">Dieta *</Label>
              <Textarea
                id="dieta"
                {...register('plan.dieta')}
                placeholder="Indicaciones dietéticas..."
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
                placeholder="Indicaciones de actividad física..."
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
                placeholder="Signos de alarma y cuándo consultar..."
                rows={3}
              />
              {errors.plan?.pautasAlarma && (
                <p className="text-sm text-red-600">{errors.plan.pautasAlarma.message}</p>
              )}
            </div>

            {/* Estudios Adicionales */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Estudios Adicionales</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {ESTUDIOS_DISPONIBLES.map((estudio) => (
                  <div key={estudio} className="flex items-center space-x-2">
                    <Checkbox
                      id={`estudio-adicional-${estudio}`}
                      checked={estudiosAdicionales?.includes(estudio) || false}
                      onCheckedChange={(checked) => handleEstudioAdicionalChange(estudio, !!checked)}
                    />
                    <Label htmlFor={`estudio-adicional-${estudio}`} className="text-sm cursor-pointer">
                      {estudio}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tratamiento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-cardionova-blue">
              <Heart className="mr-2 h-5 w-5" />
              Tratamiento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Medicamentos */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Medicamentos</Label>
              <div className="flex space-x-2">
                <Input
                  value={newMedicamento}
                  onChange={(e) => setNewMedicamento(e.target.value)}
                  placeholder="Agregar medicamento..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMedicamento())}
                />
                <Button type="button" onClick={addMedicamento} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {medicamentos?.map((med, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                    <span>{med}</span>
                    <button
                      type="button"
                      onClick={() => removeMedicamento(index)}
                      className="ml-1 hover:bg-red-100 rounded-full p-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="text-sm text-gray-600">
                <Label className="font-medium">Medicamentos comunes:</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {MEDICAMENTOS_COMUNES.map((med) => (
                    <Button
                      key={med}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setNewMedicamento(med)}
                      className="h-6 text-xs"
                    >
                      {med}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observaciones">Observaciones</Label>
              <Textarea
                id="observaciones"
                {...register('tratamiento.observaciones')}
                placeholder="Observaciones adicionales del tratamiento..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Botones de acción finales */}
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
