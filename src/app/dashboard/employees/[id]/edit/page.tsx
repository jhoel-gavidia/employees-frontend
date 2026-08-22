"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import type { Employee, EmployeeRequest } from "@/types/employee";

import {
  getEmployeeById,
  updateEmployee,
} from "@/services/employee.service";

import { ApiError } from "@/services/api-error";

import EmployeeForm from "@/components/employees/employee-form";

interface EditEmployeePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditEmployeePage({
  params,
}: EditEmployeePageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadEmployee() {
      const employeeId = Number(id);

      if (Number.isNaN(employeeId)) {
        setError("ID de empleado inválido.");
        setLoading(false);
        return;
      }

      try {
        const data = await getEmployeeById(
          employeeId,
          controller.signal,
        );

        if (!controller.signal.aborted) {
          setEmployee(data);
          setLoading(false);
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

        if (error instanceof ApiError && error.status === 404) {
          setError("Empleado no encontrado.");
        } else {
          setError("No se pudo cargar el empleado.");
        }

        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadEmployee();

    return () => {
      controller.abort();
    };
  }, [id, router]);

  async function handleUpdate(data: EmployeeRequest) {
    const employeeId = Number(id);

    await updateEmployee(employeeId, data);

    router.push("/dashboard");
    router.refresh();
  }

  if (loading) {
    return (
      <main className="min-h-screen p-8">
        <p className="text-sm text-gray-500">
          Cargando empleado...
        </p>
      </main>
    );
  }

  if (error || !employee) {
    return (
      <main className="min-h-screen p-8">
        <p className="text-sm text-red-500">
          {error ?? "Empleado no encontrado."}
        </p>

        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm text-white"
        >
          Volver al dashboard
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold tracking-tight">
        Editar empleado
      </h1>

      <div className="mt-8 max-w-xl">
        <EmployeeForm
          initialData={{
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email,
            birthDate: employee.birthDate,
            phoneNumber: employee.phoneNumber,
            salary: employee.salary,
            departmentId: employee.departmentId,
          }}
          submitLabel="Guardar cambios"
          onSubmit={handleUpdate}
        />
      </div>
    </main>
  );
}