import { Crown } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-4xl py-10">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Crown className="text-yellow-400" /> Área Premium
      </h1>

      <p className="text-zinc-400 mt-4">
        Bem-vindo ao painel premium. Aqui você acessa métricas, histórico e
        ferramentas avançadas.
      </p>
    </div>
  );
}
