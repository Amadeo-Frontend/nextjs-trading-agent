"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, name }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message ?? "Erro inesperado");
      setLoading(false);
      return;
    }

    router.push("/dashboard/free");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-xl"
      >
        <h1 className="mb-2 text-center text-xl font-semibold">
          Criar conta grátis
        </h1>

        {error && <p className="text-center text-sm text-red-400">{error}</p>}

        <div>
          <label className="text-sm">Nome</label>
          <input
            className="mt-1 w-full rounded-md bg-black/30 p-2 text-sm outline-none border border-white/10"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-sm">E-mail</label>
          <input
            type="email"
            className="mt-1 w-full rounded-md bg-black/30 p-2 text-sm outline-none border border-white/10"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-emerald-500 text-black hover:bg-emerald-400"
        >
          {loading ? "Criando..." : "Criar conta"}
        </Button>

        <p className="text-center text-xs text-zinc-400">
          Já possui conta?{" "}
          <a href="/login" className="text-emerald-400 hover:underline">
            Entrar
          </a>
        </p>
      </form>
    </div>
  );
}
