'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSmoothNavigation } from '@/hooks/useSmoothNavigation'
import { Button } from '@/components/ui/button'
import { Menu, X, Heart } from 'lucide-react'

export function SmoothNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { navigateTo } = useSmoothNavigation()

  const navigationItems = [
    { href: '/', label: 'Inicio' },
    { href: '/servicios', label: 'Servicios' },
    { href: '/nosotros', label: 'Nosotros' },
    { href: '/contacto', label: 'Contacto' },
  ]

  const handleNavigation = (href: string) => {
    if (pathname !== href) {
      navigateTo(href)
      setIsMenuOpen(false)
    }
  }

  const isActive = (href: string) => pathname === href

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={() => handleNavigation('/')}
          >
            <div className="p-2 rounded-full bg-cardionova-red/10 group-hover:bg-cardionova-red/20 transition-colors duration-200">
              <Heart className="h-6 w-6 text-cardionova-red" />
            </div>
            <span className="text-xl font-bold text-cardionova-blue group-hover:text-cardionova-red transition-colors duration-200">
              Cardionova
            </span>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavigation(item.href)}
                className={`
                  px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 relative
                  ${isActive(item.href)
                    ? 'text-cardionova-red bg-cardionova-red/5'
                    : 'text-gray-700 hover:text-cardionova-red hover:bg-gray-50'
                  }
                `}
              >
                {item.label}
                {isActive(item.href) && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cardionova-red rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button
              onClick={() => handleNavigation('/acceso-medicos')}
              className="bg-cardionova-red hover:bg-cardionova-darkred text-white transition-all duration-200 hover:scale-105"
            >
              Acceso Médicos
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-cardionova-red hover:bg-gray-50 transition-colors duration-200"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-out ${
          isMenuOpen
            ? 'max-h-80 opacity-100 pb-4'
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="space-y-1 pt-2">
            {navigationItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavigation(item.href)}
                className={`
                  block w-full text-left px-4 py-3 rounded-md text-sm font-medium transition-all duration-200
                  ${isActive(item.href)
                    ? 'text-cardionova-red bg-cardionova-red/5 border-l-2 border-cardionova-red'
                    : 'text-gray-700 hover:text-cardionova-red hover:bg-gray-50'
                  }
                `}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-2">
              <Button
                onClick={() => handleNavigation('/acceso-medicos')}
                className="w-full bg-cardionova-red hover:bg-cardionova-darkred text-white"
              >
                Acceso Médicos
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
