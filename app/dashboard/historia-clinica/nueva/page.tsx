"use client";

import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  MedicalRecordForm,
  type MedicalRecordFormValues
} from "@/app/components/medical-record/MedicalRecordForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface AdditionalData {
  cardiovascularRiskFactors: string[];
  studiesPerformed: string[];
  additionalStudies: string[];
  habitualMedication: string[];
  prescribedMedications: string[];
}

export default function NuevaHistoriaClinicaPage() {
  const router = useRouter();

  const handleSubmit = async (formData: MedicalRecordFormValues, additionalData: AdditionalData) => {
    try {
      // Combine form data with additional arrays
      const completeData = {
        ...formData,
        ...additionalData,
      };

      // Call API to save medical record
      const response = await fetch("/api/medical-records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(completeData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al guardar");
      }

      toast.success("Historia clínica guardada", {
        description: `Historia de ${formData.patientName} guardada exitosamente`,
      });

      router.push("/dashboard/historia-clinica");
    } catch (error) {
      console.error("Error saving medical record:", error);
      toast.error("Error al guardar", {
        description: error instanceof Error ? error.message : "No se pudo guardar la historia clínica. Intenta nuevamente.",
      });
      throw error;
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/historia-clinica");
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
      <div className="p-8 max-w-7xl mx-auto">
        <MedicalRecordForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </div>
  );
}
