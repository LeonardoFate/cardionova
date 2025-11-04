import { redirect } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";

export default async function HistoriaClinicaPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/acceso-medicos");
  }

  const userRole = session.user.role || "doctor";

  if (userRole !== "admin" && userRole !== "doctor") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-6 px-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#1E3A8A]">
              Historia Clínica
            </h1>
            <p className="text-gray-600 mt-1">
              Gestión de historias clínicas de pacientes
            </p>
          </div>
          <Link href="/dashboard/historia-clinica/nueva">
            <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Historia Clínica
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <Suspense fallback={<div>Cargando...</div>}>
          <HistoriasList />
        </Suspense>
      </div>
    </div>
  );
}

async function HistoriasList() {
  // TODO: Fetch medical records from API
  // For now, show empty state

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <FileText className="w-16 h-16 text-gray-400 mb-4" />
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        No hay historias clínicas aún
      </h3>
      <p className="text-gray-500 mb-6">
        Comienza creando una nueva historia clínica
      </p>
      <Link href="/dashboard/historia-clinica/nueva">
        <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
          <Plus className="w-4 h-4 mr-2" />
          Crear Primera Historia
        </Button>
      </Link>
    </div>
  );
}
