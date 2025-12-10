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
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/";

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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] p-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-2xl p-6 animate-fade-in">
        <h1 className="mb-1 text-center text-3xl font-semibold text-white">
          Bem-vindo
        </h1>
        <p className="mb-6 text-center text-sm text-gray-300">
          Acesse sua conta do Trading Agent
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-300">Email</label>
            <div className="relative mt-1">
              <Mail className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
              <Input
                placeholder="voce@email.com"
                className="pl-9 bg-white/10 text-white border-white/20 focus:border-primary"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-400">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-300">Senha</label>
            <div className="relative mt-1">
              <Lock className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
              <Input
                type="password"
                placeholder="••••••••"
                className="pl-9 bg-white/10 text-white border-white/20 focus:border-primary"
                {...register("password")}
              />
            </div>
            {errors.password && (
              <p className="text-sm text-red-400">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <Button
            disabled={loading}
            type="submit"
            className="w-full h-11 text-lg font-semibold shadow-lg hover:scale-[1.02] transition-transform"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
