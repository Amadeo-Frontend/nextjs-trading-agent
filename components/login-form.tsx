"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/dashboard/free";

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      redirect: false,
    });

    if (result?.error) {
      setError("Credenciais inválidas");
      setLoading(false);
      return;
    }

    router.push(callbackUrl);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-xl"
      >
        <h1 className="mb-2 text-center text-xl font-semibold">
          Entrar na conta
        </h1>

        {error && <p className="text-center text-sm text-red-400">{error}</p>}

        <div>
          <label className="text-sm">E-mail</label>
          <input
            type="email"
            className="mt-1 w-full rounded-md bg-black/30 p-2 text-sm border border-white/10"
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
          {loading ? "Entrando..." : "Entrar"}
        </Button>

        <p className="text-center text-xs text-zinc-400">
          Não possui conta?{" "}
          <a href="/register" className="text-emerald-400 hover:underline">
            Criar conta gratuita
          </a>
        </p>
      </form>
    </div>
  );
}
