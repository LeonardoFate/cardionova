"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="Cardionova" width={160} height={50} priority />
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-8">
              <Link
                href="/"
                className={cn(
                  "text-base font-medium transition-colors hover:text-cardionova-red",
                  isActive("/") ? "text-cardionova-red" : "text-cardionova-blue",
                )}
              >
                Inicio
              </Link>
              <Link
                href="/nosotros"
                className={cn(
                  "text-base font-medium transition-colors hover:text-cardionova-red",
                  isActive("/nosotros") ? "text-cardionova-red" : "text-cardionova-blue",
                )}
              >
                Nosotros
              </Link>
              <Link
                href="/servicios"
                className={cn(
                  "text-base font-medium transition-colors hover:text-cardionova-red",
                  isActive("/servicios") ? "text-cardionova-red" : "text-cardionova-blue",
                )}
              >
                Servicios
              </Link>
              <Link
                href="/contacto"
                className={cn(
                  "text-base font-medium transition-colors hover:text-cardionova-red",
                  isActive("/contacto") ? "text-cardionova-red" : "text-cardionova-blue",
                )}
              >
                Contacto
              </Link>
            </div>

            <div className="flex space-x-4">
              <Link href="/contacto">
                <Button className="bg-cardionova-red hover:bg-cardionova-darkred text-white px-6">Agendar Cita</Button>
              </Link>
              <Link href="/acceso-medicos">
                <Button variant="outline" className="border-cardionova-blue text-cardionova-blue hover:bg-gray-50 px-6">
                  Acceso Médicos
                </Button>
              </Link>
            </div>
          </nav>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="flex flex-col p-4 bg-white">
            <Link
              href="/"
              className={cn(
                "py-3 text-base font-medium transition-colors hover:text-cardionova-red",
                isActive("/") ? "text-cardionova-red" : "text-cardionova-blue",
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link
              href="/nosotros"
              className={cn(
                "py-3 text-base font-medium transition-colors hover:text-cardionova-red",
                isActive("/nosotros") ? "text-cardionova-red" : "text-cardionova-blue",
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              Nosotros
            </Link>
            <Link
              href="/servicios"
              className={cn(
                "py-3 text-base font-medium transition-colors hover:text-cardionova-red",
                isActive("/servicios") ? "text-cardionova-red" : "text-cardionova-blue",
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              Servicios
            </Link>
            <Link
              href="/contacto"
              className={cn(
                "py-3 text-base font-medium transition-colors hover:text-cardionova-red",
                isActive("/contacto") ? "text-cardionova-red" : "text-cardionova-blue",
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              Contacto
            </Link>
            <div className="flex flex-col gap-3 mt-4">
              <Link href="/contacto" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-cardionova-red hover:bg-cardionova-darkred">Agendar Cita</Button>
              </Link>
              <Link href="/acceso-medicos" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" className="w-full border-cardionova-blue text-cardionova-blue">
                  Acceso Médicos
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
