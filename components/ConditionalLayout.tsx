// components/ConditionalLayout.tsx

'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Si está en el área de acceso médicos, no mostrar navbar/footer públicos
  const isAuthArea = pathname.startsWith('/acceso-medicos')

  if (isAuthArea) {
    return <>{children}</>
  }

  // Para todas las demás páginas (inicio, nosotros, servicios, contacto), mostrar navbar y footer
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
