// components/dashboard/DashboardNavbar.tsx

'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Heart, User, LogOut, ChevronDown } from 'lucide-react'

export function DashboardNavbar() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    console.log('🚪 Botón logout presionado')
    await logout()
    console.log('🔄 Logout completado, redirigiendo...')
    // Redirección manual después del logout
    router.push('/acceso-medicos')
  }

  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      'ADMIN': 'Administrador',
      'SECRETARIA': 'Secretaria',
      'MEDICO': 'Médico'
    }
    return roleNames[role as keyof typeof roleNames] || role
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800'
      case 'SECRETARIA':
        return 'bg-blue-100 text-blue-800'
      case 'MEDICO':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!user) return null

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo y título */}
          <Link href="/acceso-medicos/dashboard" className="flex items-center space-x-3">
            <div className="bg-[#1e3a8a] p-2 rounded-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#1e3a8a]">Cardionova</h1>
              <p className="text-xs text-gray-500">Panel Médico</p>
            </div>
          </Link>

          {/* Menú de navegación */}
          <div className="flex items-center space-x-6">
            <Link
              href="/acceso-medicos/dashboard"
              className="text-gray-600 hover:text-[#1e3a8a] transition-colors"
            >
              Dashboard
            </Link>

            {user.role === 'ADMIN' && (
              <>
                <Link
                  href="/acceso-medicos/dashboard/usuarios"
                  className="text-gray-600 hover:text-[#1e3a8a] transition-colors"
                >
                  Usuarios
                </Link>
                <Link
                  href="/acceso-medicos/dashboard/reportes"
                  className="text-gray-600 hover:text-[#1e3a8a] transition-colors"
                >
                  Reportes
                </Link>
              </>
            )}

            {user.role === 'SECRETARIA' && (
              <>
                <span className="text-gray-600 hover:text-[#1e3a8a] transition-colors cursor-pointer">
                  Citas
                </span>
                <span className="text-gray-600 hover:text-[#1e3a8a] transition-colors cursor-pointer">
                  Pacientes
                </span>
              </>
            )}

            {user.role === 'MEDICO' && (
              <>
                <span className="text-gray-600 hover:text-[#1e3a8a] transition-colors cursor-pointer">
                  Mis Citas
                </span>
                <span className="text-gray-600 hover:text-[#1e3a8a] transition-colors cursor-pointer">
                  Historiales
                </span>
              </>
            )}
          </div>

          {/* Menú de usuario */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className={`text-xs px-2 py-1 rounded-full ${getRoleColor(user.role)}`}>
                    {getRoleDisplayName(user.role)}
                  </p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {user.role === 'ADMIN' && (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/acceso-medicos/dashboard/perfil" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Mi Perfil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}
