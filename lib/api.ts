const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";
console.log("BACKEND_URL =>", BACKEND_URL);

export async function chatExpert(message: string) {
  const res = await fetch(`${BACKEND_URL}/chat/expert`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    throw new Error("Erro ao chamar o agente especialista");
  }

  return res.json() as Promise<{ reply: string }>;
}

// deixar pronto pro backtest depois
export async function runBacktest(payload: {
  symbol: string;
  market: "stocks" | "forex" | "crypto";
  start_date: string;
  end_date: string;
}) {
  const res = await fetch(`${BACKEND_URL}/backtests/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Erro ao rodar backtest");
  }

  return res.json();
}
