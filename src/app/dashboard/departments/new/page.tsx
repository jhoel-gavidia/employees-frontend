"use client";

import { useRouter } from "next/navigation";

import type { DepartmentRequest } from "@/types/department";

import { createDepartment } from "@/services/department.service";

import DepartmentForm from "@/components/departments/department-form";

export default function NewDepartmentPage() {
  const router = useRouter();

  async function handleCreateDepartment(
    data: DepartmentRequest,
  ) {
    await createDepartment(data);

    router.push("/dashboard/departments");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <p className="text-sm font-medium text-gray-500">
          Departamentos
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
          Nuevo departamento
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Registra una nueva área dentro de la organización.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <DepartmentForm
          submitLabel="Crear departamento"
          onSubmit={handleCreateDepartment}
        />
      </div>
    </div>
  );
}