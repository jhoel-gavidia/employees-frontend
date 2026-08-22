"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const pathname = usePathname();
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

  const isEmployeesActive =
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/employees");

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-white">
        <div className="flex h-16 items-center border-b px-6">
          <Link
            href="/dashboard"
            className="text-xl font-bold tracking-tight"
          >
            Employees
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Gestión
          </p>

          <div className="space-y-1">
            <Link
              href="/dashboard"
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                pathname === "/dashboard"
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <span>▦</span>
              Dashboard
            </Link>

            <Link
              href="/dashboard"
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isEmployeesActive
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <span>♙</span>
              Empleados
            </Link>

            <Link
              href="/dashboard/departments"
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                pathname.startsWith("/dashboard/departments")
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <span>▤</span>
              Departamentos
            </Link>
          </div>
        </nav>

        <div className="border-t p-4">
          <div className="mb-3 rounded-lg bg-gray-50 px-3 py-3">
            <p className="text-sm font-semibold">Jhoel</p>
            <p className="text-xs text-gray-500">
              Administrador
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loading}
            className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50"
          >
            {loading ? "Cerrando sesión..." : "Cerrar sesión"}
          </button>
        </div>
      </aside>

      <div className="pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white/95 px-8 backdrop-blur">
          <div>
            <p className="text-sm font-medium text-gray-900">
              Sistema de empleados
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
              J
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-medium">Jhoel</p>
              <p className="text-xs text-gray-500">
                Administrador
              </p>
            </div>
          </div>
        </header>

        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}