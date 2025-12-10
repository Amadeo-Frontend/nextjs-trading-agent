"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            name,
            password,
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.detail || "Erro ao registrar");
        setLoading(false);
        return;
      }

      // Sucesso → redirecionar para login
      router.push("/login?registered=1");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setErrorMsg("Erro de conexão com servidor.");
      console.error(err);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-xl">Criar Conta</CardTitle>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleRegister}>
            {/* Campo Nome */}
            <div className="space-y-1">
              <Label>Nome</Label>
              <Input
                type="text"
                value={name}
                placeholder="Seu nome"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Campo Email */}
            <div className="space-y-1">
              <Label>E-mail</Label>
              <Input
                type="email"
                value={email}
                placeholder="seu@email.com"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Campo Senha */}
            <div className="space-y-1">
              <Label>Senha</Label>
              <Input
                type="password"
                value={password}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Erro */}
            {errorMsg && (
              <p className="text-red-500 text-sm text-center">{errorMsg}</p>
            )}

            {/* Botão */}
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Registrando..." : "Criar conta"}
            </Button>

            {/* Link para login */}
            <p className="text-sm text-center mt-2">
              Já tem conta?{" "}
              <Link className="text-blue-500 hover:underline" href="/login">
                Entrar
              </Link>
            </p>

            <p className="text-xs text-center text-muted-foreground mt-1">
              Sua conta será analisada antes da liberação.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
