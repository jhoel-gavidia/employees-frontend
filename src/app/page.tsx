import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold">
          Employees
        </h1>

        <p className="mt-2 text-gray-500">
          Employee management system
        </p>

        <Link
          href="/login"
          className="mt-6 inline-block rounded-lg bg-black px-5 py-2 text-white"
        >
          login
        </Link>
      </div>
    </main>
  );
}