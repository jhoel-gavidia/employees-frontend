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
  const [statistics, setStatistics] =
    useState<EmployeeStatistics | null>(null);

  const [filters, setFilters] = useState<EmployeeFilter>({});
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadStatistics() {
      try {
        const data = await getEmployeeStatistics(controller.signal);

        if (!controller.signal.aborted) {
          setStatistics(data);
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
        }
      }
    }

    loadStatistics();

    return () => {
      controller.abort();
    };
  }, [router]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadEmployees() {
      try {
        setLoadingEmployees(true);
        setError(null);

        const hasFilters = Object.keys(filters).length > 0;

        const data = hasFilters
          ? await filterEmployees(
              filters,
              page,
              10,
              controller.signal,
            )
          : await getEmployees(
              page,
              10,
              controller.signal,
            );

        if (!controller.signal.aborted) {
          setEmployees(data.content);
          setTotalPages(data.totalPages);
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

        setError("No se pudieron cargar los empleados.");
      } finally {
        if (!controller.signal.aborted) {
          setLoadingEmployees(false);
        }
      }
    }

    loadEmployees();

    return () => {
      controller.abort();
    };
  }, [page, filters, router]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadDepartments() {
      try {
        const data = await getDepartments(controller.signal);

        if (!controller.signal.aborted) {
          setDepartments(data);
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
        }
      }
    }

    loadDepartments();

    return () => {
      controller.abort();
    };
  }, [router]);

  function handleFilter(newFilters: EmployeeFilter) {
    setPage(0);
    setFilters(newFilters);
  }

  async function handleEmployeeDeleted() {
    if (employees.length === 1 && page > 0) {
      setPage((current) => current - 1);
    } else {
      setEmployees((current) => current.slice(0, -1));
    }

    try {
      const data = await getEmployeeStatistics();

      setStatistics(data);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        router.push("/login");
      }
    }
  }

  function formatCurrency(value: number) {
    return `S/ ${Number(value).toLocaleString("es-PE", {
      minimumFractionDigits: 2,
    })}`;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">
            Administración
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
            Dashboard
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-gray-500">
            Gestiona los empleados y departamentos de tu organización
            desde un solo lugar.
          </p>
        </div>

        <Link
          href="/dashboard/employees/new"
          className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800"
        >
          <span className="mr-2 text-lg leading-none">+</span>
          Nuevo empleado
        </Link>
      </header>

      {/* Statistics */}
      <section>
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-gray-900">
            Resumen general
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* Total employees */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total empleados
                </p>

                <p className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
                  {statistics?.totalEmployees ?? "—"}
                </p>

                <p className="mt-2 text-xs text-gray-400">
                  Empleados registrados
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-sm font-semibold text-gray-600">
                US
              </div>
            </div>
          </div>

          {/* Departments */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Departamentos
                </p>

                <p className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
                  {statistics?.totalDepartments ?? "—"}
                </p>

                <p className="mt-2 text-xs text-gray-400">
                  Áreas registradas
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-sm font-semibold text-gray-600">
                DP
              </div>
            </div>
          </div>

          {/* Average salary */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Salario promedio
                </p>

                <p className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
                  {statistics
                    ? formatCurrency(statistics.averageSalary)
                    : "—"}
                </p>

                <p className="mt-2 text-xs text-gray-400">
                  Promedio general
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-sm font-semibold text-gray-600">
                AV
              </div>
            </div>
          </div>

          {/* Max salary */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Salario máximo
                </p>

                <p className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
                  {statistics
                    ? formatCurrency(statistics.maxSalary)
                    : "—"}
                </p>

                <p className="mt-2 text-xs text-gray-400">
                  Mayor salario registrado
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-sm font-semibold text-gray-600">
                MX
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Employees */}
      <section>
        <div className="mb-5">
          <h2 className="text-xl font-semibold tracking-tight text-gray-900">
            Empleados
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Consulta, filtra y administra los empleados registrados.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <EmployeeFilters
            departments={departments}
            onFilter={handleFilter}
            loading={loadingEmployees}
          />
        </div>

        {/* Loading */}
        {loadingEmployees && (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-gray-900" />

            <p className="mt-4 text-sm text-gray-500">
              Cargando empleados...
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>
          </div>
        )}

        {/* Content */}
        {!loadingEmployees && !error && (
          <>
            {employees.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-sm font-semibold text-gray-500">
                  US
                </div>

                <h3 className="mt-5 text-base font-semibold text-gray-900">
                  No hay empleados
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
                  Todavía no hay empleados que coincidan con los
                  criterios seleccionados.
                </p>

                <Link
                  href="/dashboard/employees/new"
                  className="mt-6 inline-flex items-center rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                  <span className="mr-2 text-lg leading-none">+</span>
                  Nuevo empleado
                </Link>
              </div>
            ) : (
              <>
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                  <EmployeeTable
                    employees={employees}
                    onDeleted={handleEmployeeDeleted}
                  />
                </div>

                <div className="mt-5">
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
    </div>
  );
}