"use client";

import { useSession } from "next-auth/react";

export default function AdminPage() {
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
        <p>Você não está logado.</p>
      </div>
    );
  }

  if (session.user.role !== "admin") {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center">
        <p>Você não tem permissão para acessar o admin.</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-80px)] flex-col items-center justify-center gap-2">
      <h1 className="text-2xl font-semibold">Área Administrativa</h1>
      <p className="text-sm text-muted-foreground">
        Você está logado como admin. (role: {session.user.role})
      </p>
    </div>
  );
}
