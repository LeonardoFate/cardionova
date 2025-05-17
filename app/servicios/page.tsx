import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Heart, Activity, Stethoscope, Clock, FileText, BarChart3, CheckCircle } from "lucide-react"

export const metadata = {
  title: "Servicios - Cardionova",
  description: "Explora nuestra amplia gama de servicios cardiológicos especializados.",
}

export default function ServiciosPage() {
  const mainServices = [
    {
      title: "Consulta Cardiológica",
      description:
        "Evaluación integral por especialistas en cardiología, incluyendo historial médico, examen físico y recomendaciones personalizadas.",
      icon: <Heart className="h-10 w-10 text-cardionova-red" />,
      image: "/placeholder.svg?height=400&width=600",
      benefits: [
        "Evaluación completa de su salud cardiovascular",
        "Diagnóstico preciso por especialistas certificados",
        "Plan de tratamiento personalizado",
        "Seguimiento continuo de su progreso",
      ],
      price: "Desde $150",
    },
    {
      title: "Electrocardiograma",
      description:
        "Registro de la actividad eléctrica del corazón para detectar arritmias, daño cardíaco y otras condiciones.",
      icon: <Activity className="h-10 w-10 text-cardionova-red" />,
      image: "/placeholder.svg?height=400&width=600",
      benefits: [
        "Procedimiento rápido y no invasivo",
        "Resultados inmediatos",
        "Detección temprana de problemas cardíacos",
        "Interpretación por especialistas certificados",
      ],
      price: "Desde $80",
    },
    {
      title: "Ecocardiograma",
      description: "Estudio por ultrasonido que permite visualizar la estructura y función del corazón en tiempo real.",
      icon: <Stethoscope className="h-10 w-10 text-cardionova-red" />,
      image: "/placeholder.svg?height=400&width=600",
      benefits: [
        "Visualización detallada de la estructura cardíaca",
        "Evaluación del funcionamiento de válvulas y cámaras",
        "Procedimiento no invasivo y sin radiación",
        "Imágenes de alta resolución para diagnósticos precisos",
      ],
      price: "Desde $200",
    },
  ]

  const additionalServices = [
    {
      title: "Prueba de Esfuerzo",
      description:
        "Evaluación de la respuesta cardíaca durante el ejercicio para detectar enfermedad coronaria y determinar capacidad funcional.",
      icon: <BarChart3 className="h-10 w-10 text-cardionova-red" />,
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      title: "Holter de Ritmo",
      description:
        "Monitoreo continuo del ritmo cardíaco durante 24-48 horas para detectar arritmias y evaluar síntomas.",
      icon: <FileText className="h-10 w-10 text-cardionova-red" />,
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      title: "Monitoreo Ambulatorio de Presión Arterial",
      description:
        "Registro de la presión arterial durante 24 horas para diagnosticar hipertensión y evaluar la efectividad del tratamiento.",
      icon: <Clock className="h-10 w-10 text-cardionova-red" />,
      image: "/placeholder.svg?height=300&width=400",
    },
  ]

  const specializedTreatments = [
    {
      title: "Cardiología Intervencionista",
      procedures: [
        "Angioplastia coronaria y colocación de stents",
        "Valvuloplastia con balón",
        "Cierre percutáneo de defectos cardíacos",
      ],
      image: "/placeholder.svg?height=500&width=800",
      description:
        "Procedimientos mínimamente invasivos para tratar enfermedades cardiovasculares sin necesidad de cirugía abierta, reduciendo el tiempo de recuperación y las complicaciones.",
    },
    {
      title: "Electrofisiología",
      procedures: [
        "Estudio electrofisiológico",
        "Ablación por radiofrecuencia",
        "Implante de marcapasos y desfibriladores",
      ],
      image: "/placeholder.svg?height=500&width=800",
      description:
        "Diagnóstico y tratamiento de arritmias cardíacas mediante técnicas avanzadas que permiten identificar y corregir alteraciones en el sistema eléctrico del corazón.",
    },
  ]

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px]">
        <div className="absolute inset-0">
          <Image
            src="/placeholder.svg?height=500&width=1200"
            alt="Servicios Cardionova"
            fill
            className="object-cover brightness-50"
          />
        </div>
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Nuestros Servicios</h1>
          <p className="text-xl text-white max-w-3xl">
            En Cardionova ofrecemos una amplia gama de servicios especializados para el diagnóstico, tratamiento y
            prevención de enfermedades cardiovasculares, siempre con la más alta calidad y tecnología de vanguardia.
          </p>
          <Link href="#consulta" className="mt-8">
            <Button className="bg-cardionova-red hover:bg-cardionova-darkred text-white px-8 py-6 text-lg">
              Conocer Servicios
            </Button>
          </Link>
        </div>
      </section>

      {/* Servicios Principales */}
      <section className="py-16 md:py-24 container mx-auto px-4" id="consulta">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-cardionova-blue mb-4">Servicios Principales</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ofrecemos servicios cardiológicos completos con la más alta calidad y tecnología de vanguardia para el
            cuidado integral de su salud cardiovascular.
          </p>
        </div>

        <div className="space-y-20">
          {mainServices.map((service, index) => (
            <div
              key={index}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-lg">
                <Image src={service.image || "/placeholder.svg"} alt={service.title} fill className="object-cover" />
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  {service.icon}
                  <h3 className="text-3xl font-bold text-cardionova-blue">{service.title}</h3>
                </div>
                <p className="text-lg text-gray-700">{service.description}</p>
                <div className="space-y-3">
                  <h4 className="text-xl font-semibold text-cardionova-blue">Beneficios:</h4>
                  <ul className="space-y-2">
                    {service.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-cardionova-red mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-2xl font-bold text-cardionova-red">{service.price}</span>
                  <Link href="/contacto">
                    <Button className="bg-cardionova-red hover:bg-cardionova-darkred">Agendar Cita</Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Servicios Adicionales */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-cardionova-blue mb-4">Servicios Adicionales</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Complementamos nuestra oferta con servicios especializados para un diagnóstico completo y preciso.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {additionalServices.map((service, index) => (
              <Card key={index} className="border-gray-200 overflow-hidden transition-all hover:shadow-lg">
                <div className="relative h-[200px]">
                  <Image src={service.image || "/placeholder.svg"} alt={service.title} fill className="object-cover" />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3 mb-2">
                    {service.icon}
                    <CardTitle className="text-xl text-cardionova-blue">{service.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{service.description}</p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Link href="/contacto" className="w-full">
                    <Button className="w-full bg-cardionova-red hover:bg-cardionova-darkred">Más Información</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tratamientos Especializados */}
      <section className="py-16 md:py-24 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-cardionova-blue mb-4">Tratamientos Especializados</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Contamos con tratamientos avanzados para abordar condiciones cardiovasculares complejas con los mejores
            resultados.
          </p>
        </div>

        <div className="space-y-16">
          {specializedTreatments.map((treatment, index) => (
            <div key={index} className="bg-gray-50 rounded-lg overflow-hidden shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-[300px] lg:h-auto">
                  <Image
                    src={treatment.image || "/placeholder.svg"}
                    alt={treatment.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <h3 className="text-2xl font-bold text-cardionova-blue mb-4">{treatment.title}</h3>
                  <p className="text-gray-700 mb-6">{treatment.description}</p>
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-cardionova-blue">Procedimientos:</h4>
                    <ul className="space-y-2">
                      {treatment.procedures.map((procedure, i) => (
                        <li key={i} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-cardionova-red mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{procedure}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-8">
                    <Link href="/contacto">
                      <Button className="bg-cardionova-red hover:bg-cardionova-darkred">
                        Consultar Disponibilidad
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tecnología */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-cardionova-blue mb-4">Tecnología de Vanguardia</h2>
              <p className="text-lg text-gray-700">
                En Cardionova contamos con la tecnología más avanzada para el diagnóstico y tratamiento de enfermedades
                cardiovasculares, lo que nos permite ofrecer a nuestros pacientes la mejor atención posible.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-cardionova-red mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-cardionova-blue">Equipos de última generación</h4>
                    <p className="text-gray-700">
                      Contamos con la tecnología más avanzada para diagnósticos precisos y tratamientos efectivos.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-cardionova-red mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-cardionova-blue">Procedimientos mínimamente invasivos</h4>
                    <p className="text-gray-700">
                      Utilizamos técnicas que minimizan el trauma quirúrgico y aceleran la recuperación.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-cardionova-red mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-cardionova-blue">Monitoreo cardíaco avanzado</h4>
                    <p className="text-gray-700">
                      Sistemas de seguimiento que permiten evaluar la salud cardíaca en tiempo real.
                    </p>
                  </div>
                </li>
              </ul>
              <div className="pt-4">
                <Link href="/contacto">
                  <Button className="bg-cardionova-red hover:bg-cardionova-darkred">Conocer Más</Button>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative h-[200px] rounded-lg overflow-hidden shadow-md">
                <Image src="/placeholder.svg?height=200&width=300" alt="Tecnología 1" fill className="object-cover" />
              </div>
              <div className="relative h-[200px] rounded-lg overflow-hidden shadow-md">
                <Image src="/placeholder.svg?height=200&width=300" alt="Tecnología 2" fill className="object-cover" />
              </div>
              <div className="relative h-[200px] rounded-lg overflow-hidden shadow-md">
                <Image src="/placeholder.svg?height=200&width=300" alt="Tecnología 3" fill className="object-cover" />
              </div>
              <div className="relative h-[200px] rounded-lg overflow-hidden shadow-md">
                <Image src="/placeholder.svg?height=200&width=300" alt="Tecnología 4" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Paquetes de Prevención */}
      <section className="py-16 md:py-24 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-cardionova-blue mb-4">Paquetes de Prevención</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ofrecemos paquetes completos para la prevención y detección temprana de enfermedades cardiovasculares.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-gray-200 transition-all hover:shadow-lg">
            <CardHeader className="text-center bg-gray-50 pb-6">
              <CardTitle className="text-2xl text-cardionova-blue">Paquete Básico</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold text-cardionova-red">$250</span>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-cardionova-red mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Consulta cardiológica</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-cardionova-red mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Electrocardiograma</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-cardionova-red mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Perfil lipídico</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-cardionova-red mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Evaluación de riesgo cardiovascular</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-0">
              <Link href="/contacto" className="w-full">
                <Button className="w-full bg-cardionova-red hover:bg-cardionova-darkred">Agendar Ahora</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="border-cardionova-red transition-all hover:shadow-lg relative">
            <div className="absolute top-0 left-0 right-0 bg-cardionova-red text-white text-center py-1 text-sm font-bold">
              MÁS POPULAR
            </div>
            <CardHeader className="text-center bg-gray-50 pb-6 pt-8">
              <CardTitle className="text-2xl text-cardionova-blue">Paquete Completo</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold text-cardionova-red">$450</span>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-cardionova-red mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Consulta cardiológica</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-cardionova-red mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Electrocardiograma</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-cardionova-red mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Ecocardiograma</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-cardionova-red mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Prueba de esfuerzo</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-cardionova-red mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Perfil lipídico completo</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-cardionova-red mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Plan de prevención personalizado</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-0">
              <Link href="/contacto" className="w-full">
                <Button className="w-full bg-cardionova-red hover:bg-cardionova-darkred">Agendar Ahora</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="border-gray-200 transition-all hover:shadow-lg">
            <CardHeader className="text-center bg-gray-50 pb-6">
              <CardTitle className="text-2xl text-cardionova-blue">Paquete Premium</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold text-cardionova-red">$650</span>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-cardionova-red mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Todo lo incluido en el paquete completo</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-cardionova-red mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Holter de ritmo 24 horas</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-cardionova-red mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Monitoreo ambulatorio de presión</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-cardionova-red mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Evaluación nutricional especializada</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-cardionova-red mr-2 flex-shrink-0" />
                  <span className="text-gray-700">Seguimiento por 3 meses</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-0">
              <Link href="/contacto" className="w-full">
                <Button className="w-full bg-cardionova-red hover:bg-cardionova-darkred">Agendar Ahora</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Testimonios */}
      <section className="bg-cardionova-blue py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Lo que dicen nuestros pacientes</h2>
            <p className="text-xl text-gray-100 max-w-3xl mx-auto">
              La satisfacción de nuestros pacientes es nuestro mayor logro. Conoce sus experiencias con nuestros
              servicios.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xl font-bold text-cardionova-blue">JM</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-cardionova-blue">Juan Martínez</h4>
                  <p className="text-sm text-gray-600">Paciente de Cardionova</p>
                </div>
              </div>
              <p className="text-gray-700">
                "La atención en Cardionova fue excepcional. El Dr. Mendoza me explicó detalladamente mi condición y las
                opciones de tratamiento. Gracias a su profesionalismo, hoy puedo llevar una vida normal."
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xl font-bold text-cardionova-blue">LR</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-cardionova-blue">Laura Rodríguez</h4>
                  <p className="text-sm text-gray-600">Paciente de Cardionova</p>
                </div>
              </div>
              <p className="text-gray-700">
                "El paquete de prevención me permitió detectar un problema cardíaco a tiempo. El equipo médico fue muy
                profesional y me brindó un tratamiento efectivo. Recomiendo ampliamente sus servicios."
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xl font-bold text-cardionova-blue">CP</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-cardionova-blue">Carlos Pérez</h4>
                  <p className="text-sm text-gray-600">Paciente de Cardionova</p>
                </div>
              </div>
              <p className="text-gray-700">
                "Después de mi procedimiento de angioplastia, el seguimiento ha sido impecable. La Dra. Gómez y su
                equipo están siempre disponibles para resolver mis dudas. Me siento en excelentes manos."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Llamado a la acción */}
      <section className="py-16 md:py-24 container mx-auto px-4">
        <div className="bg-gray-50 rounded-lg p-8 md:p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-cardionova-blue mb-6">
            ¿Listo para cuidar tu salud cardiovascular?
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            Agenda una cita hoy mismo y da el primer paso hacia un corazón más saludable. Nuestro equipo de
            especialistas está listo para atenderte.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contacto">
              <Button className="bg-cardionova-red hover:bg-cardionova-darkred text-white px-8 py-6 text-lg">
                Agendar Cita
              </Button>
            </Link>
            <Link href="tel:+5411456789">
              <Button
                variant="outline"
                className="border-cardionova-blue text-cardionova-blue hover:bg-gray-100 px-8 py-6 text-lg"
              >
                Llamar Ahora
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
