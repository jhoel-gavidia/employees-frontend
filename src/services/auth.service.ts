import type { AuthResponse } from "@/types/auth";

interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export async function login(
  credentials: LoginRequest
): Promise<AuthResponse> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error("Authentication failed");
  }

  return response.json();
}