import Image from "next/image";
import Link from "next/link";
import { PublicNavbar } from "@/components/public-navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Award, Activity, Stethoscope, Medal, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1E3A8A] leading-tight">
                Cuidamos tu corazón con la mejor atención especializada
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                En Cardionova contamos con los mejores especialistas y la
                tecnología más avanzada para el cuidado integral de tu salud
                cardiovascular.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-[#E11D48] hover:bg-[#BE123C] text-white text-lg px-8 shadow-md"
                >
                  <Link href="/contacto">Agendar Cita</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-2 border-[#1E3A8A] bg-white text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white text-lg px-8 shadow-md"
                >
                  <Link href="/servicios">Nuestros Servicios</Link>
                </Button>
              </div>
            </div>

            {/* Hero Image */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md aspect-square">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A]/10 to-[#E11D48]/10 rounded-full"></div>
                <div className="absolute inset-8 bg-gradient-to-br from-[#1E3A8A]/20 to-[#E11D48]/20 rounded-full flex items-center justify-center">
                  <Heart className="w-48 h-48 text-[#E11D48]" strokeWidth={1.5} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A8A] mb-4">
              ¿Por qué elegirnos?
            </h2>
            <p className="text-lg text-gray-600">
              En Cardionova nos dedicamos a brindar la mejor atención
              cardiovascular con un enfoque personalizado.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Experience Card */}
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-[#E11D48]/10 rounded-full flex items-center justify-center">
                  <Stethoscope className="w-8 h-8 text-[#E11D48]" />
                </div>
                <CardTitle className="text-[#1E3A8A]">Experiencia</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-600">
                  Más de 15 años brindando atención cardiovascular de excelencia
                  a nuestros pacientes.
                </p>
              </CardContent>
            </Card>

            {/* Quality Card */}
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-[#E11D48]/10 rounded-full flex items-center justify-center">
                  <Medal className="w-8 h-8 text-[#E11D48]" />
                </div>
                <CardTitle className="text-[#1E3A8A]">Calidad</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-600">
                  Contamos con certificaciones internacionales y los más altos
                  estándares de calidad.
                </p>
              </CardContent>
            </Card>

            {/* Innovation Card */}
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-[#E11D48]/10 rounded-full flex items-center justify-center">
                  <Activity className="w-8 h-8 text-[#E11D48]" />
                </div>
                <CardTitle className="text-[#1E3A8A]">Innovación</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-600">
                  Tecnología de vanguardia y constante actualización en técnicas
                  y tratamientos.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A8A] mb-4">
              Nuestros Servicios Destacados
            </h2>
            <p className="text-lg text-gray-600">
              Ofrecemos una amplia gama de servicios cardiológicos con tecnología de vanguardia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-[#1E3A8A]">
                  Consulta Cardiológica
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Evaluación integral por especialistas en cardiología para diagnóstico y tratamiento personalizado.
                </p>
                <Link
                  href="/servicios"
                  className="text-[#E11D48] hover:underline font-medium"
                >
                  Conocer más →
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-[#1E3A8A]">Electrocardiograma</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Registro de la actividad eléctrica del corazón para detectar arritmias y otras condiciones.
                </p>
                <Link
                  href="/servicios"
                  className="text-[#E11D48] hover:underline font-medium"
                >
                  Conocer más →
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-[#1E3A8A]">Ecocardiograma</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Estudio por ultrasonido que permite visualizar la estructura y función del corazón en tiempo real.
                </p>
                <Link
                  href="/servicios"
                  className="text-[#E11D48] hover:underline font-medium"
                >
                  Conocer más →
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button
              asChild
              size="lg"
              className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white"
            >
              <Link href="/servicios">Ver todos los servicios</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Our Commitment Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image Placeholder */}
            <div className="order-2 lg:order-1">
              <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-[#1E3A8A]/20 to-[#E11D48]/20 rounded-2xl overflow-hidden shadow-lg">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Heart className="w-24 h-24 text-[#E11D48] mx-auto mb-4" strokeWidth={1.5} />
                    <p className="text-gray-500 text-sm">Imagen de compromiso</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2 space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A8A] mb-4">
                  Nuestro Compromiso con tu Salud
                </h2>
                <p className="text-lg text-gray-600">
                  En Cardionova, nos comprometemos a ofrecer la mejor atención
                  cardiovascular, combinando experiencia médica, tecnología
                  avanzada y un trato humano y cercano.
                </p>
              </div>

              <div className="space-y-6">
                {/* Atención Personalizada */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#E11D48]/10 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-[#E11D48]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#1E3A8A] mb-2">
                      Atención Personalizada
                    </h3>
                    <p className="text-gray-600">
                      Cada paciente recibe un plan de tratamiento adaptado a sus
                      necesidades específicas.
                    </p>
                  </div>
                </div>

                {/* Disponibilidad */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#E11D48]/10 rounded-full flex items-center justify-center">
                    <Activity className="w-6 h-6 text-[#E11D48]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#1E3A8A] mb-2">
                      Disponibilidad
                    </h3>
                    <p className="text-gray-600">
                      Horarios flexibles y atención de urgencias para estar
                      siempre a tu disposición.
                    </p>
                  </div>
                </div>

                {/* Seguimiento Continuo */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#E11D48]/10 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-[#E11D48]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#1E3A8A] mb-2">
                      Seguimiento Continuo
                    </h3>
                    <p className="text-gray-600">
                      Acompañamiento durante todo el proceso de diagnóstico,
                      tratamiento y recuperación.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <Link
                  href="/nosotros"
                  className="inline-flex items-center text-[#E11D48] hover:text-[#BE123C] font-semibold text-lg group"
                >
                  Conoce más sobre nosotros
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-[#1E3A8A] to-[#1E3A8A]/90">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Tu salud cardiovascular es nuestra prioridad
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Agenda tu cita hoy y comienza a cuidar tu corazón con los mejores
            especialistas
          </p>
          <Button
            asChild
            size="lg"
            className="bg-[#E11D48] hover:bg-[#BE123C] text-white text-lg px-12"
          >
            <Link href="/contacto">Agendar Cita Ahora</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Image
                  src="/logo.png"
                  alt="Cardionova Logo"
                  width={40}
                  height={40}
                  className="rounded"
                />
                <span className="text-xl font-bold">Cardionova</span>
              </div>
              <p className="text-gray-400">
                Cuidado cardiovascular especializado con tecnología de vanguardia
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Enlaces Rápidos</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/nosotros" className="hover:text-white">
                    Nosotros
                  </Link>
                </li>
                <li>
                  <Link href="/servicios" className="hover:text-white">
                    Servicios
                  </Link>
                </li>
                <li>
                  <Link href="/contacto" className="hover:text-white">
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Contacto</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Teléfono: (123) 456-7890</li>
                <li>Email: info@cardionova.com</li>
                <li>Horario: Lun - Vie 8:00 AM - 6:00 PM</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Cardionova. Todos los derechos reservados.</p>

          </div>
        </div>
      </footer>
    </div>
  );
}
