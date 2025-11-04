import { redirect } from "next/navigation";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { Navbar } from "@/components/navbar";

export default async function ProcedimientosPage() {
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
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#1E3A8A] mb-4">Pantalla Procedimientos</h1>
        <p className="text-gray-600">Gestión de procedimientos e informes médicos.</p>
      </main>
    </div>
  );
}
