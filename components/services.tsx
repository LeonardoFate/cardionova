import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Heart, Stethoscope, Clipboard, Microscope, HeartPulse } from "lucide-react"

export function Services() {
  const services = [
    {
      title: "Consulta Cardiológica",
      description:
        "Evaluación integral por especialistas en cardiología para diagnóstico y tratamiento de enfermedades cardiovasculares.",
      icon: <Stethoscope className="h-10 w-10 text-rose-600" />,
    },
    {
      title: "Electrocardiograma",
      description:
        "Registro gráfico de la actividad eléctrica del corazón para detectar arritmias y otras alteraciones cardíacas.",
      icon: <Activity className="h-10 w-10 text-rose-600" />,
    },
    {
      title: "Ecocardiograma",
      description: "Estudio por ultrasonido que permite visualizar la estructura y función del corazón en tiempo real.",
      icon: <Heart className="h-10 w-10 text-rose-600" />,
    },
    {
      title: "Prueba de Esfuerzo",
      description:
        "Evaluación de la respuesta cardíaca durante el ejercicio para detectar enfermedad coronaria y evaluar capacidad funcional.",
      icon: <HeartPulse className="h-10 w-10 text-rose-600" />,
    },
    {
      title: "Holter de Ritmo",
      description:
        "Monitoreo continuo del ritmo cardíaco durante 24-48 horas para detectar arritmias y evaluar tratamientos.",
      icon: <Clipboard className="h-10 w-10 text-rose-600" />,
    },
    {
      title: "Análisis Cardiovascular",
      description:
        "Estudios de laboratorio especializados para evaluar factores de riesgo cardiovascular y optimizar tratamientos.",
      icon: <Microscope className="h-10 w-10 text-rose-600" />,
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-rose-700">
              Nuestros Servicios
            </h1>
            <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Ofrecemos una amplia gama de servicios cardiológicos con tecnología de vanguardia para el cuidado integral
              de tu salud cardiovascular.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {services.map((service, index) => (
            <Card key={index} className="border-rose-100">
              <CardHeader className="pb-2">
                <div className="mb-2">{service.icon}</div>
                <CardTitle className="text-xl text-rose-700">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">{service.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-20 bg-rose-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-6 text-center text-rose-700">Tecnología de Vanguardia</h2>
          <p className="text-gray-600 mb-4">
            En Cardionova contamos con equipos de última generación para el diagnóstico y tratamiento de enfermedades
            cardiovasculares. Nuestra tecnología nos permite ofrecer:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>Diagnósticos precisos y oportunos</li>
            <li>Tratamientos mínimamente invasivos</li>
            <li>Monitoreo continuo de la salud cardíaca</li>
            <li>Rehabilitación cardíaca personalizada</li>
            <li>Prevención efectiva de enfermedades cardiovasculares</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
