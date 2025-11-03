import Link from "next/link";
import { PublicNavbar } from "@/components/public-navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-[#1E3A8A] mb-6">
              Contacto
            </h1>
            <p className="text-lg text-gray-600">
              Estamos aquí para atenderte. Contáctanos para agendar una cita o
              resolver cualquier duda.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form and Info Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg border-none">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#1E3A8A]">
                    Agenda tu Cita
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    {/* Name and Surname Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-700 font-medium">
                          Nombre
                        </Label>
                        <Input
                          id="name"
                          placeholder="Ingresa tu nombre"
                          required
                          className="border-gray-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="surname" className="text-gray-700 font-medium">
                          Apellido
                        </Label>
                        <Input
                          id="surname"
                          placeholder="Ingresa tu apellido"
                          required
                          className="border-gray-300"
                        />
                      </div>
                    </div>

                    {/* Email and Phone Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700 font-medium">
                          Correo Electrónico
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="tu@email.com"
                          required
                          className="border-gray-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-gray-700 font-medium">
                          Teléfono
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+54 11 4567-8900"
                          required
                          className="border-gray-300"
                        />
                      </div>
                    </div>

                    {/* Service Type */}
                    <div className="space-y-2">
                      <Label htmlFor="service" className="text-gray-700 font-medium">
                        Servicio de Interés
                      </Label>
                      <Select>
                        <SelectTrigger className="border-gray-300">
                          <SelectValue placeholder="Selecciona un servicio" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="consulta">
                            Consulta Cardiológica
                          </SelectItem>
                          <SelectItem value="electrocardiograma">
                            Electrocardiograma
                          </SelectItem>
                          <SelectItem value="ecocardiograma">
                            Ecocardiograma
                          </SelectItem>
                          <SelectItem value="holter">
                            Holter 24 horas
                          </SelectItem>
                          <SelectItem value="stress">
                            Prueba de Esfuerzo
                          </SelectItem>
                          <SelectItem value="mapa">
                            Monitoreo de Presión Arterial (MAPA)
                          </SelectItem>
                          <SelectItem value="preventivo">
                            Paquete Preventivo
                          </SelectItem>
                          <SelectItem value="otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-gray-700 font-medium">
                        Mensaje
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="Escribe tu consulta o información adicional..."
                        className="border-gray-300 min-h-32"
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-[#E11D48] hover:bg-[#BE123C] text-white"
                    >
                      Enviar Solicitud
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card className="shadow-lg border-none">
                <CardHeader>
                  <CardTitle className="text-xl text-[#1E3A8A]">
                    Información de Contacto
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Address */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-[#E11D48]/10 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-[#E11D48]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1E3A8A] mb-1">
                        Dirección
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Av. Libertador 1234, Piso 5
                        <br />
                        Ciudad Autónoma de Buenos Aires, Argentina
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-[#E11D48]/10 rounded-full flex items-center justify-center">
                      <Phone className="w-5 h-5 text-[#E11D48]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1E3A8A] mb-1">
                        Teléfono
                      </h3>
                      <p className="text-gray-600 text-sm">
                        +54 11 4567-8900
                      </p>
                      <p className="text-gray-600 text-sm">
                        +54 11 4567-8901 (Urgencias)
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-[#E11D48]/10 rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5 text-[#E11D48]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1E3A8A] mb-1">
                        Correo Electrónico
                      </h3>
                      <p className="text-gray-600 text-sm">
                        info@cardionova.com
                      </p>
                      <p className="text-gray-600 text-sm">
                        citas@cardionova.com
                      </p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-[#E11D48]/10 rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-[#E11D48]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1E3A8A] mb-1">
                        Horario de Atención
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Lunes a Viernes: 8:00 - 20:00
                      </p>
                      <p className="text-gray-600 text-sm">
                        Sábados: 9:00 - 14:00
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A8A] mb-4">
              Mapa de ubicación
            </h2>
          </div>

          {/* Map Placeholder */}
          <div className="w-full h-96 bg-gradient-to-br from-[#1E3A8A]/10 to-[#E11D48]/10 rounded-2xl overflow-hidden shadow-lg">
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-[#E11D48] mx-auto mb-4" />
                <p className="text-gray-500 font-semibold">
                  Av. Libertador 1234, Piso 5
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Ciudad Autónoma de Buenos Aires, Argentina
                </p>
                <p className="text-sm text-gray-400 mt-4">
                  Integración de Google Maps
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-[#E11D48] rounded flex items-center justify-center text-white font-bold">
                  C
                </div>
                <span className="text-xl font-bold">Cardionova</span>
              </div>
              <p className="text-gray-400">
                Cuidado cardiovascular especializado con tecnología de
                vanguardia
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
                  <Link href="/servicios" className="hover:text-white">
                    Servicios
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
                <li>Teléfono: +54 11 4567-8900</li>
                <li>Email: info@cardionova.com</li>
                <li>Horario: Lun - Vie 8:00 - 20:00</li>
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
