"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function AppDashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center">
        Carregando sessão...
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center">
        <p>Sem sessão. Faça login novamente.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col gap-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Logado como {session.user.email} (role: {session.user.role})
          </p>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-sm underline"
        >
          Sair
        </button>
      </header>

      <main className="flex flex-col gap-2">
        <Link href="/agente" className="text-sm text-primary underline">
          Ir para /agente
        </Link>
        <Link href="/admin" className="text-sm text-primary underline">
          Ir para /admin
        </Link>
      </main>
    </div>
  );
}
