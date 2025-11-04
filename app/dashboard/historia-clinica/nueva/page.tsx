"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormSection } from "@/app/components/medical-record/FormSection";
import { BMICalculator } from "@/app/components/medical-record/BMICalculator";
import { CheckboxGroup } from "@/app/components/medical-record/CheckboxGroup";
import { MedicationSelector } from "@/app/components/medical-record/MedicationSelector";
import { DatePicker } from "@/app/components/medical-record/DatePicker";
import { Stepper } from "@/app/components/medical-record/Stepper";
import { useMedicalRecordForm } from "@/app/hooks/useMedicalRecordForm";
import {
  CARDIOVASCULAR_RISK_FACTORS,
  MEDICAL_STUDIES,
} from "@/app/lib/medical-constants";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

const STEPS = [
  { id: 1, title: "Datos del Paciente", description: "Información básica" },
  { id: 2, title: "Signos Vitales", description: "Datos biométricos" },
  { id: 3, title: "Consulta", description: "Motivo y diagnóstico" },
  { id: 4, title: "Antecedentes", description: "Historia clínica" },
  { id: 5, title: "Examen Físico", description: "Exploración física" },
  { id: 6, title: "Plan y Tratamiento", description: "Indicaciones" },
];

export default function NuevaHistoriaClinicaPage() {
  const router = useRouter();
  const {
    formData,
    isLoading,
    setIsLoading,
    updateField,
    toggleArrayItem,
    addArrayItem,
    removeArrayItem,
    resetForm,
  } = useMedicalRecordForm();

  const [currentStep, setCurrentStep] = useState(1);
  const [showBMICalculator, setShowBMICalculator] = useState(true);

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Filter additional studies to exclude already performed studies
  const availableAdditionalStudies = useMemo(() => {
    return MEDICAL_STUDIES.filter(
      (study) => !formData.studiesPerformed.includes(study)
    );
  }, [formData.studiesPerformed]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Implement API call to save medical record
      console.log("Saving medical record:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert("Historia clínica guardada exitosamente");
      resetForm();
      router.push("/dashboard/historia-clinica");
    } catch (error) {
      console.error("Error saving medical record:", error);
      alert("Error al guardar la historia clínica");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-6 px-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/historia-clinica">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#1E3A8A]">
              Nueva Historia Clínica
            </h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-8 max-w-7xl mx-auto space-y-6">
        {/* Patient Data Section */}
        <FormSection title="Datos del Paciente">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="recordDate">
                Fecha <span className="text-red-500">*</span>
              </Label>
              <DatePicker
                value={formData.recordDate}
                onChange={(value) => updateField("recordDate", value)}
                placeholder="Selecciona la fecha de la consulta"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="patientName">
                Nombre del Paciente <span className="text-red-500">*</span>
              </Label>
              <Input
                id="patientName"
                value={formData.patientName}
                onChange={(e) => updateField("patientName", e.target.value)}
                placeholder="Nombre completo del paciente"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="patientIdNumber">
                Cédula <span className="text-red-500">*</span>
              </Label>
              <Input
                id="patientIdNumber"
                value={formData.patientIdNumber}
                onChange={(e) => updateField("patientIdNumber", e.target.value)}
                placeholder="Número de cédula"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="insuranceType">
                Tipo de Seguro <span className="text-red-500">*</span>
              </Label>
              <Input
                id="insuranceType"
                value={formData.insuranceType}
                onChange={(e) => updateField("insuranceType", e.target.value)}
                placeholder="Tipo de seguro médico"
                required
              />
            </div>
          </div>
        </FormSection>

        {/* Biometric Data Section */}
        <FormSection title="Datos Biométricos">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Calculadora de IMC</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowBMICalculator(!showBMICalculator)}
              >
                {showBMICalculator ? "Ocultar" : "Mostrar"} Calculadora
              </Button>
            </div>

            {showBMICalculator && (
              <BMICalculator
                age={formData.age}
                weight={formData.weight}
                height={formData.height}
                bmi={formData.bmi}
                onAgeChange={(age) => updateField("age", age)}
                onWeightChange={(weight) => updateField("weight", weight)}
                onHeightChange={(height) => updateField("height", height)}
              />
            )}
          </div>
        </FormSection>

        {/* Vital Signs Section */}
        <FormSection title="Signos Vitales">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bloodPressure">
                Presión Arterial <span className="text-red-500">*</span>
              </Label>
              <Input
                id="bloodPressure"
                value={formData.bloodPressure}
                onChange={(e) => updateField("bloodPressure", e.target.value)}
                placeholder="120/80"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="heartRate">
                Frecuencia Cardíaca <span className="text-red-500">*</span>
              </Label>
              <Input
                id="heartRate"
                type="number"
                value={formData.heartRate || ""}
                onChange={(e) => updateField("heartRate", Number(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="oxygenSaturation">
                Sat O2 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="oxygenSaturation"
                type="number"
                value={formData.oxygenSaturation || ""}
                onChange={(e) =>
                  updateField("oxygenSaturation", Number(e.target.value))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperature">
                Temperatura <span className="text-red-500">*</span>
              </Label>
              <Input
                id="temperature"
                type="number"
                step="0.1"
                value={formData.temperature || ""}
                onChange={(e) => updateField("temperature", Number(e.target.value))}
                required
              />
            </div>
          </div>
        </FormSection>

        {/* Consultation Section */}
        <FormSection title="Consulta y Diagnóstico">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="consultationReason">
                Motivo de Consulta <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="consultationReason"
                value={formData.consultationReason}
                onChange={(e) => updateField("consultationReason", e.target.value)}
                placeholder="Describe el motivo de la consulta..."
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cie10Code">
                CIE-10 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="cie10Code"
                value={formData.cie10Code}
                onChange={(e) => updateField("cie10Code", e.target.value)}
                placeholder="Selecciona un diagnóstico CIE-10"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentIllness">
                  Enfermedad Actual <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="currentIllness"
                  value={formData.currentIllness}
                  onChange={(e) => updateField("currentIllness", e.target.value)}
                  placeholder="Describe la enfermedad actual..."
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="illnessEvolution">
                  Evolución de la Enfermedad <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="illnessEvolution"
                  value={formData.illnessEvolution}
                  onChange={(e) => updateField("illnessEvolution", e.target.value)}
                  placeholder="Describe la evolución de la enfermedad..."
                  rows={3}
                  required
                />
              </div>
            </div>
          </div>
        </FormSection>

        {/* Personal History Section */}
        <FormSection title="Antecedentes Personales">
          <div className="space-y-6">
            <CheckboxGroup
              label="Factores de Riesgo Cardiovascular"
              options={CARDIOVASCULAR_RISK_FACTORS}
              selectedValues={formData.cardiovascularRiskFactors}
              onToggle={(factor) =>
                toggleArrayItem("cardiovascularRiskFactors", factor)
              }
              columns={2}
            />

            <div className="space-y-2">
              <Label htmlFor="cardiovascularHistory">
                Antecedentes Cardiovasculares
              </Label>
              <Textarea
                id="cardiovascularHistory"
                value={formData.cardiovascularHistory}
                onChange={(e) =>
                  updateField("cardiovascularHistory", e.target.value)
                }
                placeholder="Describe antecedentes cardiovasculares..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="personalPathologicalHistory">
                Antecedentes Patológicos Personales
              </Label>
              <Textarea
                id="personalPathologicalHistory"
                value={formData.personalPathologicalHistory}
                onChange={(e) =>
                  updateField("personalPathologicalHistory", e.target.value)
                }
                placeholder="Describe antecedentes patológicos personales..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="surgicalHistory">Antecedentes Quirúrgicos</Label>
              <Textarea
                id="surgicalHistory"
                value={formData.surgicalHistory}
                onChange={(e) => updateField("surgicalHistory", e.target.value)}
                placeholder="Describe antecedentes quirúrgicos..."
                rows={2}
              />
            </div>

            <MedicationSelector
              label="Medicación Habitual"
              medications={formData.habitualMedication}
              onAdd={(med) => addArrayItem("habitualMedication", med)}
              onRemove={(index) => removeArrayItem("habitualMedication", index)}
            />

            <div className="space-y-2">
              <Label htmlFor="allergies">Alergias</Label>
              <Textarea
                id="allergies"
                value={formData.allergies}
                onChange={(e) => updateField("allergies", e.target.value)}
                placeholder="Describe alergias conocidas..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="familyPathologicalHistory">
                Antecedentes Patológicos Familiares
              </Label>
              <Textarea
                id="familyPathologicalHistory"
                value={formData.familyPathologicalHistory}
                onChange={(e) =>
                  updateField("familyPathologicalHistory", e.target.value)
                }
                placeholder="Describe antecedentes patológicos familiares..."
                rows={2}
              />
            </div>
          </div>
        </FormSection>

        {/* System Review Section */}
        <FormSection title="Examen por Sistemas">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="skinAndAppendages">Piel y Faneras</Label>
              <Input
                id="skinAndAppendages"
                value={formData.skinAndAppendages}
                onChange={(e) => updateField("skinAndAppendages", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="respiratorySystem">Sistema Respiratorio</Label>
              <Input
                id="respiratorySystem"
                value={formData.respiratorySystem}
                onChange={(e) => updateField("respiratorySystem", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardiovascularSystem">Sistema Cardiovascular</Label>
              <Input
                id="cardiovascularSystem"
                value={formData.cardiovascularSystem}
                onChange={(e) => updateField("cardiovascularSystem", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gastrointestinalSystem">
                Sistema Gastrointestinal
              </Label>
              <Input
                id="gastrointestinalSystem"
                value={formData.gastrointestinalSystem}
                onChange={(e) =>
                  updateField("gastrointestinalSystem", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="genitourinarySystem">Sistema Genitourinario</Label>
              <Input
                id="genitourinarySystem"
                value={formData.genitourinarySystem}
                onChange={(e) => updateField("genitourinarySystem", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="musculoskeletalSystem">
                Sistema Musculoesquelético
              </Label>
              <Input
                id="musculoskeletalSystem"
                value={formData.musculoskeletalSystem}
                onChange={(e) =>
                  updateField("musculoskeletalSystem", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endocrineSystem">Sistema Endocrino</Label>
              <Input
                id="endocrineSystem"
                value={formData.endocrineSystem}
                onChange={(e) => updateField("endocrineSystem", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="neurologicalSystem">Sistema Neurológico</Label>
              <Input
                id="neurologicalSystem"
                value={formData.neurologicalSystem}
                onChange={(e) => updateField("neurologicalSystem", e.target.value)}
              />
            </div>
          </div>
        </FormSection>

        {/* Physical Exam Section */}
        <FormSection title="Examen Físico">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="generalInspection">Inspección General</Label>
              <Textarea
                id="generalInspection"
                value={formData.generalInspection}
                onChange={(e) => updateField("generalInspection", e.target.value)}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="glasgowScale">Escala de Glasgow</Label>
                <Input
                  id="glasgowScale"
                  value={formData.glasgowScale}
                  onChange={(e) => updateField("glasgowScale", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="neck">Cuello</Label>
                <Input
                  id="neck"
                  value={formData.neck}
                  onChange={(e) => updateField("neck", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="thorax">Tórax</Label>
                <Input
                  id="thorax"
                  value={formData.thorax}
                  onChange={(e) => updateField("thorax", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="heart">Corazón</Label>
                <Input
                  id="heart"
                  value={formData.heart}
                  onChange={(e) => updateField("heart", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lungs">Pulmones</Label>
                <Input
                  id="lungs"
                  value={formData.lungs}
                  onChange={(e) => updateField("lungs", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="abdomen">Abdomen</Label>
                <Input
                  id="abdomen"
                  value={formData.abdomen}
                  onChange={(e) => updateField("abdomen", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="upperExtremities">Extremidades Superiores</Label>
                <Input
                  id="upperExtremities"
                  value={formData.upperExtremities}
                  onChange={(e) => updateField("upperExtremities", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lowerExtremities">Extremidades Inferiores</Label>
                <Input
                  id="lowerExtremities"
                  value={formData.lowerExtremities}
                  onChange={(e) => updateField("lowerExtremities", e.target.value)}
                />
              </div>
            </div>
          </div>
        </FormSection>

        {/* Studies Section */}
        <FormSection title="Estudios Realizados">
          <div className="space-y-4">
            <CheckboxGroup
              label="Estudios Seleccionados"
              options={MEDICAL_STUDIES}
              selectedValues={formData.studiesPerformed}
              onToggle={(study) => toggleArrayItem("studiesPerformed", study)}
              columns={2}
            />

            <div className="space-y-2">
              <Label htmlFor="studiesResults">Resultados</Label>
              <Textarea
                id="studiesResults"
                value={formData.studiesResults}
                onChange={(e) => updateField("studiesResults", e.target.value)}
                placeholder="Describe los resultados de los estudios realizados..."
                rows={4}
              />
            </div>
          </div>
        </FormSection>

        {/* Treatment Plan Section */}
        <FormSection title="Plan">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="followUpDate">Tiempo de Control</Label>
              <DatePicker
                value={formData.followUpDate}
                onChange={(value) => updateField("followUpDate", value)}
                placeholder="Selecciona fecha de control"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rest">Reposo</Label>
              <Textarea
                id="rest"
                value={formData.rest}
                onChange={(e) => updateField("rest", e.target.value)}
                placeholder="Indicaciones de reposo..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="diet">
                Dieta <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="diet"
                value={formData.diet}
                onChange={(e) => updateField("diet", e.target.value)}
                placeholder="Indicaciones dietéticas..."
                rows={2}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="physicalActivity">
                Actividad Física <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="physicalActivity"
                value={formData.physicalActivity}
                onChange={(e) => updateField("physicalActivity", e.target.value)}
                placeholder="Indicaciones de actividad física..."
                rows={2}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="alarmSigns">
                Pautas de Alarma <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="alarmSigns"
                value={formData.alarmSigns}
                onChange={(e) => updateField("alarmSigns", e.target.value)}
                placeholder="Signos de alarma y cuándo consultar..."
                rows={2}
                required
              />
            </div>

            <CheckboxGroup
              label="Estudios Adicionales"
              options={availableAdditionalStudies}
              selectedValues={formData.additionalStudies}
              onToggle={(study) => toggleArrayItem("additionalStudies", study)}
              columns={2}
            />
          </div>
        </FormSection>

        {/* Treatment Section */}
        <FormSection title="Tratamiento">
          <div className="space-y-4">
            <MedicationSelector
              label="Medicamentos"
              medications={formData.prescribedMedications}
              onAdd={(med) => addArrayItem("prescribedMedications", med)}
              onRemove={(index) => removeArrayItem("prescribedMedications", index)}
            />

            <div className="space-y-2">
              <Label htmlFor="treatmentObservations">Observaciones</Label>
              <Textarea
                id="treatmentObservations"
                value={formData.treatmentObservations}
                onChange={(e) =>
                  updateField("treatmentObservations", e.target.value)
                }
                placeholder="Observaciones adicionales del tratamiento..."
                rows={3}
              />
            </div>
          </div>
        </FormSection>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 sticky bottom-0 bg-white p-4 border-t border-gray-200">
          <Link href="/dashboard/historia-clinica">
            <Button type="button" variant="outline" disabled={isLoading}>
              Cancelar
            </Button>
          </Link>
          <Button
            type="submit"
            className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
            disabled={isLoading}
          >
            {isLoading ? "Guardando..." : "Guardar Historia"}
          </Button>
        </div>
      </form>
    </div>
  );
}
