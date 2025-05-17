import { ReactNode } from 'react'

export const metadata = {
  title: "Nosotros - Cardionova",
  description: "Conoce a nuestro equipo médico especializado en cardiología y nuestra historia.",
}

interface NosotrosLayoutProps {
  children: ReactNode
}

export default function NosotrosLayout({ children }: NosotrosLayoutProps) {
  return children
}
