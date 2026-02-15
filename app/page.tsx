export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-xl w-full space-y-4">
        <h1 className="text-4xl font-bold">Bankroll App</h1>

        <p className="text-lg text-gray-600">
          Gestão profissional de apostas: controle de banca, ROI, yield e histórico.
        </p>

        <div className="flex gap-3">
          <a
            className="px-4 py-2 rounded bg-black text-white"
            href="/entrar"
          >
            Entrar
          </a>

          <a
            className="px-4 py-2 rounded border"
            href="/cadastrar"
          >
            Criar conta
          </a>
        </div>

        <p className="text-sm text-gray-500">
          MVP: registro de apostas + dashboard simples.
        </p>
      </div>
    </main>
  );
}
<a className="underline text-sm" href="/apostas">Ir para Apostas</a>
