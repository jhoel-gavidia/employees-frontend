import type { Employee, PageResponse } from "@/types/employee";

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
    throw new Error("Failed to fetch employees");
  }

  return response.json();
}