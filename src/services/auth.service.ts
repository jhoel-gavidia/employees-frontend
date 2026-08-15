import { apiFetch } from "@/src/lib/api";
import type { AuthResponse, LoginRequest } from "@/src/types/auth"

export function login(
  credentials: LoginRequest
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}