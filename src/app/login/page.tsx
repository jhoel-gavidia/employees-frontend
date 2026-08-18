"use client";

import { FormEvent, useState } from "react";
import { login } from "@/services/auth.service";

export default function LoginPage() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await login({
        usernameOrEmail,
        password,
      });

      console.log(response);
    } catch {
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold">
            Sign in
          </h1>

          <p className="mt-2 text-gray-500">
            Sign in to your account.
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="usernameOrEmail">
            Username or email
          </label>

          <input
            id="usernameOrEmail"
            type="text"
            value={usernameOrEmail}
            onChange={(event) =>
              setUsernameOrEmail(event.target.value)
            }
            required
            className="w-full rounded-lg border px-4 py-2"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password">
            Password
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            required
            className="w-full rounded-lg border px-4 py-2"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600">
            Invalid username or password.
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}