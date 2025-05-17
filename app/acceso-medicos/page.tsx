import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LockKeyhole } from "lucide-react"

export const metadata = {
  title: "Acceso Médicos - Cardionova",
  description: "Portal de acceso exclusivo para médicos de Cardionova.",
}

export default function AccesoMedicosPage() {
  return (
    <div className="w-full py-12 md:py-24 lg:py-32 bg-white">
      <div className="container px-4 md:px-6 max-w-md">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl text-[#1e3a8a]">Acceso Médicos</h1>
            <p className="text-gray-600">Portal exclusivo para profesionales de Cardionova</p>
          </div>
        </div>

        <Card className="border-gray-200">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-2">
              <LockKeyhole className="h-12 w-12 text-[#e11d48]" />
            </div>
            <CardTitle className="text-2xl text-center text-[#1e3a8a]">Iniciar Sesión</CardTitle>
            <CardDescription className="text-center">Ingrese sus credenciales para acceder al sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Correo Electrónico
              </label>
              <Input id="email" type="email" placeholder="doctor@cardionova.com" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  Contraseña
                </label>
                <a href="#" className="text-sm text-[#e11d48] hover:underline">
                  ¿Olvidó su contraseña?
                </a>
              </div>
              <Input id="password" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-[#e11d48] hover:bg-[#be123c]">Ingresar</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
