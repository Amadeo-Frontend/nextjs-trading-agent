"use client";

import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";
import { HoverEffect } from "@/components/ui/card-hover-effect";

const premiumCards = [
  {
    title: "Backtests realizados",
    description: "Total de backtests concluídos com a técnica de gatilho.",
    link: "#",
  },
  {
    title: "Winrate médio",
    description: "Taxa média de acerto considerando todos os testes.",
    link: "#",
  },
  {
    title: "Gatilhos testados",
    description: "Quantidade de variações de gatilho já analisadas.",
    link: "#",
  },
];

export default function DashboardPremium() {
  return (
    <div className="relative min-h-[calc(100vh-3rem)] overflow-hidden">
      {/* BG premium com pontos animados */}
      <DottedGlowBackground
        className="absolute inset-0"
        backgroundOpacity={0.15}
        opacity={0.7}
        speedScale={0.9}
      />

      {/* Conteúdo por cima do BG */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-300 via-fuchsia-300 to-purple-200 bg-clip-text text-transparent">
          Dashboard Premium
        </h1>

        <p className="text-sm text-zinc-300 mb-6 max-w-xl">
          Acompanhe rapidamente seus resultados com backtests automáticos,
          winrate e métricas essenciais para a técnica de gatilho universal.
        </p>

        {/* Cards usando o componente HoverEffect do Aceternity */}
        <HoverEffect items={premiumCards} className="mt-4" />
      </div>
    </div>
  );
}
