import Image from "next/image";
import Link from "next/link";
import { PublicNavbar } from "@/components/public-navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Heart, Activity, Stethoscope, Radio, TrendingUp, Users, Check, Zap, Shield } from "lucide-react";

export default function ServiciosPage() {
  const mainServices = [
    {
      title: "Consulta Cardiológica",
      description: "Evaluación integral por especialistas en cardiología, incluyendo historial médico, examen físico y recomendaciones personalizadas.",
      price: "Desde $150",
      benefits: [
        "Evaluación completa de su salud cardiovascular",
        "Diagnóstico preciso por especialistas certificados",
        "Plan de tratamiento personalizado",
        "Seguimiento continuo de su progreso"
      ]
    },
    {
      title: "Electrocardiograma",
      description: "Registro de la actividad eléctrica del corazón para detectar arritmias, daño cardíaco y otras condiciones.",
      price: "Desde $80",
      benefits: [
        "Procedimiento rápido y no invasivo",
        "Resultados inmediatos",
        "Detección temprana de problemas cardíacos",
        "Interpretación por especialistas certificados"
      ]
    },
    {
      title: "Ecocardiograma",
      description: "Estudio por ultrasonido que permite visualizar la estructura y función del corazón en tiempo real.",
      price: "Desde $200",
      benefits: [
        "Visualización detallada de la estructura cardíaca",
        "Evaluación del funcionamiento de válvulas y cámaras",
        "Procedimiento no invasivo y sin radiación",
        "Imágenes de alta resolución para diagnósticos precisos"
      ]
    }
  ];

  const additionalServices = [
    {
      title: "Prueba de Esfuerzo",
      description: "Evaluación de la respuesta cardíaca durante el ejercicio para detectar enfermedad coronaria y determinar capacidad funcional."
    },
    {
      title: "Holter de Ritmo",
      description: "Monitoreo continuo del ritmo cardíaco durante 24-48 horas para detectar arritmias y evaluar síntomas."
    },
    {
      title: "Monitoreo Ambulatorio de Presión Arterial",
      description: "Registro de la presión arterial durante 24 horas para diagnosticar hipertensión y evaluar la efectividad del tratamiento."
    }
  ];

  const packages = [
    {
      name: "Paquete Básico",
      price: "$250",
      popular: false,
      includes: [
        "Consulta cardiológica",
        "Electrocardiograma",
        "Perfil lipídico",
        "Evaluación de riesgo cardiovascular"
      ]
    },
    {
      name: "Paquete Completo",
      price: "$450",
      popular: true,
      includes: [
        "Consulta cardiológica",
        "Electrocardiograma",
        "Ecocardiograma",
        "Prueba de esfuerzo",
        "Perfil lipídico completo",
        "Plan de prevención personalizado"
      ]
    },
    {
      name: "Paquete Premium",
      price: "$650",
      popular: false,
      includes: [
        "Todo lo incluido en el paquete completo",
        "Holter de ritmo 24 horas",
        "Monitoreo ambulatorio de presión",
        "Evaluación nutricional especializada",
        "Seguimiento por 3 meses"
      ]
    }
  ];

  const testimonials = [
    {
      name: "Juan Martínez",
      initials: "JM",
      role: "Paciente de Cardionova",
      comment: "La atención en Cardionova fue excepcional. El Dr. Mendoza me explicó detalladamente mi condición y las opciones de tratamiento. Gracias a su profesionalismo, hoy puedo llevar una vida normal."
    },
    {
      name: "Laura Rodríguez",
      initials: "LR",
      role: "Paciente de Cardionova",
      comment: "El paquete de prevención me permitió detectar un problema cardíaco a tiempo. El equipo médico fue muy profesional y me brindó un tratamiento efectivo. Recomiendo ampliamente sus servicios."
    },
    {
      name: "Carlos Pérez",
      initials: "CP",
      role: "Paciente de Cardionova",
      comment: "Después de mi procedimiento de angioplastia, el seguimiento ha sido impecable. La Dra. Gómez y su equipo están siempre disponibles para resolver mis dudas. Me siento en excelentes manos."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1E3A8A] mb-4">
            Nuestros Servicios
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            En Cardionova ofrecemos una amplia gama de servicios especializados
            para el diagnóstico, tratamiento y prevención de enfermedades
            cardiovasculares, siempre con la más alta calidad y tecnología de
            vanguardia.
          </p>
        </div>
      </section>

      {/* Main Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A8A] mb-4">
              Servicios Principales
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Ofrecemos servicios cardiológicos completos con la más alta calidad
              y tecnología de vanguardia para el cuidado integral de su salud
              cardiovascular.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mainServices.map((service, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow border-2 border-gray-100">
                <CardHeader>
                  <div className="w-16 h-16 bg-[#E11D48]/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Heart className="w-8 h-8 text-[#E11D48]" />
                  </div>
                  <CardTitle className="text-2xl text-[#1E3A8A] text-center">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-center">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-semibold text-gray-700 mb-3">Beneficios:</p>
                    <ul className="space-y-2">
                      {service.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <Check className="w-4 h-4 text-[#E11D48] mt-0.5 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-2xl font-bold text-[#1E3A8A] text-center">
                      {service.price}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A8A] mb-4">
              Servicios Adicionales
            </h2>
            <p className="text-lg text-gray-600">
              Complementamos nuestra oferta con servicios especializados para un
              diagnóstico completo y preciso.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {additionalServices.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-[#E11D48]/10 rounded-full mb-3 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-[#E11D48]" />
                  </div>
                  <CardTitle className="text-xl text-[#1E3A8A]">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Specialized Treatments */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A8A] mb-4">
              Tratamientos Especializados
            </h2>
            <p className="text-lg text-gray-600">
              Contamos con tratamientos avanzados para abordar condiciones
              cardiovasculares complejas con los mejores resultados.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 border-[#1E3A8A]/20">
              <CardHeader>
                <CardTitle className="text-2xl text-[#1E3A8A]">
                  Cardiología Intervencionista
                </CardTitle>
                <CardDescription>
                  Procedimientos mínimamente invasivos para tratar enfermedades
                  cardiovasculares sin necesidad de cirugía abierta, reduciendo el
                  tiempo de recuperación y las complicaciones.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-semibold text-gray-700 mb-3">Procedimientos:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-[#E11D48] mt-0.5" />
                    <span>Angioplastia coronaria y colocación de stents</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-[#E11D48] mt-0.5" />
                    <span>Valvuloplastia con balón</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-[#E11D48] mt-0.5" />
                    <span>Cierre percutáneo de defectos cardíacos</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#1E3A8A]/20">
              <CardHeader>
                <CardTitle className="text-2xl text-[#1E3A8A]">
                  Electrofisiología
                </CardTitle>
                <CardDescription>
                  Diagnóstico y tratamiento de arritmias cardíacas mediante
                  técnicas avanzadas que permiten identificar y corregir
                  alteraciones en el sistema eléctrico del corazón.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-semibold text-gray-700 mb-3">Procedimientos:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-[#E11D48] mt-0.5" />
                    <span>Estudio electrofisiológico</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-[#E11D48] mt-0.5" />
                    <span>Ablación por radiofrecuencia</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-[#E11D48] mt-0.5" />
                    <span>Implante de marcapasos y desfibriladores</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A8A] mb-4">
              Tecnología de Vanguardia
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              En Cardionova contamos con la tecnología más avanzada para el
              diagnóstico y tratamiento de enfermedades cardiovasculares, lo que
              nos permite ofrecer a nuestros pacientes la mejor atención posible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="text-center border-none shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-[#E11D48]/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-[#E11D48]" />
                </div>
                <CardTitle className="text-xl text-[#1E3A8A]">
                  Equipos de última generación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Contamos con la tecnología más avanzada para diagnósticos
                  precisos y tratamientos efectivos.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-none shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-[#E11D48]/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-[#E11D48]" />
                </div>
                <CardTitle className="text-xl text-[#1E3A8A]">
                  Procedimientos mínimamente invasivos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Utilizamos técnicas que minimizan el trauma quirúrgico y
                  aceleran la recuperación.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-none shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-[#E11D48]/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Activity className="w-8 h-8 text-[#E11D48]" />
                </div>
                <CardTitle className="text-xl text-[#1E3A8A]">
                  Monitoreo cardíaco avanzado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Sistemas de seguimiento que permiten evaluar la salud cardíaca
                  en tiempo real.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Technology Images Placeholder */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-video bg-gradient-to-br from-[#1E3A8A]/10 to-[#E11D48]/10 rounded-lg flex items-center justify-center">
                <p className="text-sm text-gray-500">Tecnología {i}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prevention Packages */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A8A] mb-4">
              Paquetes de Prevención
            </h2>
            <p className="text-lg text-gray-600">
              Ofrecemos paquetes completos para la prevención y detección temprana
              de enfermedades cardiovasculares.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packages.map((pkg, index) => (
              <Card key={index} className={`relative ${pkg.popular ? 'border-2 border-[#E11D48] shadow-xl' : 'border-2 border-gray-200'}`}>
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-[#E11D48] text-white px-4 py-1 rounded-full text-sm font-semibold">
                      MÁS POPULAR
                    </span>
                  </div>
                )}
                <CardHeader className="text-center pt-8">
                  <CardTitle className="text-2xl text-[#1E3A8A] mb-2">
                    {pkg.name}
                  </CardTitle>
                  <p className="text-4xl font-bold text-[#E11D48]">{pkg.price}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {pkg.includes.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-600">
                        <Check className="w-5 h-5 text-[#E11D48] mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A8A] mb-4">
              Lo que dicen nuestros pacientes
            </h2>
            <p className="text-lg text-gray-600">
              La satisfacción de nuestros pacientes es nuestro mayor logro. Conoce
              sus experiencias con nuestros servicios.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-none shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-[#1E3A8A] rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"{testimonial.comment}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-[#1E3A8A] to-[#1E3A8A]/90">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Listo para cuidar tu salud cardiovascular?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Agenda una cita hoy mismo y da el primer paso hacia un corazón más
            saludable. Nuestro equipo de especialistas está listo para atenderte.
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
                  <Link href="/" className="hover:text-white">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link href="/nosotros" className="hover:text-white">
                    Nosotros
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
