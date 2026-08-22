"use client";

import { use, useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import type {
  Department,
  DepartmentRequest,
} from "@/types/department";

import {
  getDepartmentById,
  updateDepartment,
} from "@/services/department.service";

import { ApiError } from "@/services/api-error";

import DepartmentForm from "@/components/departments/department-form";

interface EditDepartmentPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditDepartmentPage({
  params,
}: EditDepartmentPageProps) {
  const { id } = use(params);

  const router = useRouter();

  const [department, setDepartment] =
    useState<Department | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadDepartment() {
      try {
        const departmentId = Number(id);

        if (Number.isNaN(departmentId)) {
          setError("ID de departamento inválido.");
          return;
        }

        const data = await getDepartmentById(
          departmentId,
          controller.signal,
        );

        if (!controller.signal.aborted) {
          setDepartment(data);
        }
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }

        if (error instanceof ApiError && error.status === 401) {
          router.push("/login");
          return;
        }

        if (error instanceof ApiError && error.status === 404) {
          setError("Departamento no encontrado.");
          return;
        }

        setError("No se pudo cargar el departamento.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadDepartment();

    return () => {
      controller.abort();
    };
  }, [id, router]);

  async function handleUpdate(
    data: DepartmentRequest,
  ) {
    await updateDepartment(Number(id), data);

    router.push("/dashboard/departments");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8">
        <p className="text-sm text-gray-500">
          Cargando departamento...
        </p>
      </div>
    );
  }

  if (error || !department) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm font-medium text-red-700">
          {error ?? "Departamento no encontrado."}
        </p>

        <button
          type="button"
          onClick={() => router.push("/dashboard/departments")}
          className="mt-4 text-sm font-semibold text-gray-900 underline"
        >
          Volver a departamentos
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <p className="text-sm font-medium text-gray-500">
          Departamentos
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
          Editar departamento
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Actualiza la información del departamento.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <DepartmentForm
          initialData={{
            name: department.name,
            officeLocation: department.officeLocation,
          }}
          submitLabel="Guardar cambios"
          onSubmit={handleUpdate}
        />
      </div>
    </div>
  );
}