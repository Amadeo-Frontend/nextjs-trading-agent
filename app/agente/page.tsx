"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Bot, User } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { chatExpert } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function AgentPage() {
  const { status } = useSession();
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Proteção de rota: se não estiver logado, manda pro /login
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login?callbackUrl=/agente");
    }
  }, [status, router]);

  if (status === "loading") {
    return <p>Carregando sessão...</p>;
  }

  if (status === "unauthenticated") {
    // enquanto redireciona
    return null;
  }

  async function handleSend(e?: React.FormEvent) {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const res = await chatExpert(userMessage.content);
      const assistantMessage: Message = {
        role: "assistant",
        content: res.reply,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      setError("Não foi possível falar com o agente. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      <AppHeader />

      <main className="mx-auto max-w-6xl p-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
          <h1 className="text-2xl font-bold">Agente Especialista</h1>
          <p className="text-sm text-muted-foreground">
            Converse com o agente sobre mercado aberto, pares de moedas, cripto
            e sua técnica de gatilho universal.
          </p>

          <Card className="flex h-[520px] flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base font-semibold">
                Chat com o agente
              </CardTitle>
            </CardHeader>

            <Separator />

            <CardContent className="flex flex-1 flex-col gap-3 pt-4">
              <ScrollArea className="flex-1 rounded-md border p-3">
                {messages.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Comece perguntando algo como:{" "}
                    <span className="font-medium">
                      &quot;Explique minha técnica de gatilho universal em 1
                      minuto.&quot;
                    </span>
                  </p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {messages.map((m, idx) => (
                      <div
                        key={idx}
                        className={`flex gap-2 ${
                          m.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        {m.role === "assistant" && (
                          <div className="mt-1 rounded-full border p-1">
                            <Bot className="h-4 w-4" />
                          </div>
                        )}

                        <div
                          className={`max-w-[80%] rounded-lg px-3 py-2 text-sm shadow-sm ${
                            m.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          {m.content}
                        </div>

                        {m.role === "user" && (
                          <div className="mt-1 rounded-full border p-1">
                            <User className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {error && (
                <p className="text-xs font-medium text-destructive">{error}</p>
              )}

              <form
                onSubmit={handleSend}
                className="flex items-center gap-2 pt-1"
              >
                <Input
                  placeholder="Digite sua pergunta..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      handleSend(e);
                    }
                  }}
                />
                <Button type="submit" disabled={loading}>
                  {loading ? "Enviando..." : "Enviar"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
