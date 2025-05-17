import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Stethoscope, Award, BookOpen } from "lucide-react"

export function AboutUs() {
  const doctors = [
    {
      name: "Dra. María Rodríguez",
      specialty: "Cardiología Clínica",
      image: "/placeholder.svg?height=300&width=300",
      description:
        "Especialista con más de 15 años de experiencia en diagnóstico y tratamiento de enfermedades cardiovasculares.",
    },
    {
      name: "Dr. Carlos Mendoza",
      specialty: "Electrofisiología Cardíaca",
      image: "/placeholder.svg?height=300&width=300",
      description: "Experto en arritmias cardíacas y procedimientos de ablación con catéter.",
    },
    {
      name: "Dra. Ana Gómez",
      specialty: "Cardiología Intervencionista",
      image: "/placeholder.svg?height=300&width=300",
      description: "Especializada en angioplastias coronarias y procedimientos estructurales cardíacos.",
    },
    {
      name: "Dr. Javier Morales",
      specialty: "Ecocardiografía",
      image: "/placeholder.svg?height=300&width=300",
      description: "Especialista en técnicas de imagen cardíaca avanzada y diagnóstico no invasivo.",
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-rose-700">
              Sobre Nosotros
            </h1>
            <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Cardionova es un centro médico especializado en cardiología, comprometido con brindar atención de calidad
              y personalizada a cada paciente.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-rose-50">
            <Stethoscope className="h-12 w-12 text-rose-600" />
            <h3 className="text-xl font-bold">Experiencia</h3>
            <p className="text-center text-gray-600">
              Más de 15 años brindando atención cardiovascular de excelencia a nuestros pacientes.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-rose-50">
            <Award className="h-12 w-12 text-rose-600" />
            <h3 className="text-xl font-bold">Calidad</h3>
            <p className="text-center text-gray-600">
              Contamos con certificaciones internacionales y los más altos estándares de calidad.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-rose-50">
            <BookOpen className="h-12 w-12 text-rose-600" />
            <h3 className="text-xl font-bold">Innovación</h3>
            <p className="text-center text-gray-600">
              Tecnología de vanguardia y constante actualización en técnicas y tratamientos.
            </p>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-2xl font-bold mb-8 text-center text-rose-700">Nuestra Historia</h2>
          <div className="bg-rose-50 p-8 rounded-lg">
            <p className="text-gray-600 mb-4">
              Cardionova nació en 2008 con la visión de ofrecer atención cardiológica de excelencia, combinando la
              experiencia médica con la tecnología más avanzada. Desde entonces, hemos crecido hasta convertirnos en un
              centro de referencia en salud cardiovascular.
            </p>
            <p className="text-gray-600 mb-4">
              Nuestro compromiso con la calidad y la atención personalizada nos ha permitido ganar la confianza de miles
              de pacientes que han encontrado en Cardionova una solución integral a sus necesidades de salud cardíaca.
            </p>
            <p className="text-gray-600">
              Hoy, continuamos innovando y expandiendo nuestros servicios para ofrecer la mejor atención cardiológica,
              siempre con el paciente como centro de nuestro trabajo.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-20 mb-8 text-center text-rose-700">Nuestro Equipo Médico</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.map((doctor, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="aspect-square relative">
                <Image src={doctor.image || "/placeholder.svg"} alt={doctor.name} fill className="object-cover" />
              </div>
              <CardContent className="p-4">
                <h4 className="font-bold">{doctor.name}</h4>
                <p className="text-sm text-rose-600 font-medium">{doctor.specialty}</p>
                <p className="text-sm text-gray-600 mt-2">{doctor.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
