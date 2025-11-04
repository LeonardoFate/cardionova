"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/app/lib/auth-client";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, UserX, UserCheck, X } from "lucide-react";

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
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    firstNames: "",
    lastNames: "",
    email: "",
    password: "",
    role: "doctor",
    phone: "",
    speciality: "",
    licenseNumber: "",
    department: "",
    description: "",
    education: "",
  });
  const [certifications, setCertifications] = useState<string[]>([""]);

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

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          certifications: certifications.filter(c => c.trim() !== "").join(", "),
        }),
      });

      if (response.ok) {
        setIsCreateDialogOpen(false);
        resetForm();
        fetchUsers();
      } else {
        const error = await response.json();
        alert(error.message || "Error creating user");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Error creating user");
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          certifications: certifications.filter(c => c.trim() !== "").join(", "),
        }),
      });

      if (response.ok) {
        setIsEditDialogOpen(false);
        resetForm();
        setSelectedUser(null);
        fetchUsers();
      } else {
        const error = await response.json();
        alert(error.message || "Error updating user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Error updating user");
    }
  };

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/users/${userId}/toggle-active`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        fetchUsers();
      } else {
        const error = await response.json();
        alert(error.message || "Error updating user status");
      }
    } catch (error) {
      console.error("Error toggling user status:", error);
      alert("Error updating user status");
    }
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setFormData({
      firstNames: user.firstNames,
      lastNames: user.lastNames,
      email: user.email,
      password: "",
      role: user.role,
      phone: user.phone || "",
      speciality: user.speciality || "",
      licenseNumber: user.licenseNumber || "",
      department: user.department || "",
      description: user.description || "",
      education: user.education || "",
    });
    const certList = user.certifications ? user.certifications.split(", ").filter(c => c.trim() !== "") : [""];
    setCertifications(certList.length > 0 ? certList : [""]);
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      firstNames: "",
      lastNames: "",
      email: "",
      password: "",
      role: "doctor",
      phone: "",
      speciality: "",
      licenseNumber: "",
      department: "",
      description: "",
      education: "",
    });
    setCertifications([""]);
  };

  const addCertification = () => {
    setCertifications([...certifications, ""]);
  };

  const removeCertification = (index: number) => {
    if (certifications.length > 1) {
      setCertifications(certifications.filter((_, i) => i !== index));
    }
  };

  const updateCertification = (index: number, value: string) => {
    const newCertifications = [...certifications];
    newCertifications[index] = value;
    setCertifications(newCertifications);
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
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.isActive ? "Activo" : "Inactivo"}
                      </span>
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
                            onClick={() => handleToggleActive(user.id, user.isActive)}
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
            <form onSubmit={handleCreateUser}>
              <DialogHeader>
                <DialogTitle className="text-[#1E3A8A]">Crear Nuevo Usuario</DialogTitle>
                <DialogDescription>
                  Complete la información del nuevo usuario del sistema.
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="firstNames">Nombres *</Label>
                  <Input
                    id="firstNames"
                    value={formData.firstNames}
                    onChange={(e) =>
                      setFormData({ ...formData, firstNames: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastNames">Apellidos *</Label>
                  <Input
                    id="lastNames"
                    value={formData.lastNames}
                    onChange={(e) =>
                      setFormData({ ...formData, lastNames: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Rol *</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) =>
                      setFormData({ ...formData, role: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="doctor">Doctor</SelectItem>
                      <SelectItem value="secretary">Secretaria</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>

                {formData.role !== "secretary" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="speciality">Especialidad</Label>
                      <Input
                        id="speciality"
                        value={formData.speciality}
                        onChange={(e) =>
                          setFormData({ ...formData, speciality: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="licenseNumber">Número de Senecyt</Label>
                      <Input
                        id="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, licenseNumber: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="description">Descripción del Médico</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        placeholder="Breve descripción profesional..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="education">Formación</Label>
                      <Input
                        id="education"
                        value={formData.education}
                        onChange={(e) =>
                          setFormData({ ...formData, education: e.target.value })
                        }
                        placeholder="Ej: Universidad Central del Ecuador"
                      />
                    </div>

                    <div className="space-y-2 col-span-2">
                      <div className="flex justify-between items-center mb-2">
                        <Label>Certificaciones</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addCertification}
                          className="h-8"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Agregar
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {certifications.map((cert, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={cert}
                              onChange={(e) => updateCertification(index, e.target.value)}
                              placeholder={`Certificación ${index + 1}`}
                            />
                            {certifications.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeCertification(index)}
                                className="shrink-0"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="department">Departamento</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
                  Crear Usuario
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleEditUser}>
              <DialogHeader>
                <DialogTitle className="text-[#1E3A8A]">Editar Usuario</DialogTitle>
                <DialogDescription>
                  Modifique la información del usuario. Deje la contraseña vacía para mantener la actual.
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-firstNames">Nombres *</Label>
                  <Input
                    id="edit-firstNames"
                    value={formData.firstNames}
                    onChange={(e) =>
                      setFormData({ ...formData, firstNames: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-lastNames">Apellidos *</Label>
                  <Input
                    id="edit-lastNames"
                    value={formData.lastNames}
                    onChange={(e) =>
                      setFormData({ ...formData, lastNames: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email *</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-password">Nueva Contraseña</Label>
                  <Input
                    id="edit-password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Dejar vacío para no cambiar"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-role">Rol *</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) =>
                      setFormData({ ...formData, role: value })
                    }
                    disabled={selectedUser?.role === "admin"}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="doctor">Doctor</SelectItem>
                      <SelectItem value="secretary">Secretaria</SelectItem>
                      {selectedUser?.role === "admin" && (
                        <SelectItem value="admin">Administrador</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Teléfono</Label>
                  <Input
                    id="edit-phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>

                {formData.role !== "secretary" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="edit-speciality">Especialidad</Label>
                      <Input
                        id="edit-speciality"
                        value={formData.speciality}
                        onChange={(e) =>
                          setFormData({ ...formData, speciality: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-licenseNumber">Número de Senecyt</Label>
                      <Input
                        id="edit-licenseNumber"
                        value={formData.licenseNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, licenseNumber: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="edit-description">Descripción</Label>
                      <Textarea
                        id="edit-description"
                        value={formData.description || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-education">Formación</Label>
                      <Input
                        id="edit-education"
                        value={formData.education || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, education: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2 col-span-2">
                      <div className="flex justify-between items-center mb-2">
                        <Label>Certificaciones</Label>
                        <Button
                          type="button"
                          onClick={addCertification}
                          size="sm"
                          variant="outline"
                          className="text-xs"
                        >
                          <Plus className="w-4 h-4 mr-1" /> Agregar
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {certifications.map((cert, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={cert}
                              onChange={(e) => updateCertification(index, e.target.value)}
                              placeholder="Certificación"
                            />
                            {certifications.length > 1 && (
                              <Button
                                type="button"
                                onClick={() => removeCertification(index)}
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:bg-red-50"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="edit-department">Departamento</Label>
                  <Input
                    id="edit-department"
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    resetForm();
                    setSelectedUser(null);
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
                  Guardar Cambios
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
