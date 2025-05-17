import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react"

export function Contact() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-rose-700">Contacto</h1>
            <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Estamos aquí para atenderte. Contáctanos para agendar una cita o resolver cualquier duda.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <MapPin className="h-6 w-6 text-rose-600 mt-0.5" />
              <div>
                <h3 className="font-bold">Dirección</h3>
                <p className="text-gray-600">Av. Principal 123, Ciudad Médica, CP 12345</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Phone className="h-6 w-6 text-rose-600 mt-0.5" />
              <div>
                <h3 className="font-bold">Teléfono</h3>
                <p className="text-gray-600">+123 456 7890</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Mail className="h-6 w-6 text-rose-600 mt-0.5" />
              <div>
                <h3 className="font-bold">Correo Electrónico</h3>
                <p className="text-gray-600">contacto@cardionova.com</p>
              </div>
            </div>

            <div className="pt-4">
              <h3 className="font-bold mb-4">Síguenos en Redes Sociales</h3>
              <div className="flex space-x-4 justify-start">
                <a href="#" className="bg-rose-100 p-2 rounded-full hover:bg-rose-200 transition-colors">
                  <Facebook className="h-6 w-6 text-rose-600" />
                </a>
                <a href="#" className="bg-rose-100 p-2 rounded-full hover:bg-rose-200 transition-colors">
                  <Instagram className="h-6 w-6 text-rose-600" />
                </a>
                <a href="#" className="bg-rose-100 p-2 rounded-full hover:bg-rose-200 transition-colors">
                  <Twitter className="h-6 w-6 text-rose-600" />
                </a>
                <a href="#" className="bg-rose-100 p-2 rounded-full hover:bg-rose-200 transition-colors">
                  <Linkedin className="h-6 w-6 text-rose-600" />
                </a>
              </div>
            </div>

            <div className="mt-8 bg-rose-50 p-6 rounded-lg">
              <h3 className="font-bold mb-2">Horario de Atención</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Lunes a Viernes</span>
                  <span className="font-medium">8:00 AM - 7:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sábados</span>
                  <span className="font-medium">9:00 AM - 2:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Domingos</span>
                  <span className="font-medium">Cerrado</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-rose-50 p-6 rounded-lg">
            <h3 className="font-bold text-xl mb-4">Envíanos un Mensaje</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Nombre
                  </label>
                  <Input id="name" placeholder="Tu nombre" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Correo Electrónico
                  </label>
                  <Input id="email" type="email" placeholder="tu@email.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  Asunto
                </label>
                <Input id="subject" placeholder="Asunto de tu mensaje" />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Mensaje
                </label>
                <Textarea id="message" placeholder="Escribe tu mensaje aquí..." className="min-h-[120px]" />
              </div>
              <Button className="w-full bg-rose-600 hover:bg-rose-700">Enviar Mensaje</Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
