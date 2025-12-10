// app/dashboard/free/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, MessageCircle, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Dashboard Free | Trading Agent",
};

export default function FreeDashboardPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-black text-zinc-50">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8">
        {/* Título + resumo */}
        <section>
          <h1 className="text-2xl font-semibold text-zinc-50">Painel Free</h1>
          <p className="mt-1 text-sm text-zinc-400 max-w-xl">
            Versão gratuita do Trading Agent. Converse com o agente em
            português, teste ideias e entenda se o fluxo funciona para você.
          </p>
        </section>

        {/* 3 cards simples de status */}
        <section className="grid gap-4 md:grid-cols-3">
          <Card className="border-zinc-800 bg-zinc-950/80">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-zinc-400">
                Acesso ao agente
              </CardTitle>
              <MessageCircle className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-200">
                Faça perguntas sobre mercado, setups e gestão de risco.
              </p>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-950/80">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-zinc-400">
                Backtests
              </CardTitle>
              <ShieldCheck className="h-4 w-4 text-zinc-500" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-200">
                Backtests automáticos são exclusivos do plano Premium.
              </p>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-950/80">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-zinc-400">
                Recomendações
              </CardTitle>
              <Zap className="h-4 w-4 text-sky-400" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-200">
                Use o free para validar seu fluxo. Depois, migre para o Premium
                quando quiser histórico, métricas e automação.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Call to action para Premium bem discreto */}
        <section className="mt-2 rounded-lg border border-zinc-800 bg-zinc-950/80 px-4 py-3 text-xs text-zinc-300">
          <p className="mb-1 font-medium text-zinc-100">
            Quer liberar os backtests automáticos?
          </p>
          <p className="text-zinc-400">
            O plano Premium adiciona máquina de backtests em 1 minuto, painel
            com winrate, métricas por setup e histórico de execuções.
          </p>
        </section>
      </div>
    </div>
  );
}
