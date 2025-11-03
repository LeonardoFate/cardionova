import { redirect } from "next/navigation";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, FileText, Activity, Pill, MessageSquare, Settings, Shield } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/acceso-medicos");
  }

  const userRole = session.user.role || "doctor";
  const userName = session.user.name || "Usuario";

  // Determinar el saludo según el rol
  const greeting = userRole === "admin"
    ? `Bienvenido, ${userName}`
    : userRole === "secretary"
    ? `Bienvenida, ${userName}`
    : `Bienvenido, Dr. ${userName}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1E3A8A] mb-2">
            {greeting}
          </h1>
          <p className="text-gray-600 text-lg">
            Panel de Control - Cardionova
          </p>
          <div className="mt-2">
            <span className="inline-block px-3 py-1 bg-[#E11D48]/10 text-[#E11D48] rounded-full text-sm font-medium">
              Rol: {userRole === "admin" ? "Administrador" : userRole === "doctor" ? "Doctor" : "Secretaria"}
            </span>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Pacientes */}
          <Card className="hover:shadow-lg transition-shadow border-none shadow-md">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#1E3A8A]/10 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#1E3A8A]" />
                </div>
                <div>
                  <CardTitle className="text-[#1E3A8A]">Pacientes</CardTitle>
                  <CardDescription>Gestión de pacientes</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900 mb-2">0</p>
              <p className="text-sm text-gray-500">Total de pacientes registrados</p>
            </CardContent>
          </Card>

          {/* Citas */}
          <Card className="hover:shadow-lg transition-shadow border-none shadow-md">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#E11D48]/10 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-[#E11D48]" />
                </div>
                <div>
                  <CardTitle className="text-[#1E3A8A]">Citas</CardTitle>
                  <CardDescription>Agenda de citas</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900 mb-2">0</p>
              <p className="text-sm text-gray-500">Citas programadas hoy</p>
            </CardContent>
          </Card>

          {/* Reportes Médicos */}
          {(userRole === "admin" || userRole === "doctor") && (
            <Card className="hover:shadow-lg transition-shadow border-none shadow-md">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#1E3A8A]/10 rounded-full flex items-center justify-center">
                    <FileText className="w-6 h-6 text-[#1E3A8A]" />
                  </div>
                  <div>
                    <CardTitle className="text-[#1E3A8A]">Reportes</CardTitle>
                    <CardDescription>Informes médicos</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-gray-900 mb-2">0</p>
                <p className="text-sm text-gray-500">Reportes pendientes</p>
              </CardContent>
            </Card>
          )}

          {/* Resultados de Laboratorio */}
          {(userRole === "admin" || userRole === "doctor") && (
            <Card className="hover:shadow-lg transition-shadow border-none shadow-md">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#E11D48]/10 rounded-full flex items-center justify-center">
                    <Activity className="w-6 h-6 text-[#E11D48]" />
                  </div>
                  <div>
                    <CardTitle className="text-[#1E3A8A]">Laboratorio</CardTitle>
                    <CardDescription>Resultados de análisis</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-gray-900 mb-2">0</p>
                <p className="text-sm text-gray-500">Resultados disponibles</p>
              </CardContent>
            </Card>
          )}

          {/* Recetas */}
          {(userRole === "admin" || userRole === "doctor") && (
            <Card className="hover:shadow-lg transition-shadow border-none shadow-md">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#1E3A8A]/10 rounded-full flex items-center justify-center">
                    <Pill className="w-6 h-6 text-[#1E3A8A]" />
                  </div>
                  <div>
                    <CardTitle className="text-[#1E3A8A]">Recetas</CardTitle>
                    <CardDescription>Prescripciones médicas</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-gray-900 mb-2">0</p>
                <p className="text-sm text-gray-500">Recetas emitidas este mes</p>
              </CardContent>
            </Card>
          )}

          {/* Mensajes */}
          <Card className="hover:shadow-lg transition-shadow border-none shadow-md">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#E11D48]/10 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-[#E11D48]" />
                </div>
                <div>
                  <CardTitle className="text-[#1E3A8A]">Mensajes</CardTitle>
                  <CardDescription>Comunicación interna</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900 mb-2">0</p>
              <p className="text-sm text-gray-500">Mensajes sin leer</p>
            </CardContent>
          </Card>

          {/* Administración - Solo para Admin */}
          {userRole === "admin" && (
            <>
              <Card className="hover:shadow-lg transition-shadow border-none shadow-md">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#1E3A8A]/10 rounded-full flex items-center justify-center">
                      <Shield className="w-6 h-6 text-[#1E3A8A]" />
                    </div>
                    <div>
                      <CardTitle className="text-[#1E3A8A]">Usuarios</CardTitle>
                      <CardDescription>Gestión de personal</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-gray-900 mb-2">3</p>
                  <p className="text-sm text-gray-500">Usuarios activos en el sistema</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow border-none shadow-md">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#E11D48]/10 rounded-full flex items-center justify-center">
                      <Settings className="w-6 h-6 text-[#E11D48]" />
                    </div>
                    <div>
                      <CardTitle className="text-[#1E3A8A]">Configuración</CardTitle>
                      <CardDescription>Ajustes del sistema</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">Administrar configuración general</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-8 p-6 bg-white rounded-lg shadow-md border-l-4 border-[#E11D48]">
          <h3 className="text-lg font-semibold text-[#1E3A8A] mb-2">
            🚧 Sistema en Desarrollo
          </h3>
          <p className="text-gray-600">
            El panel de control de Cardionova está actualmente en desarrollo.
            Las funcionalidades completas estarán disponibles próximamente.
          </p>
        </div>
      </main>
    </div>
  );
}
