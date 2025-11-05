"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import { columns, type MedicalRecord } from "@/app/components/medical-record/columns";
import { useDebouncedCallback } from "use-debounce";

interface MedicalRecordsTableProps {
  data: MedicalRecord[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export function MedicalRecordsTable({
    data,
    totalCount,
    page,
    pageSize
}: MedicalRecordsTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageCount = Math.ceil(totalCount / pageSize);

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("pageSize", newPageSize.toString());
    params.set("page", "1"); // Reset to first page
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="space-y-4">
        <div className="flex items-center justify-between">
            <Input
                placeholder="Buscar por nombre o cédula..."
                defaultValue={searchParams.get("search") || ""}
                onChange={(e) => handleSearch(e.target.value)}
                className="max-w-sm bg-white"
            />
        </div>
      <DataTable
        columns={columns}
        data={data}
        pageCount={pageCount}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        currentPage={page}
        pageSize={pageSize}
      />
    </div>
  );
}
