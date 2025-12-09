"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (password !== confirm) {
      setErrorMsg("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        setErrorMsg(data.detail || "Erro ao criar conta.");
        return;
      }

      // Sucesso
      router.push("/login?registered=1");
    } catch (error) {
      console.error(error);
      setErrorMsg("Erro inesperado.");
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-md">
      <h1 className="text-xl font-bold mb-4 text-center">Criar Conta</h1>

      {errorMsg && (
        <p className="text-red-500 text-sm mb-3">
          {errorMsg}
        </p>
      )}

      <form onSubmit={handleRegister} className="space-y-4">

        <div>
          <label className="text-sm font-medium">Nome</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mt-1 px-3 py-2 rounded-md border dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800"
            placeholder="Seu nome"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 px-3 py-2 rounded-md border dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800"
            placeholder="email@exemplo.com"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Senha</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 px-3 py-2 rounded-md border dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Confirmar senha</label>
          <input
            type="password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full mt-1 px-3 py-2 rounded-md border dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium"
        >
          {loading ? "Criando conta..." : "Criar conta"}
        </button>
      </form>

      <div className="text-center mt-4 text-sm">
        Já tem conta?{" "}
        <a href="/login" className="text-blue-600 hover:underline">
          Entrar
        </a>
      </div>
    </div>
  );
}
