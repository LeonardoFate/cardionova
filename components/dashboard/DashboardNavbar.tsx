// components/dashboard/DashboardNavbar.tsx

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Menu,
  User,
  LogOut,
  ChevronDown,
  Home,
  Calendar,
  FileText,
  Users,
  BarChart3,
  Settings
} from 'lucide-react'

export function DashboardNavbar() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
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

  // Navegación basada en roles
  const getNavigationItems = () => {
    const baseItems = [
      { name: 'Dashboard', href: '/acceso-medicos/dashboard', icon: Home }
    ]

    if (user?.role === 'ADMIN') {
      return [
        ...baseItems,
        { name: 'Usuarios', href: '/acceso-medicos/dashboard/usuarios', icon: Users },
        { name: 'Reportes', href: '/acceso-medicos/dashboard/reportes', icon: BarChart3 }
      ]
    }

    if (user?.role === 'SECRETARIA') {
      return [
        ...baseItems,
        { name: 'Citas', href: '/acceso-medicos/dashboard/citas', icon: Calendar },
        { name: 'Pacientes', href: '/acceso-medicos/dashboard/pacientes', icon: Users }
      ]
    }

    if (user?.role === 'MEDICO') {
      return [
        ...baseItems,
        { name: 'Mis Citas', href: '/acceso-medicos/dashboard/mis-citas', icon: Calendar },
        { name: 'Historiales', href: '/acceso-medicos/dashboard/historiales', icon: FileText }
      ]
    }

    return baseItems
  }

  const navigationItems = getNavigationItems()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/acceso-medicos/dashboard" className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#1e3a8a] rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="font-bold text-[#1e3a8a] text-lg">
                Cardionova
              </span>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                Panel Médico
              </span>
            </div>
          </Link>

          {/* Navegación Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-[#1e3a8a] transition-colors"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Usuario y opciones */}
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 h-auto p-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="text-left hidden sm:block">
                      <p className="text-sm font-medium text-gray-700">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user?.role && getRoleDisplayName(user.role)}
                      </p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center space-x-2 p-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${user?.role ? getRoleColor(user.role) : ''}`}>
                        {user?.role && getRoleDisplayName(user.role)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/acceso-medicos/dashboard/perfil" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Mi Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/acceso-medicos/dashboard/configuracion" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Configuración
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
