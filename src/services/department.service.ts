import type { Department } from "@/types/department";

export async function getDepartments(
  signal?: AbortSignal
): Promise<Department[]> {
  const response = await fetch("/api/departments", {
    signal,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch departments");
  }

  return response.json();
}