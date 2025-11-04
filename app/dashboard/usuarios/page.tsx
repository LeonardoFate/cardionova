"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/app/lib/auth-client";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, UserX, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { UserCreateForm, type CreateUserFormValues } from "@/app/components/users/UserCreateForm";
import { UserEditForm, type EditUserFormValues, type UserToEdit } from "@/app/components/users/UserEditForm";

interface User {
  id: string;
  firstNames: string;
  lastNames: string;
  email: string;
  role: string;
  isActive: boolean;
  phone?: string;
  speciality?: string;
  licenseNumber?: string;
  department?: string;
  description?: string;
  education?: string;
  certifications?: string;
}

export default function UsuariosPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isToggleDialogOpen, setIsToggleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToToggle, setUserToToggle] = useState<{ id: string; isActive: boolean } | null>(null);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/acceso-medicos");
    } else if (session && session.user.role !== "admin") {
      router.push("/dashboard");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleCreateUser = async (values: CreateUserFormValues, certifications: string[]) => {
    try {
      const response = await fetch("/api/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          certifications: certifications.filter(c => c.trim() !== "").join(", "),
        }),
      });

      if (response.ok) {
        setIsCreateDialogOpen(false);
        fetchUsers();
        toast.success("Usuario creado exitosamente", {
          description: "El nuevo usuario ha sido agregado al sistema",
        });
      } else {
        const error = await response.json();
        toast.error("Error al crear usuario", {
          description: error.message || "No se pudo crear el usuario",
        });
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Error al crear usuario", {
        description: "Ocurrió un error inesperado",
      });
    }
  };

  const handleEditUser = async (values: EditUserFormValues, certifications: string[]) => {
    if (!selectedUser) return;

    try {
      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          certifications: certifications.filter(c => c.trim() !== "").join(", "),
        }),
      });

      if (response.ok) {
        setIsEditDialogOpen(false);
        setSelectedUser(null);
        fetchUsers();
        toast.success("Usuario actualizado", {
          description: "Los cambios se guardaron correctamente",
        });
      } else {
        const error = await response.json();
        toast.error("Error al actualizar usuario", {
          description: error.message || "No se pudo actualizar el usuario",
        });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Error al actualizar usuario", {
        description: "Ocurrió un error inesperado",
      });
    }
  };

  const handleToggleActive = async () => {
    if (!userToToggle) return;

    try {
      const response = await fetch(`/api/users/${userToToggle.id}/toggle-active`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !userToToggle.isActive }),
      });

      if (response.ok) {
        fetchUsers();
        toast.success(
          userToToggle.isActive ? "Usuario desactivado" : "Usuario activado",
          {
            description: userToToggle.isActive
              ? "El usuario ya no podrá acceder al sistema"
              : "El usuario puede acceder al sistema nuevamente",
          }
        );
      } else {
        const error = await response.json();
        toast.error("Error al cambiar estado", {
          description: error.message || "No se pudo actualizar el estado del usuario",
        });
      }
    } catch (error) {
      console.error("Error toggling user status:", error);
      toast.error("Error al cambiar estado", {
        description: "Ocurrió un error inesperado",
      });
    } finally {
      setIsToggleDialogOpen(false);
      setUserToToggle(null);
    }
  };

  const confirmToggleActive = (userId: string, currentStatus: boolean) => {
    setUserToToggle({ id: userId, isActive: currentStatus });
    setIsToggleDialogOpen(true);
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!session || session.user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#1E3A8A]">Gestión de Usuarios</h1>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Usuario
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-[#1E3A8A]">Usuarios del Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Especialidad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.firstNames} {user.lastNames}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span className="capitalize">
                        {user.role === "admin"
                          ? "Administrador"
                          : user.role === "doctor"
                            ? "Doctor"
                            : "Secretaria"}
                      </span>
                    </TableCell>
                    <TableCell>{user.speciality || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? "default" : "destructive"}>
                        {user.isActive ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(user)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        {user.role !== "admin" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => confirmToggleActive(user.id, user.isActive)}
                            className={
                              user.isActive
                                ? "text-red-600 hover:text-red-700"
                                : "text-green-600 hover:text-green-700"
                            }
                          >
                            {user.isActive ? (
                              <UserX className="w-4 h-4" />
                            ) : (
                              <UserCheck className="w-4 h-4" />
                            )}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create User Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-[#1E3A8A]">Crear Nuevo Usuario</DialogTitle>
              <DialogDescription>
                Complete la información del nuevo usuario del sistema.
              </DialogDescription>
            </DialogHeader>
            <UserCreateForm
              onSubmit={handleCreateUser}
              onCancel={() => setIsCreateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-[#1E3A8A]">Editar Usuario</DialogTitle>
              <DialogDescription>
                Modifique la información del usuario. Deje la contraseña vacía para mantener la actual.
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <UserEditForm
                user={selectedUser}
                onSubmit={handleEditUser}
                onCancel={() => {
                  setIsEditDialogOpen(false);
                  setSelectedUser(null);
                }}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Toggle Active Status Confirmation Dialog */}
        <AlertDialog open={isToggleDialogOpen} onOpenChange={setIsToggleDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {userToToggle?.isActive ? "¿Desactivar usuario?" : "¿Activar usuario?"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {userToToggle?.isActive
                  ? "Este usuario ya no podrá acceder al sistema. Puedes reactivarlo en cualquier momento."
                  : "Este usuario podrá acceder al sistema nuevamente con sus credenciales."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleToggleActive}
                className={
                  userToToggle?.isActive
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }
              >
                {userToToggle?.isActive ? "Desactivar" : "Activar"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
}
