"use client";

import type { FormEvent } from "react";
import { useState } from "react";

import type { Department } from "@/types/department";
import type { EmployeeFilter } from "@/services/employee.service";

interface EmployeeFiltersProps {
  departments: Department[];
  onFilter: (filters: EmployeeFilter) => void;
  loading: boolean;
}

export default function EmployeeFilters({
  departments,
  onFilter,
  loading,
}: EmployeeFiltersProps) {
  const [name, setName] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const filters: EmployeeFilter = {};

    const trimmedName = name.trim();

    if (trimmedName) {
      filters.name = trimmedName;
    }

    if (departmentId) {
      filters.departmentId = Number(departmentId);
    }

    if (minSalary) {
      filters.minSalary = Number(minSalary);
    }

    if (maxSalary) {
      filters.maxSalary = Number(maxSalary);
    }

    onFilter(filters);
  }

  function handleClear() {
    setName("");
    setDepartmentId("");
    setMinSalary("");
    setMaxSalary("");

    onFilter({});
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 lg:grid-cols-[2fr_1.5fr_1fr_1fr]">
        <div>
          <label
            htmlFor="employee-name"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Empleado
          </label>

          <input
            id="employee-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Buscar por nombre..."
            disabled={loading}
            className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 disabled:cursor-not-allowed disabled:bg-gray-50"
          />
        </div>

        <div>
          <label
            htmlFor="employee-department"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Departamento
          </label>

          <select
            id="employee-department"
            value={departmentId}
            onChange={(event) => setDepartmentId(event.target.value)}
            disabled={loading}
            className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100 disabled:cursor-not-allowed disabled:bg-gray-50"
          >
            <option value="">Todos los departamentos</option>

            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="min-salary"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Salario mínimo
          </label>

          <input
            id="min-salary"
            type="number"
            value={minSalary}
            onChange={(event) => setMinSalary(event.target.value)}
            placeholder="S/ 0.00"
            min="0"
            step="0.01"
            disabled={loading}
            className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 disabled:cursor-not-allowed disabled:bg-gray-50"
          />
        </div>

        <div>
          <label
            htmlFor="max-salary"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Salario máximo
          </label>

          <input
            id="max-salary"
            type="number"
            value={maxSalary}
            onChange={(event) => setMaxSalary(event.target.value)}
            placeholder="S/ 0.00"
            min="0"
            step="0.01"
            disabled={loading}
            className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 disabled:cursor-not-allowed disabled:bg-gray-50"
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={handleClear}
          disabled={loading}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Limpiar
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Filtrando..." : "Filtrar"}
        </button>
      </div>
    </form>
  );
}