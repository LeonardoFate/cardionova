"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// This type is based on the data returned from our API
export type MedicalRecord = {
  id: string;
  patientName: string;
  patientIdNumber: string;
  recordDate: string;
  consultationReason: string;
  cie10Code: string;
};

export const columns: ColumnDef<MedicalRecord>[] = [
  {
    accessorKey: "patientName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Paciente
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "patientIdNumber",
    header: "Cédula",
  },
  {
    accessorKey: "recordDate",
    header: "Fecha",
    cell: ({ row }) => {
      const date = new Date(row.getValue("recordDate"));
      return new Intl.DateTimeFormat("es-EC", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date);
    },
  },
  {
    accessorKey: "consultationReason",
    header: "Motivo de Consulta",
    cell: ({ row }) => {
        const reason = row.getValue("consultationReason") as string;
        return <div className="truncate max-w-xs">{reason || "-"}</div>
    }
  },
  {
    accessorKey: "cie10Code",
    header: "CIE-10",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const record = row.original;

      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menú</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/historia-clinica/${record.id}`}>
                  Ver Historia Clínica
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
