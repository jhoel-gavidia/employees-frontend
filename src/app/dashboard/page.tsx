"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import type { Employee, EmployeeStatistics } from "@/types/employee";
import type { Department } from "@/types/department";
import type { EmployeeFilter } from "@/services/employee.service";

import {
  filterEmployees,
  getEmployeeStatistics,
  getEmployees,
} from "@/services/employee.service";

import { ApiError } from "@/services/api-error";
import { getDepartments } from "@/services/department.service";

import EmployeeTable from "@/components/employees/employee-table";
import EmployeePagination from "@/components/employees/employee-pagination";
import EmployeeFilters from "@/components/employees/employee-filters";

export default function DashboardPage() {
  const router = useRouter();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [statistics, setStatistics] = useState<EmployeeStatistics | null>(null);

  const [filters, setFilters] = useState<EmployeeFilter>({});
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchStatistics() {
      try {
        const data = await getEmployeeStatistics(controller.signal);
        setStatistics(data);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        if (error instanceof ApiError && error.status === 401) {
          router.push("/login");
        }
      }
    }

    fetchStatistics();

    return () => {
      controller.abort();
    };
  }, [router]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchEmployees() {
      try {
        setLoadingEmployees(true);
        setError(null);

        const hasFilters = Object.keys(filters).length > 0;

        const data = hasFilters
          ? await filterEmployees(filters, page, 10, controller.signal)
          : await getEmployees(page, 10, controller.signal);

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
  }, [page, router, filters]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchDepartments() {
      try {
        const data = await getDepartments(controller.signal);
        setDepartments(data);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        if (error instanceof ApiError && error.status === 401) {
          router.push("/login");
        }
      }
    }

    fetchDepartments();

    return () => {
      controller.abort();
    };
  }, [router]);

  function handleFilter(newFilters: EmployeeFilter) {
    setPage(0);
    setFilters(newFilters);
  }

  function handleEmployeeDeleted() {
    if (employees.length === 1 && page > 0) {
      setPage((current) => current - 1);
      return;
    }

    setEmployees((current) => current.slice(0, -1));
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

        <p className="mt-2 text-gray-500">
          Gestiona los empleados y departamentos de tu organización.
        </p>
      </div>

      {/* Estadísticas */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm font-medium text-gray-500">Total empleados</p>

          <p className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">
            {statistics?.totalEmployees ?? "—"}
          </p>

          <p className="mt-1 text-xs text-gray-400">Empleados registrados</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm font-medium text-gray-500">Departamentos</p>

          <p className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">
            {statistics?.totalDepartments ?? "—"}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Departamentos registrados
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm font-medium text-gray-500">Salario promedio</p>

          <p className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">
            {statistics
              ? `S/ ${Number(statistics.averageSalary).toLocaleString("es-PE", {
                  minimumFractionDigits: 2,
                })}`
              : "—"}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Promedio de todos los empleados
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm font-medium text-gray-500">Salario máximo</p>

          <p className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">
            {statistics
              ? `S/ ${Number(statistics.maxSalary).toLocaleString("es-PE", {
                  minimumFractionDigits: 2,
                })}`
              : "—"}
          </p>

          <p className="mt-1 text-xs text-gray-400">Mayor salario registrado</p>
        </div>
      </div>

      {/* Empleados */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Empleados</h2>

            <p className="mt-1 text-sm text-gray-500">
              Administra los empleados registrados.
            </p>
          </div>

          <Link
            href="/dashboard/employees/new"
            className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            + Nuevo empleado
          </Link>
        </div>

        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
          <EmployeeFilters
            departments={departments}
            onFilter={handleFilter}
            loading={loadingEmployees}
          />
        </div>

        {loadingEmployees && (
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">Cargando empleados...</p>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {!loadingEmployees && !error && (
          <>
            {employees.length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl">
                  ♙
                </div>

                <h3 className="mt-4 font-semibold">No hay empleados</h3>

                <p className="mt-1 text-sm text-gray-500">
                  Todavía no hay empleados registrados.
                </p>

                <Link
                  href="/dashboard/employees/new"
                  className="mt-5 inline-block rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white"
                >
                  + Nuevo empleado
                </Link>
              </div>
            ) : (
              <>
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                  <EmployeeTable
                    employees={employees}
                    onDeleted={handleEmployeeDeleted}
                  />
                </div>

                <div className="mt-4">
                  <EmployeePagination
                    page={page}
                    totalPages={totalPages}
                    loading={loadingEmployees}
                    onPageChange={setPage}
                  />
                </div>
              </>
            )}
          </>
        )}
      </section>
    </>
  );
}
