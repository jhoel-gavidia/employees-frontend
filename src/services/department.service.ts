import type { Department } from "@/types/department";

import { ApiError } from "@/services/api-error";

export interface DepartmentRequest {
  name: string;
  officeLocation: string;
}

export async function getDepartments(
  signal?: AbortSignal,
): Promise<Department[]> {
  const response = await fetch("/api/departments", {
    signal,
  });

  if (!response.ok) {
    throw new ApiError(
      "Failed to fetch departments",
      response.status,
    );
  }

  return response.json();
}

export async function getDepartmentById(
  id: number,
  signal?: AbortSignal,
): Promise<Department> {
  const response = await fetch(`/api/departments/${id}`, {
    signal,
  });

  if (!response.ok) {
    throw new ApiError(
      "Failed to fetch department",
      response.status,
    );
  }

  return response.json();
}

export async function createDepartment(
  department: DepartmentRequest,
): Promise<Department> {
  const response = await fetch("/api/departments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(department),
  });

  if (!response.ok) {
    const data = await response.json();

    throw new ApiError(
      "Failed to create department",
      response.status,
      data,
    );
  }

  return response.json();
}

export async function updateDepartment(
  id: number,
  department: DepartmentRequest,
): Promise<Department> {
  const response = await fetch(`/api/departments/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(department),
  });

  if (!response.ok) {
    const data = await response.json();

    throw new ApiError(
      "Failed to update department",
      response.status,
      data,
    );
  }

  return response.json();
}

export async function deleteDepartment(
  id: number,
): Promise<void> {
  const response = await fetch(`/api/departments/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    let data: unknown;

    try {
      data = await response.json();
    } catch {
      data = null;
    }

    throw new ApiError(
      "Failed to delete department",
      response.status,
      data,
    );
  }
}