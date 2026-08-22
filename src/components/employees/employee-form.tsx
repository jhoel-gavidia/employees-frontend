"use client";

import {
  FormEvent,
  useEffect,
  useState,
  type ChangeEvent,
} from "react";

import type { Department } from "@/types/department";
import type { EmployeeRequest } from "@/types/employee";

import { getDepartments } from "@/services/department.service";
import { ApiError } from "@/services/api-error";
import type { ValidationErrorResponse } from "@/services/validation-error";

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
    () => initialData ?? emptyForm,
  );

  useEffect(() => {
    const controller = new AbortController();

    async function fetchDepartments() {
      try {
        const data = await getDepartments(controller.signal);

        if (!controller.signal.aborted) {
          setDepartments(data);
          setLoadingDepartments(false);
        }
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }

        if (error instanceof ApiError && error.status === 401) {
          setError("Tu sesión ha expirado.");
        } else {
          setError("No se pudieron cargar los departamentos.");
        }

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
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError(null);

      await onSubmit(form);
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          setError("Tu sesión ha expirado.");
          return;
        }

        if (error.status === 400) {
          const data = error.data as ValidationErrorResponse;

          if (data?.errors) {
            setError(Object.values(data.errors).join(" "));
          } else {
            setError("Los datos enviados no son válidos.");
          }

          return;
        }

        if (error.status === 404) {
          setError("El empleado o departamento no existe.");
          return;
        }

        if (error.status === 409) {
          setError("Ya existe un empleado con esos datos.");
          return;
        }
      }

      setError("No se pudo guardar el empleado.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingDepartments) {
    return (
      <p className="text-sm text-gray-500">
        Cargando departamentos...
      </p>
    );
  }

  if (departments.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="text-sm text-gray-500">
          {error ?? "No hay departamentos disponibles."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="firstName"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Nombre
        </label>

        <input
          id="firstName"
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
        />
      </div>

      <div>
        <label
          htmlFor="lastName"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Apellido
        </label>

        <input
          id="lastName"
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Email
        </label>

        <input
          id="email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
        />
      </div>

      <div>
        <label
          htmlFor="birthDate"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Fecha de nacimiento
        </label>

        <input
          id="birthDate"
          type="date"
          name="birthDate"
          value={form.birthDate}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
        />
      </div>

      <div>
        <label
          htmlFor="phoneNumber"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Teléfono
        </label>

        <input
          id="phoneNumber"
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={handleChange}
          pattern="9[0-9]{8}"
          placeholder="999999999"
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
        />
      </div>

      <div>
        <label
          htmlFor="salary"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Salario
        </label>

        <input
          id="salary"
          type="number"
          name="salary"
          value={form.salary}
          onChange={handleChange}
          min="0"
          step="0.01"
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
        />
      </div>

      <div>
        <label
          htmlFor="departmentId"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Departamento
        </label>

        <select
          id="departmentId"
          name="departmentId"
          value={form.departmentId}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
        >
          <option value={0} disabled>
            Selecciona un departamento
          </option>

          {departments.map((department) => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Guardando..." : submitLabel}
      </button>
    </form>
  );
}