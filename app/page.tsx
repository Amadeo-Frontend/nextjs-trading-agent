import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Bot, BarChart3 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 py-10 animate-fade-in">
      <div className="flex items-center gap-3">
        <Sparkles className="h-8 w-8 text-primary" />
        <h1 className="text-4xl font-bold tracking-tight">Trading Agent</h1>
      </div>

      <p className="text-lg text-muted-foreground">
        Utilize nossa IA especializada para tirar dúvidas sobre o mercado e executar backtests com eficiência.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Card 1 */}
        <Link href="/agente" className="group">
          <Card className="transition-all duration-300 group-hover:shadow-xl group-hover:scale-[1.02] cursor-pointer">
            <CardHeader className="flex flex-row items-center gap-3">
              <Bot className="h-6 w-6 text-primary" />
              <CardTitle>Agente Especialista</CardTitle>
            </CardHeader>

            <CardContent className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Tire dúvidas sobre mercado, técnica e conceitos com IA avançada.
              </p>

              <Button>
                Abrir
              </Button>
            </CardContent>
          </Card>
        </Link>

        {/* Card 2 */}
        <Link href="/backtest" className="group">
          <Card className="transition-all duration-300 group-hover:shadow-xl group-hover:scale-[1.02] cursor-pointer">
            <CardHeader className="flex flex-row items-center gap-3">
              <BarChart3 className="h-6 w-6 text-primary" />
              <CardTitle>Backtests</CardTitle>
            </CardHeader>

            <CardContent className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Execute backtests rápidos e precisos no timeframe de 1 minuto.
              </p>

              <Button>
                Abrir
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
