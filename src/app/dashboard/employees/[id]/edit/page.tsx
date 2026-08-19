"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { EmployeeRequest } from "@/types/employee";
import {
  ApiError,
  getEmployeeById,
  updateEmployee,
} from "@/services/employee.service";
import EmployeeForm from "@/components/employees/employee-form";

export default function EditEmployeePage() {
  const router = useRouter();
  const params = useParams();

  const id = Number(params.id);

  const [employee, setEmployee] = useState<EmployeeRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchEmployee() {
      try {
        setLoading(true);
        setError(null);

        const data = await getEmployeeById(id, controller.signal);

        setEmployee({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          birthDate: data.birthDate,
          phoneNumber: data.phoneNumber,
          salary: data.salary,
          departmentId: data.departmentId,
        });
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

        setError("No se pudo cargar el empleado.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchEmployee();

    return () => {
      controller.abort();
    };
  }, [id, router]);

  async function handleUpdate(data: EmployeeRequest) {
    try {
      await updateEmployee(id, data);
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        router.push("/login");
        return;
      }

      throw error;
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen p-8">
        <p>Cargando empleado...</p>
      </main>
    );
  }

  if (error || !employee) {
    return (
      <main className="min-h-screen p-8">
        <p className="text-red-500">
          {error ?? "Empleado no encontrado."}
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">
        Editar empleado
      </h1>

      <div className="mt-8 max-w-xl">
        <EmployeeForm
          initialData={employee}
          submitLabel="Actualizar empleado"
          onSubmit={handleUpdate}
        />
      </div>
    </main>
  );
}