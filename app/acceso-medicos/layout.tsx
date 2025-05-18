// app/acceso-medicos/layout.tsx

'use client'

import { usePathname } from 'next/navigation'
import { DashboardNavbar } from '@/components/dashboard/DashboardNavbar'

export default function AccesoMedicosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/acceso-medicos'

  if (isLoginPage) {
    // Página de login: solo el contenido sin navbar del dashboard
    return (
      <div className="min-h-screen bg-white">
        {children}
      </div>
    )
  }

  // Páginas del dashboard: mostrar navbar del dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />
      <main>{children}</main>
    </div>
  )
}
