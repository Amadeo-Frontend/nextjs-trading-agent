
export default function DashboardFree() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <h1 className="text-2xl font-semibold mb-4">
        Agente IA – Plano Free
      </h1>

      <p className="text-sm text-muted-foreground mb-6">
        Converse com o agente e tire dúvidas sobre o mercado.  
        Para desbloquear backtests e métricas, faça upgrade para Premium.
      </p>

      {/* Aqui entra o seu componente do agente */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
        <p className="text-sm text-muted-foreground">Agente IA em breve...</p>
      </div>
    </div>
  );
}
