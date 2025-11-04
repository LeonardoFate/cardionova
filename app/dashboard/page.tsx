import { redirect } from "next/navigation";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { db } from "@/app/index";
import { user } from "@/app/db/schema";
import { count, eq } from "drizzle-orm";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, FileText, Settings, Shield, ClipboardList } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/acceso-medicos");
  }

  const userRole = session.user.role || "doctor";
  const userName = `${session.user.firstNames} ${session.user.lastNames}` || "Usuario";

  // Determinar el saludo según el rol
  const greeting = userRole === "admin"
    ? `Bienvenido, ${userName}`
    : userRole === "secretary"
      ? `Bienvenida, ${userName}`
      : `Bienvenido, Dr. ${userName}`;

  let userCount = 0;
  if (userRole === "admin") {
    const result = await db
      .select({ value: count() })
      .from(user)
      .where(eq(user.isActive, true));
    userCount = result[0].value;
  }

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
        </div>

        {/* User Information Section */}
        <Card className="border-none shadow-md mb-8">
          <CardHeader>
            <CardTitle className="text-[#1E3A8A]">Información del Usuario</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Nombre Completo</p>
              <p className="font-medium text-gray-900">{userName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Email</p>
              <p className="font-medium text-gray-900">{session.user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Rol</p>
              <p className="font-medium text-gray-900">
                {userRole === "admin" ? "Administrador" : userRole === "doctor" ? "Médico" : "Secretaria"}
              </p>
            </div>
            {userRole === "doctor" && (
              <>
                {session.user.speciality && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Especialidad</p>
                    <p className="font-medium text-gray-900">{session.user.speciality}</p>
                  </div>
                )}
                {session.user.licenseNumber && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Número de Senecyt</p>
                    <p className="font-medium text-gray-900">{session.user.licenseNumber}</p>
                  </div>
                )}
              </>
            )}
            {session.user.department && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Departamento</p>
                <p className="font-medium text-gray-900">{session.user.department}</p>
              </div>
            )}
            {session.user.phone && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Teléfono</p>
                <p className="font-medium text-gray-900">{session.user.phone}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Pacientes */}
          <Link href="/dashboard/pacientes">
            <Card className="hover:shadow-lg transition-shadow border-none shadow-md cursor-pointer">
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
          </Link>

          {/* Citas */}
          <Link href="/dashboard/citas">
            <Card className="hover:shadow-lg transition-shadow border-none shadow-md cursor-pointer">
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
          </Link>

          {/* Procedimientos */}
          {(userRole === "admin" || userRole === "doctor") && (
            <Link href="/dashboard/procedimientos">
              <Card className="hover:shadow-lg transition-shadow border-none shadow-md cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#1E3A8A]/10 rounded-full flex items-center justify-center">
                      <FileText className="w-6 h-6 text-[#1E3A8A]" />
                    </div>
                    <div>
                      <CardTitle className="text-[#1E3A8A]">Procedimientos</CardTitle>
                      <CardDescription>Informes de procedimientos</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-gray-900 mb-2">0</p>
                  <p className="text-sm text-gray-500">Procedimientos realizados</p>
                </CardContent>
              </Card>
            </Link>
          )}

          {/* Historia Clínica */}
          {(userRole === "admin" || userRole === "doctor") && (
            <Link href="/dashboard/historia-clinica">
              <Card className="hover:shadow-lg transition-shadow border-none shadow-md cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#E11D48]/10 rounded-full flex items-center justify-center">
                      <ClipboardList className="w-6 h-6 text-[#E11D48]" />
                    </div>
                    <div>
                      <CardTitle className="text-[#1E3A8A]">Historia Clínica</CardTitle>
                      <CardDescription>Registros médicos</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-gray-900 mb-2">0</p>
                  <p className="text-sm text-gray-500">Historias clínicas registradas</p>
                </CardContent>
              </Card>
            </Link>
          )}

          {/* Administración - Solo para Admin */}
          {userRole === "admin" && (
            <>
              <Link href="/dashboard/usuarios">
                <Card className="hover:shadow-lg transition-shadow border-none shadow-md cursor-pointer">
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
                    <p className="text-3xl font-bold text-gray-900 mb-2">{userCount}</p>
                    <p className="text-sm text-gray-500">Usuarios activos en el sistema</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/dashboard/configuracion">
                <Card className="hover:shadow-lg transition-shadow border-none shadow-md cursor-pointer">
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
              </Link>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
