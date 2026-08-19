import Link from "next/link";
import type { Employee } from "@/types/employee";

interface EmployeeTableProps {
  employees: Employee[];
}

export default function EmployeeTable({
  employees,
}: EmployeeTableProps) {
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
                <Link
                  href={`/dashboard/employees/${employee.id}/edit`}
                >
                  Editar
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}