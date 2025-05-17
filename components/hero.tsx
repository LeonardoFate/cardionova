import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Hero() {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-cardionova-blue leading-tight">
                Cuidamos tu corazón con la mejor atención especializada
              </h1>
              <p className="text-lg text-gray-600">
                En Cardionova contamos con los mejores especialistas y la tecnología más avanzada para el cuidado
                integral de tu salud cardiovascular.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contacto">
                <Button className="bg-cardionova-red hover:bg-cardionova-darkred text-white px-8 py-6 text-base">
                  Agendar Cita
                </Button>
              </Link>
              <Link href="/servicios">
                <Button
                  variant="outline"
                  className="border-cardionova-blue text-cardionova-blue hover:bg-gray-50 px-8 py-6 text-base"
                >
                  Nuestros Servicios
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[350px] w-[350px] sm:h-[400px] sm:w-[400px] lg:h-[500px] lg:w-[500px]">
              <Image
                src="/placeholder.svg?height=500&width=500"
                alt="Cardionova - Especialistas en cardiología"
                fill
                className="object-cover rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
