import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Award, Users, Heart } from "lucide-react"

export const metadata = {
  title: "Nosotros - Cardionova",
  description: "Conoce a nuestro equipo médico especializado en cardiología y nuestra historia.",
}

export default function NosotrosPage() {
  const doctors = [
    {
      name: "Dra. María Rodríguez",
      specialty: "Cardiología Clínica",
      image: "/placeholder.svg?height=300&width=300",
      description:
        "Especialista con más de 15 años de experiencia en diagnóstico y tratamiento de enfermedades cardiovasculares.",
      education: "Universidad Nacional de Medicina",
      certifications: ["Board Certified en Cardiología", "Fellow del Colegio Americano de Cardiología"],
    },
    {
      name: "Dr. Carlos Mendoza",
      specialty: "Electrofisiología Cardíaca",
      image: "/placeholder.svg?height=300&width=300",
      description: "Experto en arritmias cardíacas y procedimientos de ablación con catéter.",
      education: "Universidad Central de Medicina",
      certifications: ["Especialista en Electrofisiología", "Miembro de la Sociedad Latinoamericana de Cardiología"],
    },
    {
      name: "Dra. Ana Gómez",
      specialty: "Cardiología Intervencionista",
      image: "/placeholder.svg?height=300&width=300",
      description: "Especializada en angioplastias coronarias y procedimientos estructurales cardíacos.",
      education: "Universidad Internacional de Ciencias Médicas",
      certifications: ["Especialista en Cardiología Intervencionista", "Miembro de la Asociación de Cardiología"],
    },
    {
      name: "Dr. Javier Morales",
      specialty: "Ecocardiografía",
      image: "/placeholder.svg?height=300&width=300",
      description: "Especialista en técnicas de imagen cardíaca avanzada y diagnóstico no invasivo.",
      education: "Universidad Metropolitana de Medicina",
      certifications: ["Certificado en Ecocardiografía Avanzada", "Miembro de la Sociedad de Imagen Cardíaca"],
    },
  ]

  const milestones = [
    {
      year: "2008",
      title: "Fundación de Cardionova",
      description: "Apertura del primer centro especializado en cardiología con tecnología de vanguardia.",
    },
    {
      year: "2012",
      title: "Expansión de Servicios",
      description: "Incorporación de nuevas especialidades y tecnologías para diagnóstico y tratamiento.",
    },
    {
      year: "2015",
      title: "Certificación Internacional",
      description: "Obtención de certificaciones internacionales de calidad en atención médica.",
    },
    {
      year: "2018",
      title: "Centro de Excelencia",
      description: "Reconocimiento como centro de excelencia en cardiología a nivel nacional.",
    },
    {
      year: "2022",
      title: "Innovación Tecnológica",
      description: "Implementación de las últimas tecnologías en diagnóstico y tratamiento cardiovascular.",
    },
  ]

  return (
    <div className="bg-white">
      {/* Encabezado de la página */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-cardionova-blue mb-4">Sobre Nosotros</h1>
            <p className="text-lg text-gray-600">
              Cardionova es un centro médico especializado en cardiología, comprometido con brindar atención de calidad
              y personalizada a cada paciente.
            </p>
          </div>
        </div>
      </div>

      {/* Sección de introducción con imagen */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl font-bold text-cardionova-blue mb-6">Excelencia en Salud Cardiovascular</h2>
            <p className="text-gray-700 mb-4">
              En Cardionova, nos dedicamos a ofrecer la más alta calidad en atención cardiovascular, combinando la
              experiencia de nuestros especialistas con tecnología de vanguardia y un enfoque centrado en el paciente.
            </p>
            <p className="text-gray-700 mb-6">
              Nuestro compromiso es proporcionar diagnósticos precisos, tratamientos efectivos y un seguimiento
              personalizado para cada uno de nuestros pacientes, garantizando los mejores resultados posibles en su
              salud cardíaca.
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-cardionova-red mr-3 flex-shrink-0" />
                <p className="text-gray-700">Atención médica personalizada y de alta calidad</p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-cardionova-red mr-3 flex-shrink-0" />
                <p className="text-gray-700">Equipo médico altamente especializado y con amplia experiencia</p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-cardionova-red mr-3 flex-shrink-0" />
                <p className="text-gray-700">Tecnología de vanguardia para diagnósticos precisos</p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-cardionova-red mr-3 flex-shrink-0" />
                <p className="text-gray-700">Instalaciones modernas y confortables para nuestros pacientes</p>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2 relative h-[400px] rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/placeholder.svg?height=400&width=600"
              alt="Cardionova - Centro de Cardiología"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Nuestra Historia - Línea de tiempo */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-cardionova-blue">Nuestra Historia</h2>

          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex mb-8 last:mb-0">
                <div className="flex flex-col items-center mr-6">
                  <div className="bg-cardionova-red text-white font-bold rounded-full w-16 h-16 flex items-center justify-center">
                    {milestone.year}
                  </div>
                  {index < milestones.length - 1 && <div className="h-full w-0.5 bg-gray-300 my-2"></div>}
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm flex-1">
                  <h3 className="text-xl font-bold text-cardionova-blue mb-2">{milestone.title}</h3>
                  <p className="text-gray-700">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="bg-gray-50 p-8 rounded-lg shadow-sm flex flex-col items-center text-center">
            <div className="bg-white p-4 rounded-full mb-6">
              <Heart className="h-12 w-12 text-cardionova-red" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-cardionova-blue">Misión</h3>
            <p className="text-gray-700">
              Brindar atención cardiovascular de excelencia, centrada en el paciente, con un enfoque integral y
              humanizado, utilizando la más avanzada tecnología y los mejores profesionales para mejorar la calidad de
              vida de nuestros pacientes.
            </p>
          </div>
          <div className="bg-gray-50 p-8 rounded-lg shadow-sm flex flex-col items-center text-center">
            <div className="bg-white p-4 rounded-full mb-6">
              <Award className="h-12 w-12 text-cardionova-red" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-cardionova-blue">Visión</h3>
            <p className="text-gray-700">
              Ser reconocidos como el centro de referencia en salud cardiovascular, destacándonos por la excelencia
              médica, la innovación constante y el compromiso con el bienestar de nuestros pacientes y la comunidad.
            </p>
          </div>
        </div>
      </section>

      {/* Equipo Médico */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-cardionova-blue mb-4">Nuestro Equipo Médico</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Contamos con un equipo de especialistas altamente calificados y con amplia experiencia en todas las áreas
              de la cardiología.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {doctors.map((doctor, index) => (
              <Card key={index} className="overflow-hidden border-gray-200 transition-all hover:shadow-md">
                <div className="aspect-square relative">
                  <Image src={doctor.image || "/placeholder.svg"} alt={doctor.name} fill className="object-cover" />
                </div>
                <CardContent className="p-6">
                  <h4 className="text-xl font-bold text-cardionova-blue">{doctor.name}</h4>
                  <p className="text-cardionova-red font-medium mb-3">{doctor.specialty}</p>
                  <p className="text-gray-700 mb-3">{doctor.description}</p>
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Formación:</span> {doctor.education}
                    </p>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Certificaciones:</span>
                      <ul className="mt-1 space-y-1">
                        {doctor.certifications.map((cert, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-cardionova-red mr-2 text-xs">•</span>
                            <span>{cert}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-16 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-cardionova-blue mb-4">Nuestros Valores</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Estos principios guían nuestro trabajo diario y nuestro compromiso con la salud cardiovascular.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm text-center">
            <div className="bg-white p-3 rounded-full inline-flex mb-4">
              <Heart className="h-8 w-8 text-cardionova-red" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-cardionova-blue">Excelencia</h3>
            <p className="text-gray-700">
              Buscamos la perfección en cada aspecto de nuestro trabajo, desde la atención al paciente hasta los
              procedimientos médicos.
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm text-center">
            <div className="bg-white p-3 rounded-full inline-flex mb-4">
              <Users className="h-8 w-8 text-cardionova-red" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-cardionova-blue">Compromiso</h3>
            <p className="text-gray-700">
              Nos dedicamos completamente a la salud y bienestar de nuestros pacientes, siendo su mejor aliado en el
              cuidado cardiovascular.
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm text-center">
            <div className="bg-white p-3 rounded-full inline-flex mb-4">
              <Award className="h-8 w-8 text-cardionova-red" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-cardionova-blue">Innovación</h3>
            <p className="text-gray-700">
              Incorporamos constantemente nuevas tecnologías y métodos para ofrecer los tratamientos más avanzados y
              efectivos.
            </p>
          </div>
        </div>
      </section>

      {/* Llamado a la acción */}
      <section className="bg-cardionova-blue py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Confía tu salud cardiovascular a los mejores especialistas
          </h2>
          <p className="text-xl text-gray-100 mb-8 max-w-3xl mx-auto">
            En Cardionova estamos comprometidos con tu bienestar. Agenda una cita hoy mismo y da el primer paso hacia un
            corazón más saludable.
          </p>
          <a
            href="/contacto"
            className="inline-block bg-white text-cardionova-blue hover:bg-gray-100 font-medium py-3 px-8 rounded-md transition-colors"
          >
            Agendar Cita
          </a>
        </div>
      </section>
    </div>
  )
}
