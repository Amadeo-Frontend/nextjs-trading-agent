"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function AppDashboardPage() {
  const { data, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        Carregando sessão...
      </div>
    );
  }

  if (!data?.user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Sem sessão. Tente fazer login novamente.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col gap-4 p-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Logado como {data.user.email} (role: {data.user.role})
          </p>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-sm underline"
        >
          Sair
        </button>
      </header>

      <main className="flex flex-col gap-4">
        <Link href="/agente" className="text-blue-500 underline">
          Ir para /agente
        </Link>
        <Link href="/admin" className="text-blue-500 underline">
          Ir para /admin
        </Link>
      </main>
    </div>
  );
}
