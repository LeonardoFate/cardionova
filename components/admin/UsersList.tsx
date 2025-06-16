// components/admin/UsersList.tsx

'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Loader2,
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  UserX,
  UserCheck,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { UserRole, IUserResponse } from '@/types/user'
import { useUsers } from '@/hooks/useUsers'

interface UsersListProps {
  onCreateUser: () => void
  onEditUser: (user: IUserResponse) => void
}

export function UsersList({ onCreateUser, onEditUser }: UsersListProps) {
  const {
    getUsers,
    deactivateUser,
    reactivateUser,
    isLoading,
    error,
    clearError
  } = useUsers()

  // Estado para la lista de usuarios y paginación
  const [users, setUsers] = useState<IUserResponse[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  // Estado para filtros
  const [filters, setFilters] = useState<{
    search: string
    role: UserRole | ''
    isActive: 'true' | 'false' | ''
  }>({
    search: '',
    role: '',
    isActive: ''
  })

  // Cargar usuarios
  const loadUsers = async () => {
    console.log('🔍 Cargando usuarios...', { pagination, filters }) // Debug

    const query = {
      page: pagination.page,
      limit: pagination.limit,
      ...(filters.search && { search: filters.search }),
      ...(filters.role && { role: filters.role }),
      ...(filters.isActive && { isActive: filters.isActive === 'true' })
    }

    console.log('📤 Query enviada:', query) // Debug

    const result = await getUsers(query)

    console.log('📥 Resultado recibido:', result) // Debug

    if (result) {
      setUsers(result.users)
      setPagination(result.pagination)
      console.log('✅ Usuarios cargados:', result.users.length) // Debug
    } else {
      console.log('❌ No se pudieron cargar usuarios') // Debug
    }
  }

  // Cargar usuarios al montar y cuando cambien los filtros
  useEffect(() => {
    loadUsers()
  }, [pagination.page, pagination.limit])

  // Cargar usuarios al montar el componente
  useEffect(() => {
    loadUsers()
  }, [])

  // Aplicar filtros
  const applyFilters = () => {
    setPagination(prev => ({ ...prev, page: 1 }))
    loadUsers()
  }

  // Limpiar filtros
  const clearFilters = () => {
    setFilters({
      search: '',
      role: '',
      isActive: ''
    })
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  // Manejar cambio de página
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  // Manejar desactivación/reactivación de usuario
  const handleToggleUserStatus = async (user: IUserResponse) => {
    const action = user.isActive ? 'desactivar' : 'reactivar'

    if (confirm(`¿Está seguro de que desea ${action} a ${user.firstName} ${user.lastName}?`)) {
      const success = user.isActive
        ? await deactivateUser(user._id)
        : await reactivateUser(user._id)

      if (success) {
        await loadUsers() // Recargar la lista
      }
    }
  }

  const getRoleDisplayName = (role: UserRole) => {
    const roleNames = {
      [UserRole.ADMIN]: 'Administrador',
      [UserRole.SECRETARIA]: 'Secretaria',
      [UserRole.MEDICO]: 'Médico'
    }
    return roleNames[role]
  }

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'default'
      case UserRole.SECRETARIA:
        return 'secondary'
      case UserRole.MEDICO:
        return 'outline'
      default:
        return 'default'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header con título y botón crear */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-cardionova-blue">Gestión de Usuarios</h2>
          <p className="text-gray-600">Administre médicos, secretarias y otros usuarios del sistema</p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={loadUsers}
            variant="outline"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              'Recargar'
            )}
          </Button>
          <Button
            onClick={onCreateUser}
            className="bg-cardionova-red hover:bg-cardionova-darkred"
          >
            <Plus className="mr-2 h-4 w-4" />
            Crear Usuario
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  id="search"
                  placeholder="Nombre, email..."
                  className="pl-8"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Rol</Label>
              <Select
                value={filters.role || undefined}
                onValueChange={(value) => {
                  setFilters(prev => ({
                    ...prev,
                    role: value as UserRole | ''
                  }))
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserRole.MEDICO}>Médico</SelectItem>
                  <SelectItem value={UserRole.SECRETARIA}>Secretaria</SelectItem>
                  <SelectItem value={UserRole.ADMIN}>Administrador</SelectItem>
                </SelectContent>
              </Select>
              {filters.role && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilters(prev => ({ ...prev, role: '' }))}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Limpiar filtro
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select
                value={filters.isActive || undefined}
                onValueChange={(value) => {
                  setFilters(prev => ({
                    ...prev,
                    isActive: value as 'true' | 'false' | ''
                  }))
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Activos</SelectItem>
                  <SelectItem value="false">Inactivos</SelectItem>
                </SelectContent>
              </Select>
              {filters.isActive && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilters(prev => ({ ...prev, isActive: '' }))}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Limpiar filtro
                </Button>
              )}
            </div>

            <div className="flex items-end space-x-2">
              <Button
                onClick={applyFilters}
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Aplicar'
                )}
              </Button>
              <Button
                variant="outline"
                onClick={clearFilters}
                disabled={isLoading}
              >
                Limpiar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mostrar errores */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Tabla de usuarios */}
      <Card>
        <CardHeader>
          <CardTitle>
            Usuarios ({pagination.total})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && users.length === 0 ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No se encontraron usuarios
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Especialidad</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Último acceso</TableHead>
                    <TableHead className="w-[50px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {user.firstName} {user.lastName}
                          </div>
                          {user.profile.phone && (
                            <div className="text-sm text-gray-500">
                              {user.profile.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {getRoleDisplayName(user.role)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.profile.speciality || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.isActive ? 'default' : 'secondary'}>
                          {user.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.lastLogin
                          ? new Date(user.lastLogin).toLocaleDateString('es-ES')
                          : 'Nunca'
                        }
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => onEditUser(user)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleToggleUserStatus(user)}
                              className={user.isActive ? 'text-red-600' : 'text-green-600'}
                            >
                              {user.isActive ? (
                                <>
                                  <UserX className="mr-2 h-4 w-4" />
                                  Desactivar
                                </>
                              ) : (
                                <>
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  Reactivar
                                </>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Paginación */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-600">
                    Mostrando {((pagination.page - 1) * pagination.limit) + 1} a{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} de{' '}
                    {pagination.total} usuarios
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1 || isLoading}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="flex items-center px-3 text-sm">
                      Página {pagination.page} de {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages || isLoading}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
