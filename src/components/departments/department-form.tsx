"use client";

import { FormEvent, useState } from "react";

import type { DepartmentRequest } from "@/types/department";
import { ApiError } from "@/services/api-error";
import type { ValidationErrorResponse } from "@/services/validation-error";

interface DepartmentFormProps {
  initialData?: DepartmentRequest;
  onSubmit: (data: DepartmentRequest) => Promise<void>;
  submitLabel: string;
}

const emptyForm: DepartmentRequest = {
  name: "",
  officeLocation: "",
};

export default function DepartmentForm({
  initialData,
  onSubmit,
  submitLabel,
}: DepartmentFormProps) {
  const [form, setForm] = useState<DepartmentRequest>(
    () => initialData ?? emptyForm,
  );

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError(null);

      await onSubmit({
        name: form.name.trim(),
        officeLocation: form.officeLocation.trim(),
      });
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setError("Tu sesión ha expirado.");
        return;
      }

      if (error instanceof ApiError && error.status === 400) {
        const data = error.data as ValidationErrorResponse;

        setError(
          data.errors
            ? Object.values(data.errors).join(" ")
            : "Los datos ingresados no son válidos.",
        );

        return;
      }

      if (error instanceof ApiError && error.status === 404) {
        setError("El departamento no existe.");
        return;
      }

      if (error instanceof ApiError && error.status === 409) {
        setError("Ya existe un departamento con ese nombre.");
        return;
      }

      setError("No se pudo guardar el departamento.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="name"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Nombre del departamento
        </label>

        <input
          id="name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          placeholder="Ej. Recursos Humanos"
          required
          disabled={submitting}
          className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 disabled:cursor-not-allowed disabled:bg-gray-50"
        />
      </div>

      <div>
        <label
          htmlFor="officeLocation"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Ubicación de oficina
        </label>

        <input
          id="officeLocation"
          name="officeLocation"
          type="text"
          value={form.officeLocation}
          onChange={handleChange}
          placeholder="Ej. Lima, Perú"
          required
          disabled={submitting}
          className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 disabled:cursor-not-allowed disabled:bg-gray-50"
        />
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">
            {error}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex h-11 items-center justify-center rounded-xl bg-gray-900 px-5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Guardando..." : submitLabel}
      </button>
    </form>
  );
}