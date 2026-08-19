import { ApiError } from "@/services/api-error";

import type { Employee, PageResponse, EmployeeRequest } from "@/types/employee";

export interface EmployeeFilter {
  name?: string;
  departmentId?: number;
  minSalary?: number;
  maxSalary?: number;
}

export async function getEmployees(
  page = 0,
  size = 10,
  signal?: AbortSignal,
): Promise<PageResponse<Employee>> {
  const response = await fetch(`/api/employees?page=${page}&size=${size}`, {
    signal,
  });

  if (!response.ok) {
    throw new ApiError("Failed to fetch employees", response.status);
  }

  return response.json();
}

export async function createEmployee(
  employee: EmployeeRequest,
): Promise<Employee> {
  const response = await fetch("/api/employees", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(employee),
  });

  if (!response.ok) {
  const data = await response.json();

  throw new ApiError(
    "Failed to create employee",
    response.status,
    data
  );
}

  return response.json();
}

export async function getEmployeeById(
  id: number,
  signal?: AbortSignal,
): Promise<Employee> {
  const response = await fetch(`/api/employees/${id}`, {
    signal,
  });

  if (!response.ok) {
    throw new ApiError("Failed to fetch employee", response.status);
  }

  return response.json();
}

export async function updateEmployee(
  id: number,
  employee: EmployeeRequest,
): Promise<Employee> {
  const response = await fetch(`/api/employees/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(employee),
  });

  if (!response.ok) {
    throw new ApiError("Failed to update employee", response.status);
  }

  return response.json();
}

export async function deleteEmployee(id: number): Promise<void> {
  const response = await fetch(`/api/employees/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new ApiError("Failed to delete employee", response.status);
  }
}

export async function filterEmployees(
  filters: EmployeeFilter,
  page = 0,
  size = 10,
  signal?: AbortSignal
): Promise<PageResponse<Employee>> {
  const params = new URLSearchParams();

  if (filters.name) {
    params.set("name", filters.name);
  }

  if (filters.departmentId !== undefined) {
    params.set("departmentId", String(filters.departmentId));
  }

  if (filters.minSalary !== undefined) {
    params.set("minSalary", String(filters.minSalary));
  }

  if (filters.maxSalary !== undefined) {
    params.set("maxSalary", String(filters.maxSalary));
  }

  params.set("page", String(page));
  params.set("size", String(size));

  const response = await fetch(
    `/api/employees/filter?${params.toString()}`,
    {
      signal,
    }
  );

  if (!response.ok) {
    throw new ApiError(
      "Failed to filter employees",
      response.status
    );
  }

  return response.json();
}
