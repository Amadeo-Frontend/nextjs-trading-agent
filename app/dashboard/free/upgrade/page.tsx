export default function UpgradePage() {
  return (
    <div className="min-h-screen flex items-center justify-center text-white bg-black p-6">
      <div className="max-w-md w-full border border-white/10 rounded-2xl bg-white/5 backdrop-blur-xl p-6 shadow-2xl">
        <h1 className="text-xl font-semibold text-center mb-4">
          Evolua para o Plano Premium
        </h1>

        <p className="text-sm text-zinc-300 text-center mb-6">
          Acesse backtests automáticos, métricas profissionais e relatórios
          completos.
        </p>

        <div className="my-6 text-center">
          <div className="text-4xl font-bold text-purple-400">R$ 0,00*</div>
          <p className="text-xs text-zinc-400">
            * Nesta demo, o upgrade é gratuito.
          </p>
        </div>

        <form action="/api/upgrade" method="POST">
          <button
            type="submit"
            className="w-full rounded-full bg-purple-600 text-black py-2 font-medium hover:bg-purple-500 transition"
          >
            Ativar Premium
          </button>
        </form>
      </div>
    </div>
  );
}
