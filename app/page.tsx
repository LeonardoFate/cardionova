import { Hero } from "@/components/hero"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Activity, Stethoscope, Award, Clock, Shield } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <div>
      <Hero />

      {/* Sección de características destacadas */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-cardionova-blue mb-4">¿Por qué elegirnos?</h2>
            <p className="text-lg text-gray-600">
              En Cardionova nos dedicamos a brindar la mejor atención cardiovascular con un enfoque personalizado.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-8 text-center transition-all hover:shadow-md">
              <div className="flex justify-center mb-4">
                <Stethoscope className="h-12 w-12 text-cardionova-red" />
              </div>
              <h3 className="text-xl font-bold text-cardionova-blue mb-3">Experiencia</h3>
              <p className="text-gray-600">
                Más de 15 años brindando atención cardiovascular de excelencia a nuestros pacientes.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-8 text-center transition-all hover:shadow-md">
              <div className="flex justify-center mb-4">
                <Award className="h-12 w-12 text-cardionova-red" />
              </div>
              <h3 className="text-xl font-bold text-cardionova-blue mb-3">Calidad</h3>
              <p className="text-gray-600">
                Contamos con certificaciones internacionales y los más altos estándares de calidad.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-8 text-center transition-all hover:shadow-md">
              <div className="flex justify-center mb-4">
                <Activity className="h-12 w-12 text-cardionova-red" />
              </div>
              <h3 className="text-xl font-bold text-cardionova-blue mb-3">Innovación</h3>
              <p className="text-gray-600">
                Tecnología de vanguardia y constante actualización en técnicas y tratamientos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de servicios destacados */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-cardionova-blue mb-4">Nuestros Servicios Destacados</h2>
            <p className="text-lg text-gray-600">
              Ofrecemos una amplia gama de servicios cardiológicos con tecnología de vanguardia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-gray-200 transition-all hover:shadow-md">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <Heart className="h-12 w-12 text-cardionova-red mb-4" />
                <h3 className="text-xl font-bold text-cardionova-blue mb-3">Consulta Cardiológica</h3>
                <p className="text-gray-600 mb-6">
                  Evaluación integral por especialistas en cardiología para diagnóstico y tratamiento personalizado.
                </p>
                <Link href="/servicios" className="text-cardionova-red hover:text-cardionova-darkred font-medium">
                  Conocer más
                </Link>
              </CardContent>
            </Card>

            <Card className="border-gray-200 transition-all hover:shadow-md">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <Activity className="h-12 w-12 text-cardionova-red mb-4" />
                <h3 className="text-xl font-bold text-cardionova-blue mb-3">Electrocardiograma</h3>
                <p className="text-gray-600 mb-6">
                  Registro de la actividad eléctrica del corazón para detectar arritmias y otras condiciones.
                </p>
                <Link href="/servicios" className="text-cardionova-red hover:text-cardionova-darkred font-medium">
                  Conocer más
                </Link>
              </CardContent>
            </Card>

            <Card className="border-gray-200 transition-all hover:shadow-md">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <Stethoscope className="h-12 w-12 text-cardionova-red mb-4" />
                <h3 className="text-xl font-bold text-cardionova-blue mb-3">Ecocardiograma</h3>
                <p className="text-gray-600 mb-6">
                  Estudio por ultrasonido que permite visualizar la estructura y función del corazón en tiempo real.
                </p>
                <Link href="/servicios" className="text-cardionova-red hover:text-cardionova-darkred font-medium">
                  Conocer más
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link href="/servicios">
              <Button className="bg-cardionova-red hover:bg-cardionova-darkred text-white px-8 py-6 text-base">
                Ver todos los servicios
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Sección de compromiso */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Compromiso con la salud cardiovascular"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-cardionova-blue">Nuestro Compromiso con tu Salud</h2>
              <p className="text-lg text-gray-600">
                En Cardionova, nos comprometemos a ofrecer la mejor atención cardiovascular, combinando experiencia
                médica, tecnología avanzada y un trato humano y cercano.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Shield className="h-6 w-6 text-cardionova-red mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-cardionova-blue">Atención Personalizada</h3>
                    <p className="text-gray-600">
                      Cada paciente recibe un plan de tratamiento adaptado a sus necesidades específicas.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="h-6 w-6 text-cardionova-red mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-cardionova-blue">Disponibilidad</h3>
                    <p className="text-gray-600">
                      Horarios flexibles y atención de urgencias para estar siempre a tu disposición.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Heart className="h-6 w-6 text-cardionova-red mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-cardionova-blue">Seguimiento Continuo</h3>
                    <p className="text-gray-600">
                      Acompañamiento durante todo el proceso de diagnóstico, tratamiento y recuperación.
                    </p>
                  </div>
                </div>
              </div>
              <Link href="/nosotros">
                <Button
                  variant="outline"
                  className="border-cardionova-blue text-cardionova-blue hover:bg-gray-50 px-8 py-6 text-base mt-4"
                >
                  Conocer más sobre nosotros
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de llamado a la acción */}
      <section className="py-16 md:py-24 bg-cardionova-blue">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Tu salud cardiovascular es nuestra prioridad
            </h2>
            <p className="text-xl text-gray-100 mb-8">
              Agenda una cita hoy mismo y da el primer paso hacia un corazón más saludable.
            </p>
            <Link href="/contacto">
              <Button className="bg-white text-cardionova-blue hover:bg-gray-100 px-8 py-6 text-base">
                Agendar Cita
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
