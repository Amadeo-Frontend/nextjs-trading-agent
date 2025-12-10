import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden text-zinc-50 bg-transparent">
      {/* BACKGROUND ACETERNITY  --- Fica na camada mais baixa */}
      <DottedGlowBackground
        className="absolute inset-0 -z-50"
        backgroundOpacity={0.1}
        opacity={0.55}
        radius={2}
        gap={14}
        speedScale={1.5}
        darkColor="rgba(255,255,255,0.15)"
        darkGlowColor="rgba(200,100,255,0.3)"
      />

      {/* OVERLAY COLORIDO */}
      <div className="pointer-events-none absolute inset-0 -z-40">
        <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-purple-600/30 blur-3xl" />
        <div className="absolute -right-32 top-40 h-72 w-72 rounded-full bg-emerald-500/25 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 to-transparent" />
      </div>

      <main className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-10 md:px-8">
        {/* HERO */}
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
              Converse com um agente especialista em mercado e rode backtests em
              minutos.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 md:flex-row">
            <Link href="/login">
              <Button
                size="lg"
                className="group relative rounded-full bg-emerald-500 px-6 py-2 text-sm font-medium text-black shadow-[0_15px_40px_rgba(16,185,129,0.5)] transition-all hover:-translate-y-0.5 hover:shadow-[0_25px_60px_rgba(16,185,129,0.55)]"
              >
                Começar agora
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>

            <p className="text-xs text-zinc-400">
              Não precisa inserir cartão para testar o plano gratuito.
            </p>
          </div>
        </section>

        {/* PLANOS */}
        <section className="relative mt-8 grid gap-4 md:grid-cols-2">
          {/* PLANO FREE */}
          <Link href="/register" className="block">
            <Card className="group cursor-pointer border-zinc-800/80 bg-zinc-950/70 backdrop-blur-sm transition-all hover:border-emerald-400/60 hover:bg-zinc-950/90">
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
                <p>Acesso ao agente de IA para tirar dúvidas do mercado.</p>
                <ul className="space-y-1 text-xs text-zinc-400">
                  <li>• Acesso ao agente de IA</li>
                  <li>• Respostas em português</li>
                  <li>• Sem backtests automatizados</li>
                </ul>

                {/* Botão dentro do card */}
                <div className="pt-4">
                  <Button
                    size="sm"
                    className="rounded-full bg-emerald-500 text-black px-4 py-1 shadow-[0_10px_30px_rgba(16,185,129,0.4)] transition-all group-hover:-translate-y-0.5"
                  >
                    Começar grátis
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* PLANO PREMIUM */}
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
              <p>Acesso ilimitado à máquina de backtests automática.</p>
              <ul className="space-y-1 text-xs text-zinc-300">
                <li>• Todos recursos do Free</li>
                <li>• Backtests em 1 minuto</li>
                <li>• Winrate, métricas e histórico</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* FOOTER */}
        <footer className="mt-10 flex items-center justify-between border-t border-zinc-800 pt-4 text-[11px] text-zinc-500">
          <span>© {new Date().getFullYear()} Trading Agent</span>
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
