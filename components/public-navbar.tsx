"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";

export function PublicNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/nosotros", label: "Nosotros" },
    { href: "/servicios", label: "Servicios" },
    { href: "/contacto", label: "Contacto" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo.png"
              alt="Cardionova Logo"
              width={40}
              height={40}
              className="rounded"
            />
            <span className="text-xl font-bold text-[#1E3A8A]">
              Cardionova
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-[#E11D48]"
                    : "text-gray-700 hover:text-[#1E3A8A]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button
              asChild
              className="bg-[#E11D48] hover:bg-[#BE123C] text-white shadow-sm"
            >
              <Link href="/contacto">Agendar Cita</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-2 border-[#1E3A8A] bg-white text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white shadow-sm"
            >
              <Link href="/acceso-medicos">Acceso Médicos</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6 text-[#1E3A8A]" />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-2 text-sm font-medium ${
                  isActive(link.href)
                    ? "text-[#E11D48]"
                    : "text-gray-700"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="space-y-2 pt-2">
              <Button
                asChild
                className="w-full bg-[#E11D48] hover:bg-[#BE123C] text-white"
              >
                <Link href="/contacto">Agendar Cita</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full border-2 border-[#1E3A8A] bg-white text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white"
              >
                <Link href="/acceso-medicos">Acceso Médicos</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
