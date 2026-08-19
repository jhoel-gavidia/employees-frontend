"use client";

import { useState } from "react";
import Link from "next/link";
import type { Employee } from "@/types/employee";
import { ApiError, deleteEmployee } from "@/services/employee.service";

interface EmployeeTableProps {
  employees: Employee[];
  onDeleted: (id: number) => Promise<void>;
}

export default function EmployeeTable({
  employees,
  onDeleted,
}: EmployeeTableProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar este empleado?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError(null);

      await deleteEmployee(id);
      await onDeleted(id);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setError("Tu sesión ha expirado.");
        return;
      }

      setError("No se pudo eliminar el empleado.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="mt-4 overflow-x-auto">
      {error && (
        <p className="mb-4 text-red-500">
          {error}
        </p>
      )}

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b text-left">
            <th className="p-3">Nombre</th>
            <th className="p-3">Email</th>
            <th className="p-3">Teléfono</th>
            <th className="p-3">Departamento</th>
            <th className="p-3">Salario</th>
            <th className="p-3">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((employee) => (
            <tr
              key={employee.id}
              className="border-b"
            >
              <td className="p-3">
                {employee.firstName} {employee.lastName}
              </td>

              <td className="p-3">
                {employee.email}
              </td>

              <td className="p-3">
                {employee.phoneNumber}
              </td>

              <td className="p-3">
                {employee.departmentName}
              </td>

              <td className="p-3">
                {employee.salary}
              </td>

              <td className="p-3">
                <div className="flex gap-3">
                  <Link
                    href={`/dashboard/employees/${employee.id}/edit`}
                  >
                    Editar
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDelete(employee.id)}
                    disabled={deletingId === employee.id}
                  >
                    {deletingId === employee.id
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