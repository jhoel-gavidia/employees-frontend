export type Role = "ADMIN" | "USER";

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  role: Role;
}