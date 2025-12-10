// app/dashboard/premium/page.tsx
"use client";

import { useMemo } from "react";
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { Crown, BarChart2, Clock, Zap, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type FeatureItem = {
  title: string;
  description: string;
  link: string;
};

export const metadata = {
  title: "Dashboard Premium | Trading Agent",
};

export default function PremiumDashboardPage() {
  const features: FeatureItem[] = useMemo(
    () => [
      {
        title: "Backtests em 1 minuto",
        description:
          "Simule sua técnica de gatilho universal com poucos cliques e veja o resultado em segundos.",
        link: "#",
      },
      {
        title: "Histórico organizado",
        description:
          "Guarde cada backtest com parâmetros, datas e observações para comparar setups.",
        link: "#",
      },
      {
        title: "Métricas completas",
        description:
          "Winrate, payoff, drawdown, sequência de gains/losses e muito mais em um só painel.",
        link: "#",
      },
      {
        title: "Fluxo padronizado",
        description:
          "Sempre a mesma lógica de teste, para evitar viés e erro humano na hora de avaliar a estratégia.",
        link: "#",
      },
      {
        title: "Visão por setup",
        description:
          "Agrupe resultados por setup, horário, ativo ou período para enxergar rapidamente onde o método funciona.",
        link: "#",
      },
      {
        title: "Exportação e relatórios",
        description:
          "Exporte os resultados para relatório ou apresentação em poucos cliques.",
        link: "#",
      },
    ],
    []
  );

  return (
    <div className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-black text-zinc-50">
      {/* BG com dotted glow */}
      <DottedGlowBackground
        className="absolute inset-0 -z-20"
        backgroundOpacity={0.1}
        opacity={0.6}
        radius={2}
        gap={14}
        speedScale={0.9}
        darkColor="rgba(255,255,255,0.18)"
        darkGlowColor="rgba(200,100,255,0.35)"
      />

      {/* Overlays de cor */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 top-0 h-80 w-80 rounded-full bg-purple-600/30 blur-3xl" />
        <div className="absolute -right-40 top-32 h-80 w-80 rounded-full bg-emerald-500/25 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 to-transparent" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 py-8 md:px-8">
        {/* HERO */}
        <section className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/40 bg-purple-500/10 px-4 py-1 text-xs text-purple-100">
            <Crown className="h-4 w-4 text-amber-300" />
            <span>Plano Premium ativo</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              <span className="bg-gradient-to-r from-emerald-300 via-sky-300 to-purple-300 bg-clip-text text-transparent">
                Máquina de backtests em tempo real
              </span>
            </h1>
            <p className="max-w-2xl text-sm text-zinc-300 md:text-base">
              Aqui é onde você roda e organiza todos os seus backtests.
              Configure o cenário, execute o teste e acompanhe as métricas de
              performance sem sair da tela.
            </p>
          </div>
        </section>

        {/* Cards principais – usando suas classes premium */}
        <section className="grid gap-4 md:grid-cols-4">
          <div className="premium-card col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="premium-title">Backtests realizados</p>
                <p className="premium-number">47</p>
              </div>
              <Clock className="h-6 w-6 text-emerald-300" />
            </div>
            <p className="mt-2 text-xs text-zinc-200/80">
              Contagem apenas ilustrativa. Depois vamos ligar isso nos dados
              reais do banco.
            </p>
          </div>

          <div className="premium-card">
            <p className="premium-title">Winrate médio</p>
            <p className="premium-number">62%</p>
            <p className="mt-2 flex items-center gap-1 text-xs text-emerald-200/80">
              <Activity className="h-3 w-3" />
              Últimos 30 dias
            </p>
          </div>

          <div className="premium-card">
            <p className="premium-title">Payoff médio</p>
            <p className="premium-number">1.85</p>
            <p className="mt-2 flex items-center gap-1 text-xs text-zinc-200/80">
              <BarChart2 className="h-3 w-3 text-sky-300" />
              Risco x retorno
            </p>
          </div>
        </section>

        {/* Hover cards de features (Aceternity card-hover-effect) */}
        <section className="mt-4">
          <h2 className="mb-3 text-sm font-medium text-zinc-200">
            O que este painel faz por você
          </h2>
          <HoverEffect items={features} className="grid gap-3 md:grid-cols-3" />
        </section>

        {/* Bloco final chamativo */}
        <section className="mt-4 rounded-2xl border border-purple-500/40 bg-gradient-to-br from-zinc-950/80 via-zinc-900/90 to-zinc-950/80 p-5 shadow-[0_20px_80px_rgba(168,85,247,0.45)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-200">
                fluxo de trabalho
              </p>
              <p className="mt-1 text-sm text-zinc-200">
                Configure parâmetros, rode o backtest e veja o resumo com
                clareza. Sempre o mesmo processo, sem perda de tempo nem
                improviso.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs text-zinc-200">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1">
                <Zap className="h-3 w-3 text-emerald-300" />
                Execução rápida
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 px-3 py-1">
                <BarChart2 className="h-3 w-3 text-sky-300" />
                Métricas claras
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
