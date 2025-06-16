// app/acceso-medicos/dashboard/usuarios/page.tsx

'use client'

import { useState } from 'react'
import { useAuth, isAdmin } from '@/contexts/AuthContext'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { UsersList } from '@/components/admin/UsersList'
import { UserForm } from '@/components/admin/UserForm'
import { IUserResponse } from '@/types/user'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

type ViewMode = 'list' | 'create' | 'edit'

export default function UsuariosPage() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedUser, setSelectedUser] = useState<IUserResponse | undefined>()
  const [showDialog, setShowDialog] = useState(false)

  // Verificar autenticación y permisos
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin(user))) {
      router.push('/acceso-medicos')
    }
  }, [isLoading, isAuthenticated, user, router])

  // Mostrar loading mientras verifica autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#1e3a8a]"></div>
      </div>
    )
  }

  // Verificar permisos
  if (!isAuthenticated || !isAdmin(user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Alert className="max-w-md" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No tienes permisos para acceder a esta página. Solo los administradores pueden gestionar usuarios.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Handlers para las acciones
  const handleCreateUser = () => {
    setSelectedUser(undefined)
    setViewMode('create')
    setShowDialog(true)
  }

  const handleEditUser = (user: IUserResponse) => {
    setSelectedUser(user)
    setViewMode('edit')
    setShowDialog(true)
  }

  const handleCloseDialog = () => {
    setShowDialog(false)
    setViewMode('list')
    setSelectedUser(undefined)
  }

  const handleUserSuccess = (user: IUserResponse) => {
    handleCloseDialog()
    // La lista se actualizará automáticamente al refrescar
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Mostrar lista de usuarios */}
        <UsersList
          onCreateUser={handleCreateUser}
          onEditUser={handleEditUser}
        />

        {/* Dialog para crear/editar usuario */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {viewMode === 'create' ? 'Crear Nuevo Usuario' : 'Editar Usuario'}
              </DialogTitle>
            </DialogHeader>
            <UserForm
              user={selectedUser}
              onSuccess={handleUserSuccess}
              onCancel={handleCloseDialog}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
