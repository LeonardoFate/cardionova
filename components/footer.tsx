import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Image src="/logo.png" alt="Cardionova" width={160} height={50} />
            <p className="text-gray-600">
              Centro médico especializado en cardiología, comprometido con brindar atención de calidad y personalizada.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-cardionova-blue hover:text-cardionova-red transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-cardionova-blue hover:text-cardionova-red transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-cardionova-blue hover:text-cardionova-red transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-cardionova-blue hover:text-cardionova-red transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-cardionova-blue mb-4">Enlaces Rápidos</h3>
            <nav className="flex flex-col space-y-3">
              <Link href="/" className="text-gray-600 hover:text-cardionova-red transition-colors">
                Inicio
              </Link>
              <Link href="/nosotros" className="text-gray-600 hover:text-cardionova-red transition-colors">
                Nosotros
              </Link>
              <Link href="/servicios" className="text-gray-600 hover:text-cardionova-red transition-colors">
                Servicios
              </Link>
              <Link href="/contacto" className="text-gray-600 hover:text-cardionova-red transition-colors">
                Contacto
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="text-lg font-bold text-cardionova-blue mb-4">Servicios</h3>
            <nav className="flex flex-col space-y-3">
              <Link href="/servicios" className="text-gray-600 hover:text-cardionova-red transition-colors">
                Consulta Cardiológica
              </Link>
              <Link href="/servicios" className="text-gray-600 hover:text-cardionova-red transition-colors">
                Electrocardiograma
              </Link>
              <Link href="/servicios" className="text-gray-600 hover:text-cardionova-red transition-colors">
                Ecocardiograma
              </Link>
              <Link href="/servicios" className="text-gray-600 hover:text-cardionova-red transition-colors">
                Prueba de Esfuerzo
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="text-lg font-bold text-cardionova-blue mb-4">Contacto</h3>
            <address className="not-italic text-gray-600 space-y-3">
              <p>Av. Libertador 1234, Piso 5</p>
              <p>Ciudad Autónoma de Buenos Aires</p>
              <p>+54 11 4567-8900</p>
              <p>info@cardionova.com</p>
            </address>
          </div>
        </div>

        <div className="border-t mt-12 pt-6 text-center">
          <p className="text-gray-600">© {new Date().getFullYear()} Cardionova. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
