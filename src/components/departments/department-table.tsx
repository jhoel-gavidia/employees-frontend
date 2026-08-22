"use client";

import Link from "next/link";
import { useState } from "react";

import type { Department } from "@/types/department";

import { deleteDepartment } from "@/services/department.service";
import { ApiError } from "@/services/api-error";

interface DepartmentTableProps {
  departments: Department[];
  onDeleted: (id: number) => void;
}

export default function DepartmentTable({
  departments,
  onDeleted,
}: DepartmentTableProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar este departamento?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      await deleteDepartment(id);

      onDeleted(id);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        window.alert("Tu sesión ha expirado.");
        return;
      }

      if (error instanceof ApiError && error.status === 404) {
        window.alert("El departamento ya no existe.");
        return;
      }

      if (error instanceof ApiError && error.status === 409) {
        window.alert(
          "No se puede eliminar el departamento porque tiene empleados asociados.",
        );
        return;
      }

      window.alert("No se pudo eliminar el departamento.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px]">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/70">
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              Departamento
            </th>

            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              Ubicación
            </th>

            <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
              Acciones
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {departments.map((department) => (
            <tr key={department.id} className="transition hover:bg-gray-50/70">
              <td className="px-6 py-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {department.name}
                  </p>

                  <p className="mt-0.5 text-xs text-gray-500">
                    ID #{department.id}
                  </p>
                </div>
              </td>

              <td className="px-6 py-4 text-sm text-gray-600">
                {department.officeLocation}
              </td>

              <td className="px-6 py-4">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/dashboard/departments/${department.id}/edit`}
                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                  >
                    Editar
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDelete(department.id)}
                    disabled={deletingId === department.id}
                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deletingId === department.id
                      ? "Eliminando..."
                      : "Eliminar"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
