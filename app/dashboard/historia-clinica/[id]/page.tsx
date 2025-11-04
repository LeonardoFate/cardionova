"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { MedicalRecordForm } from "@/app/components/medical-record/MedicalRecordForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function VerHistoriaClinicaPage() {
  const router = useRouter();
  const params = useParams();
  const [recordData, setRecordData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const response = await fetch(`/api/medical-records/${params.id}`);

        if (!response.ok) {
          throw new Error("Error al cargar la historia clínica");
        }

        const data = await response.json();
        setRecordData(data);
      } catch (error) {
        console.error("Error fetching record:", error);
        toast.error("Error al cargar", {
          description: "No se pudo cargar la historia clínica",
        });
        router.push("/dashboard/historia-clinica");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecord();
  }, [params.id, router]);

  const handleCancel = () => {
    router.push("/dashboard/historia-clinica");
  };

  // This won't be called since the form is disabled
  const handleSubmit = async () => {
    // Do nothing - form is read-only
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E3A8A] mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando historia clínica...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!recordData) {
    return null;
  }

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
              Historia Clínica - {recordData.patientName}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Vista de solo lectura
            </p>
          </div>
        </div>
      </div>

      {/* Form (Read-only) */}
      <div className="p-8 max-w-7xl mx-auto">
        <div className="pointer-events-none opacity-90">
          <MedicalRecordForm
            initialData={recordData}
            isViewMode={true}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>

        {/* Action Button */}
        <div className="flex justify-end mt-6">
          <Link href="/dashboard/historia-clinica">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a la Lista
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
