"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Employee } from "@/types/employee";
import { getEmployees } from "@/services/employee.service";

export default function DashboardPage() {
  const router = useRouter();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [error, setError] = useState<string | null>(null);


  async function handleLogout() {
    setLoading(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      router.push("/login");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function loadEmployees() {
      try {
        setLoadingEmployees(true);
        setError(null);

        const data = await getEmployees();

        setEmployees(data.content);
      } catch {
        setError("No se pudieron cargar los empleados.");
      } finally {
        setLoadingEmployees(false);
      }
    }

    loadEmployees();
  }, []);

  return (
    <main className="min-h-screen p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Dashboard
          </h1>

          <p className="mt-2 text-gray-500">
            Bienvenido al sistema de empleados.
          </p>
        </div>

        <button
          onClick={handleLogout}
          disabled={loading}
        >
          {loading ? "Logging out..." : "Logout"}
        </button>
      </div>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold">
          Empleados
        </h2>

        {loadingEmployees && (
          <p className="mt-4 text-gray-500">
            Cargando empleados...
          </p>
        )}

        {error && (
          <p className="mt-4 text-red-500">
            {error}
          </p>
        )}

        {!loadingEmployees && !error && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b text-left">
                  <th className="p-3">Nombre</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Teléfono</th>
                  <th className="p-3">Departamento</th>
                  <th className="p-3">Salario</th>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}