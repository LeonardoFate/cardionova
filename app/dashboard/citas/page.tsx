import { redirect } from "next/navigation";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { Navbar } from "@/components/navbar";

export default async function CitasPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/acceso-medicos");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#1E3A8A] mb-4">Pantalla Citas</h1>
        <p className="text-gray-600">Agenda y gestión de citas médicas.</p>
      </main>
    </div>
  );
}
