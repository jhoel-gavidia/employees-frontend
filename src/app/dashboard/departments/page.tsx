"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import type { Department } from "@/types/department";

import { getDepartments } from "@/services/department.service";
import { ApiError } from "@/services/api-error";

import DepartmentTable from "@/components/departments/department-table";

export default function DepartmentsPage() {
  const router = useRouter();

  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadDepartments() {
      try {
        const data = await getDepartments(controller.signal);

        if (!controller.signal.aborted) {
          setDepartments(data);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        if (error instanceof ApiError && error.status === 401) {
          router.push("/login");
          return;
        }

        if (!controller.signal.aborted) {
          setError("No se pudieron cargar los departamentos.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadDepartments();

    return () => {
      controller.abort();
    };
  }, [router]);

  function handleDepartmentDeleted(id: number) {
    setDepartments((current) =>
      current.filter((department) => department.id !== id),
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">Administración</p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
            Departamentos
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-gray-500">
            Administra las áreas y ubicaciones de tu organización.
          </p>
        </div>

        <Link
          href="/dashboard/departments/new"
          className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800"
        >
          <span className="mr-2 text-base">+</span>
          Nuevo departamento
        </Link>
      </header>

      {loading && (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-gray-900" />

          <p className="mt-4 text-sm text-gray-500">
            Cargando departamentos...
          </p>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm font-medium text-red-700">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {departments.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-2xl">
                🏢
              </div>

              <h2 className="mt-5 text-base font-semibold text-gray-900">
                No hay departamentos
              </h2>

              <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
                Todavía no hay departamentos registrados.
              </p>

              <Link
                href="/dashboard/departments/new"
                className="mt-6 inline-flex items-center rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                + Nuevo departamento
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <DepartmentTable
                departments={departments}
                onDeleted={handleDepartmentDeleted}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
