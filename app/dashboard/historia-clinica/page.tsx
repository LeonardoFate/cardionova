import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";
import { MedicalRecordsTable } from "./data-table";
import { MedicalRecord } from "@/components/medical-record/columns";

interface HistoriaClinicaPageProps {
  searchParams: { search?: string; page?: string; pageSize?: string };
}

export default async function HistoriaClinicaPage({ searchParams }: HistoriaClinicaPageProps) {
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

  const search = searchParams.search || "";
  const page = parseInt(searchParams.page || "1");
  const pageSize = parseInt(searchParams.pageSize || "10");

  let records: MedicalRecord[] = [];
  let totalCount: number = 0;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const url = new URL(`${baseUrl}/api/medical-records`);
    url.searchParams.set("page", page.toString());
    url.searchParams.set("pageSize", pageSize.toString());
    if (search) {
      url.searchParams.set("search", search);
    }

    const response = await fetch(url.toString(), {
      cache: "no-store",
      headers: {
        Cookie: (await headers()).get("cookie") || "",
      },
    });

    if (!response.ok) {
      throw new Error("Error fetching medical records");
    }

    const result = await response.json();
    records = result.data;
    totalCount = result.totalCount;
  } catch (error) {
    console.error("Error loading medical records:", error);
    // Optionally display an error message to the user
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
        {totalCount === 0 && !search ? (
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
        ) : totalCount === 0 && search ? (
          <div className="flex flex-col items-center justify-center py-16">
            <FileText className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No se encontraron resultados para "{search}"
            </h3>
            <p className="text-gray-500 mb-6">
              Intenta con otro término de búsqueda.
            </p>
          </div>
        ) : (
          <MedicalRecordsTable
            data={records}
            totalCount={totalCount}
            page={page}
            pageSize={pageSize}
          />
        )}
      </div>
    </div>
  );
}
