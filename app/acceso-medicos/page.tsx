import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/components/login-form";

export default function AccesoMedicosPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <Image
            src="/logo.png"
            alt="Cardionova Logo"
            width={120}
            height={120}
            priority
            className="rounded-lg shadow-lg"
          />
          <div className="text-center">
            <h1 className="text-3xl font-bold text-[#1E3A8A] mb-2">
              Acceso Médicos
            </h1>
            <p className="text-gray-600">
              Portal exclusivo para profesionales de Cardionova
            </p>
          </div>
        </div>

        <LoginForm />

        {/* Patient Redirect Section */}
        <div className="border-t border-gray-200 pt-6">
          <p className="text-center text-gray-700 font-medium mb-3">
            ¿No eres personal médico?
          </p>
          <p className="text-center text-gray-600 text-sm">
            <Link href="/" className="text-[#1E3A8A] hover:text-[#E11D48] font-medium transition-colors">
              Volver a la página principal
            </Link>
            {" "}o{" "}
            <Link href="/contacto" className="text-[#E11D48] hover:text-[#BE123C] font-medium transition-colors">
              agenda tu cita como paciente
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
