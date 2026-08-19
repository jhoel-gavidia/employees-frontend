"use client";

import { useRouter } from "next/navigation";
import type { EmployeeRequest } from "@/types/employee";
import { createEmployee } from "@/services/employee.service";
import EmployeeForm from "@/components/employees/employee-form";

export default function NewEmployeePage() {
  const router = useRouter();

  async function handleCreateEmployee(
    data: EmployeeRequest
  ) {
    await createEmployee(data);

    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">
        Nuevo empleado
      </h1>

      <div className="mt-8 max-w-xl">
        <EmployeeForm
          submitLabel="Crear empleado"
          onSubmit={handleCreateEmployee}
        />
      </div>
    </main>
  );
}