"use client"

import { useState } from "react"
import { runBacktest } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { TrendingUp } from "lucide-react"

type MarketType = "stocks" | "forex" | "crypto"

type BacktestResult = {
  symbol: string
  market: MarketType
  start_date: string
  end_date: string
  total_setups: number
  stats: {
    win_rate?: number
    counts?: Record<string, number>
  }
  setups: {
    Horario_Gatilho: string
    Cor_Gatilho: string
    Sequencia_Esperada: string
    Resultado_Final: string
  }[]
}

export default function BacktestPage() {
  const [symbol, setSymbol] = useState("AAPL")
  const [market, setMarket] = useState<MarketType>("stocks")
  const [startDate, setStartDate] = useState("2024-01-02")
  const [endDate, setEndDate] = useState("2024-01-10")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<BacktestResult | null>(null)

  async function handleRunBacktest(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const data = await runBacktest({
        symbol,
        market,
        start_date: startDate,
        end_date: endDate,
      })
      setResult(data)
    } catch (err) {
      console.error(err)
      setError("Erro ao rodar o backtest. Confira as datas e tente de novo.")
    } finally {
      setLoading(false)
    }
  }

  const winRate = result?.stats?.win_rate ?? 0
  const counts = result?.stats?.counts ?? {}

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-4">
      <h1 className="text-2xl font-bold">Backtest - Gatilho Universal 1m</h1>
      <p className="text-sm text-muted-foreground">
        Rode backtests da sua técnica em ações, pares de moedas e criptos. O
        backend usa candles de 1 minuto e aplica a lógica exata da estratégia.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Parâmetros</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleRunBacktest}
            className="grid gap-4 md:grid-cols-4"
          >
            <div className="space-y-1">
              <Label htmlFor="symbol">Ativo</Label>
              <Input
                id="symbol"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              />
            </div>

            <div className="space-y-1">
              <Label>Mercado</Label>
              <Select
                value={market}
                onValueChange={(v) => setMarket(v as MarketType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o mercado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stocks">Ações (stocks)</SelectItem>
                  <SelectItem value="forex">Forex</SelectItem>
                  <SelectItem value="crypto">Criptos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="start">Data inicial</Label>
              <Input
                id="start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="end">Data final</Label>
              <Input
                id="end"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div className="md:col-span-4 flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? "Rodando..." : "Rodar backtest"}
              </Button>
            </div>
          </form>

          {error && (
            <p className="mt-2 text-sm font-medium text-destructive">{error}</p>
          )}
        </CardContent>
      </Card>

      {result && (
        <>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-base">Resumo</CardTitle>
                <p className="text-xs text-muted-foreground">
                  {result.symbol} • {result.market} • {result.start_date} →{" "}
                  {result.end_date}
                </p>
              </div>
              <TrendingUp className="h-5 w-5 text-emerald-500" />
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-xs text-muted-foreground">Total de setups</p>
                <p className="text-2xl font-semibold">
                  {result.total_setups ?? 0}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Win rate</p>
                <p className="text-2xl font-semibold">
                  {(winRate * 100).toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Resultados por tipo
                </p>
                <div className="text-sm">
                  {Object.keys(counts).length === 0 && (
                    <span className="text-muted-foreground">Sem dados</span>
                  )}
                  {Object.entries(counts).map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span>{k}</span>
                      <span className="font-medium">{v as number}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Setups encontrados</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>
                  Mostrando até 100 setups (do total retornado pelo backend).
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Horário gatilho</TableHead>
                    <TableHead>Cor</TableHead>
                    <TableHead>Sequência esperada</TableHead>
                    <TableHead>Resultado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.setups.slice(0, 100).map((s, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{String(s.Horario_Gatilho)}</TableCell>
                      <TableCell>{s.Cor_Gatilho}</TableCell>
                      <TableCell>{s.Sequencia_Esperada}</TableCell>
                      <TableCell>{s.Resultado_Final}</TableCell>
                    </TableRow>
                  ))}
                  {result.setups.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        Nenhum setup encontrado para esse período.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
