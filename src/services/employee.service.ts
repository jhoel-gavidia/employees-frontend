import type { Employee, PageResponse, EmployeeRequest } from "@/types/employee";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function getEmployees(
  page = 0,
  size = 10,
  signal?: AbortSignal
): Promise<PageResponse<Employee>> {
  const response = await fetch(
    `/api/employees?page=${page}&size=${size}`,
    {
      signal,
    }
  );

  if (!response.ok) {
    throw new ApiError(
      "Failed to fetch employees",
      response.status
    );
  }

  return response.json();
}

export async function createEmployee(
  employee: EmployeeRequest
): Promise<Employee> {
  const response = await fetch("/api/employees", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(employee),
  });

  if (!response.ok) {
    throw new ApiError(
      "Failed to create employee",
      response.status
    );
  }

  return response.json();
}