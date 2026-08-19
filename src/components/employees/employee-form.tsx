"use client";

import { FormEvent, useEffect, useState } from "react";
import type { Department } from "@/types/department";
import type { EmployeeRequest } from "@/types/employee";
import { getDepartments } from "@/services/department.service";
import { ApiError } from "@/services/api-error";

interface EmployeeFormProps {
  initialData?: EmployeeRequest;
  onSubmit: (data: EmployeeRequest) => Promise<void>;
  submitLabel: string;
}

const emptyForm: EmployeeRequest = {
  firstName: "",
  lastName: "",
  email: "",
  birthDate: "",
  phoneNumber: "",
  salary: 0,
  departmentId: 0,
};

export default function EmployeeForm({
  initialData,
  onSubmit,
  submitLabel,
}: EmployeeFormProps) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<EmployeeRequest>(
    initialData ?? emptyForm
  );

  useEffect(() => {
    const controller = new AbortController();

    async function fetchDepartments() {
      try {
        setLoadingDepartments(true);
        setError(null);

        const data = await getDepartments(controller.signal);

        setDepartments(data);
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }

        setError("No se pudieron cargar los departamentos.");
      } finally {
        if (!controller.signal.aborted) {
          setLoadingDepartments(false);
        }
      }
    }

    fetchDepartments();

    return () => {
      controller.abort();
    };
  }, []);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        name === "salary" || name === "departmentId"
          ? Number(value)
          : value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError(null);

      await onSubmit(form);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setError("Tu sesión ha expirado.");
        return;
      }

      setError("No se pudo guardar el empleado.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingDepartments) {
    return <p>Cargando departamentos...</p>;
  }

  if (error && departments.length === 0) {
    return (
      <p className="text-red-500">
        {error}
      </p>
    );
  }

  if (departments.length === 0) {
    return (
      <p className="text-gray-500">
        No hay departamentos disponibles para crear un empleado.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="firstName"
        value={form.firstName}
        onChange={handleChange}
        placeholder="Nombre"
        required
      />

      <input
        name="lastName"
        value={form.lastName}
        onChange={handleChange}
        placeholder="Apellido"
        required
      />

      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />

      <input
        type="date"
        name="birthDate"
        value={form.birthDate}
        onChange={handleChange}
        required
      />

      <input
        name="phoneNumber"
        value={form.phoneNumber}
        onChange={handleChange}
        placeholder="Teléfono"
        pattern="9[0-9]{8}"
        required
      />

      <input
        type="number"
        name="salary"
        value={form.salary}
        onChange={handleChange}
        min="0"
        step="0.01"
        required
      />

      <select
        name="departmentId"
        value={form.departmentId}
        onChange={handleChange}
        required
      >
        <option value={0} disabled>
          Selecciona un departamento
        </option>

        {departments.map((department) => (
          <option
            key={department.id}
            value={department.id}
          >
            {department.name}
          </option>
        ))}
      </select>

      {error && (
        <p className="text-red-500">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
      >
        {submitting ? "Guardando..." : submitLabel}
      </button>
    </form>
  );
}