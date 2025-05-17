import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export const metadata = {
  title: "Contacto - Cardionova",
  description: "Contáctanos para agendar una cita o resolver cualquier duda sobre nuestros servicios.",
}

export default function ContactoPage() {
  return (
    <div className="bg-white">
      {/* Encabezado de la página */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-cardionova-blue mb-4">Contacto</h1>
            <p className="text-lg text-gray-600">
              Estamos aquí para atenderte. Contáctanos para agendar una cita o resolver cualquier duda.
            </p>
          </div>
        </div>
      </div>

      <div className="py-16 container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Formulario de contacto */}
          <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-cardionova-blue">Agenda tu Cita</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="nombre" className="text-sm font-medium text-gray-700">
                    Nombre
                  </label>
                  <Input
                    id="nombre"
                    placeholder="Ingresa tu nombre"
                    className="border-gray-300 focus:border-cardionova-red focus:ring-cardionova-red"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="apellido" className="text-sm font-medium text-gray-700">
                    Apellido
                  </label>
                  <Input
                    id="apellido"
                    placeholder="Ingresa tu apellido"
                    className="border-gray-300 focus:border-cardionova-red focus:ring-cardionova-red"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Correo Electrónico
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tucorreo@ejemplo.com"
                  className="border-gray-300 focus:border-cardionova-red focus:ring-cardionova-red"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="telefono" className="text-sm font-medium text-gray-700">
                  Teléfono
                </label>
                <Input
                  id="telefono"
                  placeholder="+XX XXXX XXXX"
                  className="border-gray-300 focus:border-cardionova-red focus:ring-cardionova-red"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="servicio" className="text-sm font-medium text-gray-700">
                  Servicio de Interés
                </label>
                <Select>
                  <SelectTrigger className="border-gray-300 focus:border-cardionova-red focus:ring-cardionova-red">
                    <SelectValue placeholder="Selecciona un servicio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consulta">Consulta Cardiológica</SelectItem>
                    <SelectItem value="electrocardiograma">Electrocardiograma</SelectItem>
                    <SelectItem value="ecocardiograma">Ecocardiograma</SelectItem>
                    <SelectItem value="prueba-esfuerzo">Prueba de Esfuerzo</SelectItem>
                    <SelectItem value="holter">Holter de Ritmo</SelectItem>
                    <SelectItem value="monitoreo">Monitoreo Ambulatorio de Presión</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="mensaje" className="text-sm font-medium text-gray-700">
                  Mensaje
                </label>
                <Textarea
                  id="mensaje"
                  placeholder="Escribe tu mensaje o consulta aquí"
                  className="min-h-[120px] border-gray-300 focus:border-cardionova-red focus:ring-cardionova-red"
                />
              </div>

              <Button className="w-full bg-cardionova-red hover:bg-cardionova-darkred text-white py-3">
                Enviar Mensaje
              </Button>
            </form>
          </div>

          {/* Información de contacto */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-cardionova-blue">Información de Contacto</h2>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <MapPin className="h-6 w-6 text-cardionova-red mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg text-cardionova-blue">Dirección</h3>
                  <p className="text-gray-700">Av. Libertador 1234, Piso 5</p>
                  <p className="text-gray-700">Ciudad Autónoma de Buenos Aires, Argentina</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Phone className="h-6 w-6 text-cardionova-red mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg text-cardionova-blue">Teléfono</h3>
                  <p className="text-gray-700">+54 11 4567-8900</p>
                  <p className="text-gray-700">+54 11 4567-8901 (Urgencias)</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Mail className="h-6 w-6 text-cardionova-red mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg text-cardionova-blue">Correo Electrónico</h3>
                  <p className="text-gray-700">info@cardionova.com</p>
                  <p className="text-gray-700">citas@cardionova.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Clock className="h-6 w-6 text-cardionova-red mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg text-cardionova-blue">Horario de Atención</h3>
                  <p className="text-gray-700">Lunes a Viernes: 8:00 - 20:00</p>
                  <p className="text-gray-700">Sábados: 9:00 - 14:00</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-200 rounded-lg overflow-hidden h-[300px] mt-8">
              <div className="w-full h-full flex items-center justify-center text-gray-500">Mapa de ubicación</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
