"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();

  const error = params.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setLoading(false);
      return; // erro será exibido automaticamente
    }

    router.push("/agente");
  }

  return (
    <div className="w-full max-w-sm bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-md">
      <h1 className="text-xl font-bold mb-4 text-center">Login</h1>

      {error && (
        <p className="text-red-500 text-sm mb-3">
          {error === "CredentialsSignin"
            ? "Email ou senha incorretos."
            : "Erro ao fazer login."}
        </p>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            required
            className="w-full mt-1 px-3 py-2 rounded-md border dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@exemplo.com"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Senha</label>
          <input
            type="password"
            required
            className="w-full mt-1 px-3 py-2 rounded-md border dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <div className="text-center mt-4 text-sm">
        Não tem conta?{" "}
        <a href="/register" className="text-blue-600 hover:underline">
          Criar conta
        </a>
      </div>
    </div>
  );
}
