// components/login-form.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { Loader2, Mail, Lock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().email("Digite um email válido"),
  password: z.string().min(6, "Mínimo de 6 caracteres"),
});

type LoginSchema = z.infer<typeof schema>;

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/app";

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: LoginSchema) {
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
      callbackUrl,
    });

    setLoading(false);

    if (res?.ok) {
      toast.success("Login realizado com sucesso!");
      router.push(callbackUrl);
    } else {
      toast.error("Credenciais inválidas.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-black via-zinc-950 to-black px-4">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-800/80 bg-zinc-950/90 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.9)] backdrop-blur-md">
        <h1 className="mb-1 text-center text-2xl font-semibold">Login</h1>
        <p className="mb-6 text-center text-xs text-zinc-400">
          Acesse o Trading Agent com seu e-mail cadastrado.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs text-zinc-300">Email</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-2 top-2 h-4 w-4 text-zinc-500" />
              <Input
                placeholder="seuemail@email.com"
                className="border-zinc-800 bg-zinc-950/80 pl-8 text-sm"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs text-zinc-300">Senha</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-2 top-2 h-4 w-4 text-zinc-500" />
              <Input
                type="password"
                placeholder="••••••••"
                className="border-zinc-800 bg-zinc-950/80 pl-8 text-sm"
                {...register("password")}
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            disabled={loading}
            type="submit"
            className="mt-2 w-full rounded-full bg-emerald-500 text-sm font-medium text-black shadow-[0_15px_45px_rgba(16,185,129,0.7)] transition-all hover:bg-emerald-400"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Entrar"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
