import Image from "next/image";
import Link from "next/link";
import { PublicNavbar } from "@/components/public-navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MedicalTeamCarousel } from "@/components/medical-team-carousel";
import { Heart, Award, TrendingUp, Users, Activity } from "lucide-react";

export default function NosotrosPage() {
  const doctors = [
    {
      name: "Dra. María Rodríguez",
      specialty: "Cardiología Clínica",
      description: "Especialista con más de 15 años de experiencia en diagnóstico y tratamiento de enfermedades cardiovasculares.",
      formation: "Universidad Nacional de Medicina",
      certifications: ["Board Certified en Cardiología", "Fellow del Colegio Americano de Cardiología"]
    },
    {
      name: "Dr. Carlos Mendoza",
      specialty: "Electrofisiología Cardíaca",
      description: "Experto en arritmias cardíacas y procedimientos de ablación con catéter.",
      formation: "Universidad Central de Medicina",
      certifications: ["Especialista en Electrofisiología", "Miembro de la Sociedad Latinoamericana de Cardiología"]
    },
    {
      name: "Dra. Ana Gómez",
      specialty: "Cardiología Intervencionista",
      description: "Especializada en angioplastias coronarias y procedimientos estructurales cardíacos.",
      formation: "Universidad Internacional de Ciencias Médicas",
      certifications: ["Especialista en Cardiología Intervencionista", "Miembro de la Asociación de Cardiología"]
    },
    {
      name: "Dr. Javier Morales",
      specialty: "Ecocardiografía",
      description: "Especialista en técnicas de imagen cardíaca avanzada y diagnóstico no invasivo.",
      formation: "Universidad Metropolitana de Medicina",
      certifications: ["Certificado en Ecocardiografía Avanzada", "Miembro de la Sociedad de Imagen Cardíaca"]
    },
    {
      name: "Dr. Roberto Sánchez",
      specialty: "Cardiología Pediátrica",
      description: "Especialista en cardiopatías congénitas y adquiridas en niños y adolescentes.",
      formation: "Universidad de Medicina Pediátrica",
      certifications: ["Especialista en Cardiología Pediátrica", "Miembro de la Sociedad de Cardiología Pediátrica"]
    },
    {
      name: "Dra. Luisa Martínez",
      specialty: "Cardiología Deportiva",
      description: "Experta en evaluación y tratamiento de deportistas de alto rendimiento.",
      formation: "Instituto de Medicina del Deporte",
      certifications: ["Diplomado en Medicina Deportiva", "Miembro de la Sociedad de Cardiología Deportiva"]
    },
    {
      name: "Dr. Eduardo Ramírez",
      specialty: "Rehabilitación Cardíaca",
      description: "Especializado en programas de rehabilitación post-infarto y cirugía cardiovascular.",
      formation: "Universidad Central de Ciencias Médicas",
      certifications: ["Especialista en Rehabilitación Cardíaca", "Doctor en Medicina Cardiovascular"]
    },
    {
      name: "Dra. Patricia Vega",
      specialty: "Cardio-Oncología",
      description: "Especialista en cuidado cardiovascular de pacientes oncológicos.",
      formation: "Universidad Internacional de Medicina",
      certifications: ["Fellowship en Cardio-Oncología", "Miembro de la Sociedad de Cardio-Oncología"]
    }
  ];

  const timeline = [
    { year: "2008", title: "Fundación de Cardionova", description: "Apertura del primer centro especializado en cardiología con tecnología de vanguardia." },
    { year: "2012", title: "Expansión de Servicios", description: "Incorporación de nuevas especialidades y tecnologías para diagnóstico y tratamiento." },
    { year: "2015", title: "Certificación Internacional", description: "Obtención de certificaciones internacionales de calidad en atención médica." },
    { year: "2018", title: "Centro de Excelencia", description: "Reconocimiento como centro de excelencia en cardiología a nivel nacional." },
    { year: "2022", title: "Innovación Tecnológica", description: "Implementación de las últimas tecnologías en diagnóstico y tratamiento cardiovascular." }
  ];

  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1E3A8A] mb-4">
            Sobre Nosotros
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Cardionova es un centro médico especializado en cardiología,
            comprometido con brindar atención de calidad y personalizada a cada
            paciente.
          </p>
        </div>
      </section>

      {/* Excellence Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image Placeholder */}
            <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-[#1E3A8A]/20 to-[#E11D48]/20 rounded-2xl overflow-hidden shadow-lg">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Heart className="w-24 h-24 text-[#E11D48] mx-auto mb-4" strokeWidth={1.5} />
                  <p className="text-gray-500 text-sm">Cardionova - Centro de Cardiología</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A8A]">
                Excelencia en Salud Cardiovascular
              </h2>
              <p className="text-gray-600 leading-relaxed">
                En Cardionova, nos dedicamos a ofrecer la más alta calidad en
                atención cardiovascular, combinando la experiencia de nuestros
                especialistas con tecnología de vanguardia y un enfoque centrado
                en el paciente.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Nuestro compromiso es proporcionar diagnósticos precisos,
                tratamientos efectivos y un seguimiento personalizado para cada
                uno de nuestros pacientes, garantizando los mejores resultados
                posibles en su salud cardíaca.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-[#E11D48] mt-1 flex-shrink-0" />
                  <p className="text-sm text-gray-600">
                    Atención médica personalizada y de alta calidad
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-[#E11D48] mt-1 flex-shrink-0" />
                  <p className="text-sm text-gray-600">
                    Equipo médico altamente especializado y con amplia experiencia
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Activity className="w-5 h-5 text-[#E11D48] mt-1 flex-shrink-0" />
                  <p className="text-sm text-gray-600">
                    Tecnología de vanguardia para diagnósticos precisos
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-[#E11D48] mt-1 flex-shrink-0" />
                  <p className="text-sm text-gray-600">
                    Instalaciones modernas y confortables para nuestros pacientes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A8A] mb-4">
              Nuestra Historia
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            {timeline.map((item, index) => (
              <div key={index} className="relative pl-8 pb-12 last:pb-0">
                {/* Timeline line */}
                {index !== timeline.length - 1 && (
                  <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-[#E11D48]/30"></div>
                )}

                {/* Timeline dot */}
                <div className="absolute left-0 top-0 w-6 h-6 bg-[#E11D48] rounded-full border-4 border-white shadow"></div>

                {/* Content */}
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-2xl font-bold text-[#E11D48]">{item.year}</span>
                    <h3 className="text-xl font-semibold text-[#1E3A8A]">{item.title}</h3>
                  </div>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-2 border-[#1E3A8A]/20">
              <CardHeader>
                <CardTitle className="text-2xl text-[#1E3A8A] flex items-center gap-3">
                  <Heart className="w-8 h-8 text-[#E11D48]" />
                  Misión
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Brindar atención cardiovascular de excelencia, centrada en el
                  paciente, con un enfoque integral y humanizado, utilizando la
                  más avanzada tecnología y los mejores profesionales para mejorar
                  la calidad de vida de nuestros pacientes.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#1E3A8A]/20">
              <CardHeader>
                <CardTitle className="text-2xl text-[#1E3A8A] flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-[#E11D48]" />
                  Visión
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Ser reconocidos como el centro de referencia en salud
                  cardiovascular, destacándonos por la excelencia médica, la
                  innovación constante y el compromiso con el bienestar de
                  nuestros pacientes y la comunidad.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Medical Team */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A8A] mb-4">
              Nuestro Equipo Médico
            </h2>
            <p className="text-lg text-gray-600">
              Contamos con un equipo de especialistas altamente calificados y con
              amplia experiencia en todas las áreas de la cardiología.
            </p>
          </div>

          <MedicalTeamCarousel doctors={doctors} />
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A8A] mb-4">
              Nuestros Valores
            </h2>
            <p className="text-lg text-gray-600">
              Estos principios guían nuestro trabajo diario y nuestro compromiso
              con la salud cardiovascular.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center border-none shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-[#E11D48]/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Award className="w-8 h-8 text-[#E11D48]" />
                </div>
                <CardTitle className="text-2xl text-[#1E3A8A]">
                  Excelencia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Buscamos la perfección en cada aspecto de nuestro trabajo, desde
                  la atención al paciente hasta los procedimientos médicos.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-none shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-[#E11D48]/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Heart className="w-8 h-8 text-[#E11D48]" />
                </div>
                <CardTitle className="text-2xl text-[#1E3A8A]">
                  Compromiso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Nos dedicamos completamente a la salud y bienestar de nuestros
                  pacientes, siendo su mejor aliado en el cuidado cardiovascular.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-none shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-[#E11D48]/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-[#E11D48]" />
                </div>
                <CardTitle className="text-2xl text-[#1E3A8A]">
                  Innovación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Incorporamos constantemente nuevas tecnologías y métodos para
                  ofrecer los tratamientos más avanzados y efectivos.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-[#1E3A8A] to-[#1E3A8A]/90">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Agenda tu cita con nuestros especialistas
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Estamos listos para cuidar de tu salud cardiovascular. Contáctanos hoy
            y comienza tu camino hacia un corazón más saludable.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-[#E11D48] hover:bg-[#BE123C] text-white text-lg px-12 shadow-lg"
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
                  <a href="/" className="hover:text-white">
                    Inicio
                  </a>
                </li>
                <li>
                  <a href="/servicios" className="hover:text-white">
                    Servicios
                  </a>
                </li>
                <li>
                  <a href="/contacto" className="hover:text-white">
                    Contacto
                  </a>
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
