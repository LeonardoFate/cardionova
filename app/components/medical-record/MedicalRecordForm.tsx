"use client";

import { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormSection } from "@/app/components/medical-record/FormSection";
import { CheckboxGroup } from "@/app/components/medical-record/CheckboxGroup";
import {
  CARDIOVASCULAR_RISK_FACTORS,
  MEDICAL_STUDIES,
} from "@/app/lib/medical-constants";
import { Plus, X, ChevronDown, ChevronUp } from "lucide-react";

import { DatePicker } from "@/components/ui/date-picker";

// Optional Section Component
interface OptionalSectionProps {
  title: string;
  isVisible: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function OptionalSection({ title, isVisible, onToggle, children }: OptionalSectionProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {isVisible ? "Ocultar" : "Añadir"}
          </span>
          {isVisible ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </div>
      </button>
      {isVisible && (
        <div className="p-6 bg-white">
          {children}
        </div>
      )}
    </div>
  );
}

// Create dynamic Zod schema based on which sections are visible
const createMedicalRecordSchema = (toggles: {
  showPlan: boolean;
}) => {
  return z.object({
    // Patient Data (Always Required)
    recordDate: z.string().min(1, "La fecha es requerida"),
    patientName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    patientIdNumber: z.string().min(5, "La cédula es requerida"),
    insuranceType: z.string().min(2, "El tipo de seguro es requerido"),

    // Biometric Data (Always Required)
    age: z.number().min(0, "La edad debe ser mayor a 0").max(150, "Edad inválida"),
    weight: z.number().min(1, "El peso es requerido").max(500, "Peso inválido"),
    height: z.number().min(50, "La altura debe ser mayor a 50 cm").max(300, "Altura inválida"),
    bmi: z.number().optional(),

    // Vital Signs (Always Required)
    bloodPressure: z.string().min(1, "La presión arterial es requerida"),
    heartRate: z.number().min(20, "Frecuencia cardíaca inválida").max(300),
    oxygenSaturation: z.number().min(0).max(100),
    temperature: z.number().min(30).max(45),

    // Consultation (Always Required)
    consultationReason: z.string().min(5, "El motivo de consulta es requerido"),
    cie10Code: z.string().min(1, "El código CIE-10 es requerido"),
    currentIllness: z.string().min(5, "La enfermedad actual es requerida"),
    illnessEvolution: z.string().min(5, "La evolución es requerida"),

    // Personal History (Optional Section - all fields optional)
    cardiovascularHistory: z.string().optional(),
    personalPathologicalHistory: z.string().optional(),
    surgicalHistory: z.string().optional(),
    allergies: z.string().optional(),
    familyPathologicalHistory: z.string().optional(),

    // System Review (Optional Section - all fields optional)
    skinAndAppendages: z.string().optional(),
    respiratorySystem: z.string().optional(),
    cardiovascularSystem: z.string().optional(),
    gastrointestinalSystem: z.string().optional(),
    genitourinarySystem: z.string().optional(),
    musculoskeletalSystem: z.string().optional(),
    endocrineSystem: z.string().optional(),
    neurologicalSystem: z.string().optional(),

    // Physical Exam (Optional Section - all fields optional)
    generalInspection: z.string().optional(),
    glasgowScale: z.string().optional(),
    neck: z.string().optional(),
    thorax: z.string().optional(),
    heart: z.string().optional(),
    lungs: z.string().optional(),
    abdomen: z.string().optional(),
    upperExtremities: z.string().optional(),
    lowerExtremities: z.string().optional(),

    // Studies (Optional Section - all fields optional)
    studiesResults: z.string().optional(),

    // Treatment Plan (Conditional validation based on toggle)
    followUpDate: z.string().optional(),
    rest: z.string().optional(),
    diet: toggles.showPlan
      ? z.string().min(5, "Las indicaciones dietéticas son requeridas")
      : z.string().optional(),
    physicalActivity: toggles.showPlan
      ? z.string().min(5, "Las indicaciones de actividad física son requeridas")
      : z.string().optional(),
    alarmSigns: toggles.showPlan
      ? z.string().min(5, "Las pautas de alarma son requeridas")
      : z.string().optional(),
    treatmentObservations: z.string().optional(),
  });
};

// Type inference from base schema (with all fields optional)
export type MedicalRecordFormValues = z.infer<ReturnType<typeof createMedicalRecordSchema>>;

interface MedicalRecordFormProps {
  onSubmit: (values: MedicalRecordFormValues, additionalData: {
    cardiovascularRiskFactors: string[];
    studiesPerformed: string[];
    additionalStudies: string[];
    habitualMedication: string[];
    prescribedMedications: string[];
  }) => Promise<void>;
  onCancel: () => void;
  initialData?: any;
  isViewMode?: boolean;
}

export function MedicalRecordForm({ onSubmit, onCancel, initialData, isViewMode = false }: MedicalRecordFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toggle states for optional sections - open if data exists
  const [showPersonalHistory, setShowPersonalHistory] = useState(
    !!initialData?.cardiovascularHistory || !!initialData?.personalPathologicalHistory || false
  );
  const [showSystemReview, setShowSystemReview] = useState(
    !!initialData?.skinAndAppendages || false
  );
  const [showPhysicalExam, setShowPhysicalExam] = useState(
    !!initialData?.generalInspection || false
  );
  const [showStudies, setShowStudies] = useState(
    !!initialData?.studiesPerformed?.length || false
  );
  const [showPlan, setShowPlan] = useState(
    !!initialData?.diet || !!initialData?.physicalActivity || false
  );
  const [showTreatment, setShowTreatment] = useState(
    !!initialData?.prescribedMedications?.length || false
  );

  // Arrays that are not part of the form but managed separately
  const [cardiovascularRiskFactors, setCardiovascularRiskFactors] = useState<string[]>(
    initialData?.cardiovascularRiskFactors || []
  );
  const [studiesPerformed, setStudiesPerformed] = useState<string[]>(
    initialData?.studiesPerformed || []
  );
  const [additionalStudies, setAdditionalStudies] = useState<string[]>(
    initialData?.additionalStudies || []
  );
  const [habitualMedication, setHabitualMedication] = useState<string[]>(
    initialData?.habitualMedication?.length > 0 ? initialData.habitualMedication : [""]
  );
  const [prescribedMedications, setPrescribedMedications] = useState<string[]>(
    initialData?.prescribedMedications?.length > 0 ? initialData.prescribedMedications : [""]
  );

  // Create dynamic schema based on toggle states
  const validationSchema = useMemo(() => {
    return createMedicalRecordSchema({ showPlan });
  }, [showPlan]);

  const form = useForm<MedicalRecordFormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: initialData || {
      recordDate: new Date().toISOString().split('T')[0],
      patientName: "",
      patientIdNumber: "",
      insuranceType: "",
      age: undefined,
      weight: undefined,
      height: undefined,
      bmi: undefined,
      bloodPressure: "",
      heartRate: undefined,
      oxygenSaturation: undefined,
      temperature: undefined,
      consultationReason: "",
      cie10Code: "",
      currentIllness: "",
      illnessEvolution: "",
      cardiovascularHistory: "",
      personalPathologicalHistory: "",
      surgicalHistory: "",
      allergies: "",
      familyPathologicalHistory: "",
      skinAndAppendages: "",
      respiratorySystem: "",
      cardiovascularSystem: "",
      gastrointestinalSystem: "",
      genitourinarySystem: "",
      musculoskeletalSystem: "",
      endocrineSystem: "",
      neurologicalSystem: "",
      generalInspection: "",
      glasgowScale: "",
      neck: "",
      thorax: "",
      heart: "",
      lungs: "",
      abdomen: "",
      upperExtremities: "",
      lowerExtremities: "",
      studiesResults: "",
      followUpDate: "",
      rest: "",
      diet: "",
      physicalActivity: "",
      alarmSigns: "",
      treatmentObservations: "",
    },
  });

  // Watch biometric values for BMI calculation
  const weight = form.watch("weight");
  const height = form.watch("height");

  // Auto-calculate BMI
  useEffect(() => {
    if (weight && height && height > 0) {
      const heightInMeters = height / 100;
      const calculatedBMI = weight / (heightInMeters * heightInMeters);
      form.setValue("bmi", parseFloat(calculatedBMI.toFixed(2)));
    }
  }, [weight, height, form]);

  // Filter additional studies
  const availableAdditionalStudies = useMemo(() => {
    return MEDICAL_STUDIES.filter(
      (study) => !studiesPerformed.includes(study)
    );
  }, [studiesPerformed]);

  const handleSubmit = async (values: MedicalRecordFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values, {
        cardiovascularRiskFactors,
        studiesPerformed,
        additionalStudies,
        habitualMedication: habitualMedication.filter(m => m.trim() !== ""),
        prescribedMedications: prescribedMedications.filter(m => m.trim() !== ""),
      });
      form.reset();
      setCardiovascularRiskFactors([]);
      setStudiesPerformed([]);
      setAdditionalStudies([]);
      setHabitualMedication([""]);
      setPrescribedMedications([""]);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Medication helpers
  const addMedication = (type: 'habitual' | 'prescribed') => {
    if (type === 'habitual') {
      setHabitualMedication([...habitualMedication, ""]);
    } else {
      setPrescribedMedications([...prescribedMedications, ""]);
    }
  };

  const removeMedication = (type: 'habitual' | 'prescribed', index: number) => {
    if (type === 'habitual' && habitualMedication.length > 1) {
      setHabitualMedication(habitualMedication.filter((_, i) => i !== index));
    } else if (type === 'prescribed' && prescribedMedications.length > 1) {
      setPrescribedMedications(prescribedMedications.filter((_, i) => i !== index));
    }
  };

  const updateMedication = (type: 'habitual' | 'prescribed', index: number, value: string) => {
    if (type === 'habitual') {
      const newMeds = [...habitualMedication];
      newMeds[index] = value;
      setHabitualMedication(newMeds);
    } else {
      const newMeds = [...prescribedMedications];
      newMeds[index] = value;
      setPrescribedMedications(newMeds);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Patient Data Section */}
        <FormSection title="Datos del Paciente">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="recordDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha *</FormLabel>
                  <FormControl>
                    <DatePicker 
                      date={field.value ? new Date(field.value.split('-')[0], parseInt(field.value.split('-')[1]) - 1, parseInt(field.value.split('-')[2])) : undefined}
                      setDate={(date) => {
                        if (date) {
                          const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
                          field.onChange(formattedDate);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="patientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Paciente *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nombre completo del paciente" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="patientIdNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cédula *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Número de cédula" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="insuranceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Seguro *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Tipo de seguro médico" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        {/* Biometric Data Section */}
        <FormSection title="Datos Biométricos">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Edad *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Peso (kg) *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Altura (cm) *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bmi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IMC</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value ?? ""}
                          readOnly
                          className="bg-gray-50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
          </div>
        </FormSection>

        {/* Vital Signs Section */}
        <FormSection title="Signos Vitales">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name="bloodPressure"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Presión Arterial *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="120/80" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="heartRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frecuencia Cardíaca *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="oxygenSaturation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sat O2 *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="temperature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temperatura *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        {/* Consultation Section */}
        <FormSection title="Consulta y Diagnóstico">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="consultationReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo de Consulta *</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Describe el motivo de la consulta..."
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cie10Code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CIE-10 *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Selecciona un diagnóstico CIE-10" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="currentIllness"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enfermedad Actual *</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Describe la enfermedad actual..."
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="illnessEvolution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Evolución de la Enfermedad *</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Describe la evolución de la enfermedad..."
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </FormSection>

        {/* Personal History Section */}
        <OptionalSection
          title="Antecedentes Personales"
          isVisible={showPersonalHistory}
          onToggle={() => setShowPersonalHistory(!showPersonalHistory)}
        >
          <div className="space-y-6">
            <CheckboxGroup
              label="Factores de Riesgo Cardiovascular"
              options={CARDIOVASCULAR_RISK_FACTORS}
              selectedValues={cardiovascularRiskFactors}
              onToggle={(factor) => {
                setCardiovascularRiskFactors(prev =>
                  prev.includes(factor)
                    ? prev.filter(f => f !== factor)
                    : [...prev, factor]
                );
              }}
              columns={2}
              idPrefix="cardiovascular-risk"
            />

            <FormField
              control={form.control}
              name="cardiovascularHistory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Antecedentes Cardiovasculares</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Describe antecedentes cardiovasculares..."
                      rows={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="personalPathologicalHistory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Antecedentes Patológicos Personales</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Describe antecedentes patológicos personales..."
                      rows={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="surgicalHistory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Antecedentes Quirúrgicos</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Describe antecedentes quirúrgicos..."
                      rows={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Habitual Medication */}
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-2">
                <Label>Medicación Habitual</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addMedication('habitual')}
                  className="h-8"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Agregar
                </Button>
              </div>
              <div className="space-y-2">
                {habitualMedication.map((med, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={med}
                      onChange={(e) => updateMedication('habitual', index, e.target.value)}
                      placeholder={`Medicamento ${index + 1}`}
                    />
                    {habitualMedication.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeMedication('habitual', index)}
                        className="shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <FormField
              control={form.control}
              name="allergies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alergias</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Describe alergias conocidas..."
                      rows={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="familyPathologicalHistory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Antecedentes Patológicos Familiares</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Describe antecedentes patológicos familiares..."
                      rows={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </OptionalSection>

        {/* System Review Section */}
        <OptionalSection
          title="Examen por Sistemas"
          isVisible={showSystemReview}
          onToggle={() => setShowSystemReview(!showSystemReview)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="skinAndAppendages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Piel y Faneras</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="respiratorySystem"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sistema Respiratorio</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cardiovascularSystem"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sistema Cardiovascular</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gastrointestinalSystem"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sistema Gastrointestinal</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="genitourinarySystem"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sistema Genitourinario</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="musculoskeletalSystem"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sistema Musculoesquelético</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endocrineSystem"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sistema Endocrino</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="neurologicalSystem"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sistema Neurológico</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </OptionalSection>

        {/* Physical Exam Section */}
        <OptionalSection
          title="Examen Físico"
          isVisible={showPhysicalExam}
          onToggle={() => setShowPhysicalExam(!showPhysicalExam)}
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="generalInspection"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Inspección General</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={2} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="glasgowScale"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Escala de Glasgow</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="neck"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cuello</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="thorax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tórax</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="heart"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Corazón</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lungs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pulmones</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="abdomen"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Abdomen</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="upperExtremities"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Extremidades Superiores</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lowerExtremities"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Extremidades Inferiores</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </OptionalSection>

        {/* Studies Section */}
        <OptionalSection
          title="Estudios Realizados"
          isVisible={showStudies}
          onToggle={() => setShowStudies(!showStudies)}
        >
          <div className="space-y-4">
            <CheckboxGroup
              label="Estudios Seleccionados"
              options={MEDICAL_STUDIES}
              selectedValues={studiesPerformed}
              onToggle={(study) => {
                setStudiesPerformed(prev =>
                  prev.includes(study)
                    ? prev.filter(s => s !== study)
                    : [...prev, study]
                );
              }}
              columns={2}
              idPrefix="studies-performed"
            />

            <FormField
              control={form.control}
              name="studiesResults"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resultados</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Describe los resultados de los estudios realizados..."
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </OptionalSection>

        {/* Treatment Plan Section */}
        <OptionalSection
          title="Plan"
          isVisible={showPlan}
          onToggle={() => setShowPlan(!showPlan)}
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="followUpDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tiempo de Control</FormLabel>
                  <FormControl>
                    <DatePicker 
                      date={field.value ? new Date(field.value.split('-')[0], parseInt(field.value.split('-')[1]) - 1, parseInt(field.value.split('-')[2])) : undefined}
                      setDate={(date) => {
                        if (date) {
                          const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
                          field.onChange(formattedDate);
                        } else {
                            field.onChange(undefined);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rest"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reposo</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Indicaciones de reposo..."
                      rows={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="diet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dieta {showPlan && <span className="text-red-500">*</span>}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Indicaciones dietéticas..."
                      rows={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="physicalActivity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Actividad Física {showPlan && <span className="text-red-500">*</span>}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Indicaciones de actividad física..."
                      rows={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="alarmSigns"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pautas de Alarma {showPlan && <span className="text-red-500">*</span>}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Signos de alarma y cuándo consultar..."
                      rows={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CheckboxGroup
              label="Estudios Adicionales"
              options={availableAdditionalStudies}
              selectedValues={additionalStudies}
              onToggle={(study) => {
                setAdditionalStudies(prev =>
                  prev.includes(study)
                    ? prev.filter(s => s !== study)
                    : [...prev, study]
                );
              }}
              columns={2}
              idPrefix="additional-studies"
            />
          </div>
        </OptionalSection>

        {/* Treatment Section */}
        <OptionalSection
          title="Tratamiento"
          isVisible={showTreatment}
          onToggle={() => setShowTreatment(!showTreatment)}
        >
          <div className="space-y-4">
            {/* Prescribed Medication */}
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-2">
                <Label>Medicamentos</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addMedication('prescribed')}
                  className="h-8"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Agregar
                </Button>
              </div>
              <div className="space-y-2">
                {prescribedMedications.map((med, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={med}
                      onChange={(e) => updateMedication('prescribed', index, e.target.value)}
                      placeholder={`Medicamento ${index + 1}`}
                    />
                    {prescribedMedications.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeMedication('prescribed', index)}
                        className="shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <FormField
              control={form.control}
              name="treatmentObservations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observaciones</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Observaciones adicionales del tratamiento..."
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </OptionalSection>

        {/* Action Buttons */}
        {!isViewMode && (
          <div className="flex justify-end gap-4 sticky bottom-0 bg-white p-4 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Guardando..." : "Guardar Historia"}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}
