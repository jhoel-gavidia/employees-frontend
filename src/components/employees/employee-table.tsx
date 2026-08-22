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
      if (
        error instanceof ApiError &&
        error.status === 401
      ) {
        window.alert("Tu sesión ha expirado.");
        return;
      }

      if (
        error instanceof ApiError &&
        error.status === 404
      ) {
        window.alert("El empleado ya no existe.");
        return;
      }

      window.alert("No se pudo eliminar el empleado.");
    }
  }

  return (
    <div className="mt-4 overflow-x-auto">
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