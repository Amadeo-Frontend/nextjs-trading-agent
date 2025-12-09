import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <h1 className="text-3xl font-bold">Trading Agent</h1>
      <p className="text-muted-foreground">
        Interface para conversar com o agente de IA e rodar backtests da técnica
        de gatilho universal em 1 minuto.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Agente Especialista</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between">
            <p className="text-sm text-muted-foreground">
              Tire dúvidas sobre mercado, técnica e conceitos.
            </p>
            <Button asChild>
              <Link href="/agente">Abrir</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Backtests</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between">
            <p className="text-sm text-muted-foreground">
              Rode backtests por período no timeframe de 1m.
            </p>
            <Button asChild>
              <Link href="/backtest">Abrir</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
