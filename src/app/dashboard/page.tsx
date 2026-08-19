"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Employee } from "@/types/employee";
import {
  ApiError,
  createEmployee,
  getEmployees,
} from "@/services/employee.service";
import EmployeeTable from "@/components/employees/employee-table";
import EmployeePagination from "@/components/employees/employee-pagination";
import EmployeeForm from "@/components/employees/employee-form";
import type { EmployeeRequest } from "@/types/employee";

export default function DashboardPage() {
  const router = useRouter();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchEmployees() {
      try {
        setLoadingEmployees(true);
        setError(null);

        const data = await getEmployees(page, 10, controller.signal);

        setEmployees(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        if (error instanceof ApiError && error.status === 401) {
          router.push("/login");
          return;
        }

        setError("No se pudieron cargar los empleados.");
      } finally {
        if (!controller.signal.aborted) {
          setLoadingEmployees(false);
        }
      }
    }

    fetchEmployees();

    return () => {
      controller.abort();
    };
  }, [page, router]);

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

  async function handleCreateEmployee(data: EmployeeRequest) {
    await createEmployee(data);

    const response = await getEmployees(page, 10);

    setEmployees(response.content);
    setTotalPages(response.totalPages);
  }

  async function handleEmployeeDeleted(id: number) {
    setEmployees((current) => current.filter((employee) => employee.id !== id));
  }

  return (
    <main className="min-h-screen p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>

          <p className="mt-2 text-gray-500">
            Bienvenido al sistema de empleados.
          </p>
        </div>

        <button onClick={handleLogout} disabled={loading}>
          {loading ? "Logging out..." : "Logout"}
        </button>
      </div>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold">Empleados</h2>

        <div className="mt-6">
          <EmployeeForm
            submitLabel="Crear empleado"
            onSubmit={handleCreateEmployee}
          />
        </div>

        {loadingEmployees && (
          <p className="mt-4 text-gray-500">Cargando empleados...</p>
        )}

        {error && <p className="mt-4 text-red-500">{error}</p>}

        {!loadingEmployees && !error && (
          <>
            {employees.length === 0 ? (
              <p className="mt-4 text-gray-500">
                No hay empleados registrados.
              </p>
            ) : (
              <>
                <EmployeeTable
                  employees={employees}
                  onDeleted={handleEmployeeDeleted}
                />
                <EmployeePagination
                  page={page}
                  totalPages={totalPages}
                  loading={loadingEmployees}
                  onPageChange={setPage}
                />
              </>
            )}
          </>
        )}
      </section>
    </main>
  );
}
