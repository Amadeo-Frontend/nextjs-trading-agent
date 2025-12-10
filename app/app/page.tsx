// app/app/page.tsx
"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Brain,
  LineChart,
  Lock,
  Sparkles,
  ChevronRight,
  Crown,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AppDashboardPage() {
  const { data: session } = useSession();
  const role = session?.user?.role;
  const isPremium = role === "admin"; // depois trocamos para um campo de plano

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-zinc-50">
      {/* fundo dotted glow premium */}
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#27272a_1px,transparent_0)] bg-[size:18px_18px]" />
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-purple-700/40 via-transparent to-transparent blur-2xl" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-emerald-600/30 via-transparent to-transparent blur-2xl" />
      </div>

      <main className="relative mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-4 py-8 md:px-8">
        {/* header / título */}
        <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight md:text-3xl">
              <Sparkles className="h-5 w-5 text-amber-400" />
              Trading Agent
            </h1>
            <p className="text-xs text-zinc-400 md:text-sm">
              Selecione abaixo como deseja usar o agente.{" "}
              {isPremium ? (
                <span className="inline-flex items-center gap-1 text-amber-300">
                  <Crown className="h-3 w-3" />
                  Modo premium habilitado.
                </span>
              ) : (
                <span className="text-zinc-500">
                  Backtests completos estarão disponíveis no plano premium.
                </span>
              )}
            </p>
          </div>

          {session?.user && (
            <div className="rounded-full border border-zinc-800 bg-zinc-950/80 px-3 py-1 text-[11px] text-zinc-300 backdrop-blur">
              Logado como{" "}
              <span className="font-medium">{session.user.email}</span>
            </div>
          )}
        </header>

        {/* cards principais */}
        <section className="grid gap-4 md:grid-cols-2">
          {/* Agente especialista */}
          <Card className="group border-zinc-800/70 bg-zinc-950/80 shadow-[0_18px_55px_rgba(15,23,42,0.7)] backdrop-blur-md transition-all hover:-translate-y-1 hover:border-emerald-400/70 hover:shadow-[0_28px_70px_rgba(34,197,94,0.55)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Brain className="h-4 w-4" />
                </span>
                Agente Especialista
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 text-sm text-zinc-300">
              <p>
                Tire dúvidas sobre mercado, técnica e conceitos com um agente de
                IA treinado para o seu fluxo de trade.
              </p>
              <Button
                asChild
                className="group relative w-fit translate-y-0 rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-black shadow-[0_10px_35px_rgba(16,185,129,0.6)] transition-all hover:-translate-y-0.5"
              >
                <Link href="/agente">
                  Abrir agente
                  <ChevronRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Backtests */}
          <Card className="group border-zinc-800/70 bg-zinc-950/80 shadow-[0_18px_55px_rgba(24,24,27,0.7)] backdrop-blur-md transition-all hover:-translate-y-1 hover:border-purple-400/70 hover:shadow-[0_28px_70px_rgba(168,85,247,0.55)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                  <LineChart className="h-4 w-4" />
                </span>
                Backtests
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 text-sm text-zinc-300">
              <p>
                Rode backtests por período no timeframe de 1m e veja winrate,
                payoff e métricas da sua técnica.
              </p>

              {isPremium ? (
                <Button
                  asChild
                  className="group relative w-fit translate-y-0 rounded-full bg-purple-500 px-4 py-1.5 text-xs font-semibold text-black shadow-[0_10px_35px_rgba(168,85,247,0.6)] transition-all hover:-translate-y-0.5"
                >
                  <Link href="/backtest">
                    Abrir backtests
                    <ChevronRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </Button>
              ) : (
                <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/40 bg-purple-950/40 px-3 py-1 text-[11px] text-purple-200">
                  <Lock className="h-3 w-3" />
                  Em breve no plano premium.
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
