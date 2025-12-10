import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  LineChart,
  Shield,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] w-full bg-gradient-to-br from-[#050505] via-[#0b0b0b] to-black text-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10">
        {/* HERO */}
        <section className="hero-glass relative overflow-hidden">
          {/* brilho de fundo */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.06),_transparent_60%)]" />

          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-emerald-300 ring-1 ring-emerald-500/40">
                <Sparkles className="h-3 w-3 animate-pulse" />
                Plataforma premium de trading com IA
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Trading Agent
                </h1>
                <p className="mt-2 max-w-xl text-sm text-gray-300 md:text-base">
                  Converse com um agente de IA especializado em trading e rode
                  backtests da técnica de gatilho universal em menos de 1
                  minuto, direto do navegador.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  asChild
                  className="btn-3d-primary inline-flex items-center gap-2"
                >
                  <Link href="/agente">
                    Abrir Agente
                    <MessageCircle className="h-4 w-4" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="btn-3d-secondary inline-flex items-center gap-2"
                >
                  <Link href="/backtest">
                    Rodar Backtests
                    <LineChart className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="mt-4 w-full max-w-xs md:mt-0 md:w-auto">
              <Card className="border-none bg-white/5 backdrop-blur-xl shadow-2xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <LineChart className="h-4 w-4 text-emerald-400" />
                    Visão rápida
                  </CardTitle>
                  <CardDescription className="text-xs text-gray-300">
                    Status do ambiente de trading.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Latência média</span>
                    <span className="font-semibold text-emerald-400">
                      &lt; 150ms
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Backtests hoje</span>
                    <span className="font-semibold">24</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Status IA</span>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      Online
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CARDS DE FUNÇÕES */}
        <section className="grid gap-4 md:grid-cols-3">
          {/* Agente Especialista */}
          <Card className="premium-card group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-sm font-medium">
                  Agente Especialista
                </CardTitle>
                <CardDescription className="text-xs text-gray-300">
                  Chat com IA focada em mercado.
                </CardDescription>
              </div>
              <div className="rounded-full bg-emerald-500/15 p-2">
                <MessageCircle className="h-5 w-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-xs text-gray-300">
                Tire dúvidas sobre estratégia, leitura de fluxo, gestão de
                risco e muito mais.
              </p>
              <Button
                asChild
                className="btn-3d-primary mt-1 inline-flex items-center justify-center gap-2 text-xs"
              >
                <Link href="/agente">
                  Abrir agente
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Backtests */}
          <Card className="premium-card group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-sm font-medium">Backtests</CardTitle>
                <CardDescription className="text-xs text-gray-300">
                  Valide sua técnica rapidamente.
                </CardDescription>
              </div>
              <div className="rounded-full bg-sky-500/15 p-2">
                <LineChart className="h-5 w-5 text-sky-400 group-hover:scale-110 transition-transform" />
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-xs text-gray-300">
                Rode simulações por período em timeframe de 1m e acompanhe os
                principais indicadores.
              </p>
              <Button
                asChild
                className="btn-3d-secondary mt-1 inline-flex items-center justify-center gap-2 text-xs"
              >
                <Link href="/backtest">
                  Abrir backtests
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Segurança / Admin */}
          <Card className="premium-card group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-sm font-medium">
                  Segurança & Acesso
                </CardTitle>
                <CardDescription className="text-xs text-gray-300">
                  Controle de usuários e permissões.
                </CardDescription>
              </div>
              <div className="rounded-full bg-purple-500/15 p-2">
                <Shield className="h-5 w-5 text-purple-400 group-hover:scale-110 transition-transform" />
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-xs text-gray-300">
                Painel administrativo para aprovar cadastros, gerenciar roles e
                acompanhar métricas da plataforma.
              </p>
              <Button
                asChild
                variant="outline"
                className="btn-3d-outline mt-1 inline-flex items-center justify-center gap-2 text-xs"
              >
                <Link href="/admin">
                  Abrir painel admin
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
