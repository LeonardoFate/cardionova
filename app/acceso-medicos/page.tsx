// app/acceso-medicos/page.tsx

import { LoginForm } from '@/components/auth/LoginForm'

export const metadata = {
  title: "Acceso Médicos - Cardionova",
  description: "Portal de acceso exclusivo para médicos de Cardionova.",
}

export default function AccesoMedicosPage() {
  return <LoginForm />
}
