"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { Plus, X } from "lucide-react";

// Zod schema with conditional validations
const createUserSchema = z.object({
  firstNames: z.string().min(2, "Los nombres deben tener al menos 2 caracteres").max(100, "Máximo 100 caracteres"),
  lastNames: z.string().min(2, "Los apellidos deben tener al menos 2 caracteres").max(100, "Máximo 100 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres").max(50, "Máximo 50 caracteres"),
  role: z.enum(["doctor", "secretary"]),
  phone: z.string()
    .optional()
    .refine(
      (val) => !val || val.length === 0 || /^[0-9+()\s-]{7,20}$/.test(val),
      { message: "Formato de teléfono inválido (7-20 dígitos)" }
    ),
  speciality: z.string()
    .optional()
    .refine(
      (val) => !val || val.length === 0 || val.length >= 2,
      { message: "La especialidad debe tener al menos 2 caracteres" }
    ),
  licenseNumber: z.string()
    .optional()
    .refine(
      (val) => !val || val.length === 0 || /^[A-Z0-9-]{3,20}$/.test(val),
      { message: "Formato de número de licencia inválido" }
    ),
  department: z.string()
    .optional()
    .refine(
      (val) => !val || val.length === 0 || val.length >= 2,
      { message: "El departamento debe tener al menos 2 caracteres" }
    ),
  description: z.string()
    .optional()
    .refine(
      (val) => !val || val.length === 0 || val.length <= 500,
      { message: "La descripción no puede exceder 500 caracteres" }
    ),
  education: z.string()
    .optional()
    .refine(
      (val) => !val || val.length === 0 || val.length >= 3,
      { message: "La formación debe tener al menos 3 caracteres" }
    ),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;

interface UserCreateFormProps {
  onSubmit: (values: CreateUserFormValues, certifications: string[]) => Promise<void>;
  onCancel: () => void;
}

export function UserCreateForm({ onSubmit, onCancel }: UserCreateFormProps) {
  const [certifications, setCertifications] = useState<string[]>([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
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
    },
  });

  const handleSubmit = async (values: CreateUserFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values, certifications);
      form.reset();
      setCertifications([""]);
    } finally {
      setIsSubmitting(false);
    }
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

  const currentRole = form.watch("role");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4 py-4">
          <FormField
            control={form.control}
            name="firstNames"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombres *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastNames"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellidos *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña *</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rol *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="secretary">Secretaria</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {currentRole !== "secretary" && (
            <>
              <FormField
                control={form.control}
                name="speciality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Especialidad</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="licenseNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Senecyt</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Descripción del Médico</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Breve descripción profesional..."
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="education"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Formación</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ej: Universidad Central del Ecuador" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="col-span-2 space-y-2">
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

          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Departamento</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creando..." : "Crear Usuario"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
