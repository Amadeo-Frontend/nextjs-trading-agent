export default function ForbiddenPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">Acesso Restrito</h1>
      <p className="text-muted-foreground text-lg">
        Este recurso é exclusivo para usuários Premium.
      </p>

      <a
        href="/upgrade"
        className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-lg transition"
      >
        Fazer upgrade
      </a>
    </div>
  );
}
