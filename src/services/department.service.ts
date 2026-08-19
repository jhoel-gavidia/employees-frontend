import type { Department } from "@/types/department";
import { ApiError } from "@/services/api-error";

export async function getDepartments(
  signal?: AbortSignal
): Promise<Department[]> {
  const response = await fetch("/api/departments", {
    signal,
  });

  if (!response.ok) {
    throw new ApiError(
      "Failed to fetch departments",
      response.status
    );
  }

  return response.json();
}