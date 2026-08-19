"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      router.push("/login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">
        Dashboard
      </h1>

      <p className="mt-2 text-gray-500">
        Bienvenido al sistema de empleados.
      </p>

      <button
        onClick={handleLogout}
        disabled={loading}
      >
        {loading ? "Logging out..." : "Logout"}
      </button>
    </main>
  );
}