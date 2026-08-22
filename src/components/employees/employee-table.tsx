"use client";

import Link from "next/link";

import type { Employee } from "@/types/employee";

import { deleteEmployee } from "@/services/employee.service";
import { ApiError } from "@/services/api-error";

interface EmployeeTableProps {
  employees: Employee[];
  onDeleted: () => void;
}

export default function EmployeeTable({
  employees,
  onDeleted,
}: EmployeeTableProps) {
  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar este empleado?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteEmployee(id);
      onDeleted();
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        window.alert("Tu sesión ha expirado.");
        return;
      }

      if (error instanceof ApiError && error.status === 404) {
        window.alert("El empleado ya no existe.");
        return;
      }

      window.alert("No se pudo eliminar el empleado.");
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px]">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/70">
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              Empleado
            </th>

            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              Email
            </th>

            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              Teléfono
            </th>

            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              Departamento
            </th>

            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              Salario
            </th>

            <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
              Acciones
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {employees.map((employee) => (
            <tr
              key={employee.id}
              className="transition hover:bg-gray-50/70"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600">
                    {employee.firstName.charAt(0)}
                    {employee.lastName.charAt(0)}
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {employee.firstName} {employee.lastName}
                    </p>

                    <p className="text-xs text-gray-500">
                      ID #{employee.id}
                    </p>
                  </div>
                </div>
              </td>

              <td className="px-6 py-4 text-sm text-gray-600">
                {employee.email}
              </td>

              <td className="px-6 py-4 text-sm text-gray-600">
                {employee.phoneNumber || "—"}
              </td>

              <td className="px-6 py-4">
                <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                  {employee.departmentName}
                </span>
              </td>

              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                S/ {Number(employee.salary).toLocaleString("es-PE", {
                  minimumFractionDigits: 2,
                })}
              </td>

              <td className="px-6 py-4">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/dashboard/employees/${employee.id}/edit`}
                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                  >
                    Editar
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDelete(employee.id)}
                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    Eliminar
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