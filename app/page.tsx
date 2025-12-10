// app/page.tsx
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Zap, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-black via-zinc-950 to-black text-zinc-50">
      {/* glow de fundo */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-purple-600/30 blur-3xl" />
        <div className="absolute -right-32 top-40 h-72 w-72 rounded-full bg-emerald-500/25 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent" />
      </div>

      <main className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-10 md:px-8">
        {/* Hero */}
        <section className="flex flex-1 flex-col items-center gap-8 text-center md:items-start md:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/70 px-4 py-1 text-xs text-zinc-400 backdrop-blur">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>Backtests em 1 minuto com IA</span>
          </div>

          <div className="space-y-4 md:max-w-2xl">
            <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
              Trading Agent{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-sky-400 to-purple-500 bg-clip-text text-transparent">
                para traders sérios.
              </span>
            </h1>
            <p className="text-balance text-sm text-zinc-300 md:text-base">
              Converse com um agente especialista em mercado e rode backtests da
              sua técnica de gatilho universal em poucos cliques. Sem planilhas,
              sem dor de cabeça.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 md:flex-row">
            <Button
              asChild
              size="lg"
              className="group relative translate-y-0 transform rounded-full bg-emerald-500 px-6 py-2 text-sm font-medium text-black shadow-[0_15px_40px_rgba(16,185,129,0.5)] transition-all hover:-translate-y-0.5 hover:shadow-[0_25px_60px_rgba(16,185,129,0.55)]"
            >
              <Link href="/login">
                Começar agora
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>

            <p className="text-xs text-zinc-400">
              Não precisa inserir cartão para testar o plano gratuito.
            </p>
          </div>
        </section>

        {/* Planos Free vs Premium */}
        <section className="relative mt-8 grid gap-4 md:grid-cols-2">
          <Card className="group border-zinc-800/80 bg-zinc-950/70 backdrop-blur-sm transition-all hover:border-emerald-400/60 hover:bg-zinc-950/90">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Plano Free
              </CardTitle>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400">
                Ideal para começar
              </span>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-zinc-300">
              <p>Converse com o agente especialista e teste suas ideias.</p>
              <ul className="space-y-1 text-xs text-zinc-400">
                <li>• Acesso ao agente de IA</li>
                <li>• Respostas em português</li>
                <li>• Sem backtests automatizados</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="group border-purple-500/60 bg-gradient-to-br from-zinc-950/80 via-zinc-900/90 to-zinc-950/80 shadow-[0_18px_70px_rgba(168,85,247,0.45)] backdrop-blur-md transition-transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Crown className="h-4 w-4 text-amber-400" />
                Plano Premium
              </CardTitle>
              <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-300">
                Em breve
              </span>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-zinc-200">
              <p>
                Tenha acesso ao pacote completo de backtests e métricas em
                minutos.
              </p>
              <ul className="space-y-1 text-xs text-zinc-300">
                <li>• Todos recursos do plano Free</li>
                <li>• Backtests automatizados em 1 minuto</li>
                <li>• Painel com históricos, winrate e métricas chaves</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Benefícios rápidos */}
        <section className="mt-6 grid gap-4 text-xs text-zinc-300 md:grid-cols-3">
          <div className="flex items-start gap-2">
            <Zap className="mt-0.5 h-4 w-4 text-sky-400" />
            <div>
              <p className="font-medium text-zinc-100">Rápido</p>
              <p className="text-zinc-400">Backtests prontos em minutos.</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <ShieldCheck className="mt-0.5 h-4 w-4 text-emerald-400" />
            <div>
              <p className="font-medium text-zinc-100">Confiável</p>
              <p className="text-zinc-400">Fluxo padronizado para evitar erros.</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Sparkles className="mt-0.5 h-4 w-4 text-purple-400" />
            <div>
              <p className="font-medium text-zinc-100">Feito para traders</p>
              <p className="text-zinc-400">UI pensada para o dia a dia de trade.</p>
            </div>
          </div>
        </section>

        {/* Footer com link sutil para admin */}
        <footer className="mt-10 flex items-center justify-between border-t border-zinc-800 pt-4 text-[11px] text-zinc-500">
          <span>© {new Date().getFullYear()} Trading Agent. Todos os direitos reservados.</span>
          <Link
            href="/admin"
            className="text-[10px] text-zinc-600 hover:text-zinc-300 hover:underline"
          >
            área do admin
          </Link>
        </footer>
      </main>
    </div>
  );
}
