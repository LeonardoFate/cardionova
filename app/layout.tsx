// app/layout.tsx - Versión optimizada con loading selectivo

import type React from "react"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/AuthContext"
import { ConditionalLayout } from "@/components/ConditionalLayout"
import { MedicalAccessLoading } from "@/components/ui/medical-access-loading"
import { PageTransition } from "@/components/ui/page-transition"
import "./globals.css"

export const metadata: Metadata = {
  title: "Cardionova - Especialistas en Cardiología",
  description: "Centro médico especializado en cardiología con los mejores especialistas y tecnología de vanguardia.",
  icons: {
    icon: "/favicon.png",
  },
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light">
          <AuthProvider>
            <ConditionalLayout>
              <MedicalAccessLoading />
              <PageTransition>
                {children}
              </PageTransition>
            </ConditionalLayout>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
