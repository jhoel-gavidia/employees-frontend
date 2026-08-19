"use client";

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

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const filters: EmployeeFilter = {};

    if (name.trim()) {
      filters.name = name.trim();
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
    <form
      onSubmit={handleSubmit}
      className="mt-6 space-y-4"
    >
      <div className="grid gap-4 md:grid-cols-4">
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Buscar por nombre"
        />

        <select
          value={departmentId}
          onChange={(event) => setDepartmentId(event.target.value)}
        >
          <option value="">
            Todos los departamentos
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

        <input
          type="number"
          value={minSalary}
          onChange={(event) => setMinSalary(event.target.value)}
          placeholder="Salario mínimo"
          min="0"
          step="0.01"
        />

        <input
          type="number"
          value={maxSalary}
          onChange={(event) => setMaxSalary(event.target.value)}
          placeholder="Salario máximo"
          min="0"
          step="0.01"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
        >
          {loading ? "Filtrando..." : "Filtrar"}
        </button>

        <button
          type="button"
          onClick={handleClear}
          disabled={loading}
        >
          Limpiar
        </button>
      </div>
    </form>
  );
}