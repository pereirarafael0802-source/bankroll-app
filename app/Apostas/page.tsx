"use client";

import { useEffect, useMemo, useState } from "react";

type Bet = {
  id: string;
  date: string; // YYYY-MM-DD
  odds: number;
  stake: number;
  result: "win" | "loss" | "void";
};

function profit(b: Bet) {
  if (b.result === "win") return b.stake * (b.odds - 1);
  if (b.result === "loss") return -b.stake;
  return 0;
}

export default function ApostasPage() {
 const [bets, setBets] = useState<Bet[]>(() => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("bets_v1");
    return raw ? (JSON.parse(raw) as Bet[]) : [];
  } catch {
    return [];
  }
});

useEffect(() => {
  try {
    localStorage.setItem("bets_v1", JSON.stringify(bets));
  } catch {}
}, [bets]);

const [date, setDate] = useState<string>(() =>
  new Date().toISOString().slice(0, 10)
);
const [odds, setOdds] = useState<string>("2.00");
const [stake, setStake] = useState<string>("10");
const [result, setResult] = useState<Bet["result"]>("win");


  const summary = useMemo(() => {
    const totalStake = bets.reduce((acc, b) => acc + b.stake, 0);
    const totalProfit = bets.reduce((acc, b) => acc + profit(b), 0);
    const roi = totalStake > 0 ? (totalProfit / totalStake) * 100 : 0;
    return { totalStake, totalProfit, roi };
  }, [bets]);

  function addBet() {
    const o = Number(odds.replace(",", "."));
    const s = Number(stake.replace(",", "."));
    if (!date) return alert("Preencha a data.");
    if (!Number.isFinite(o) || o <= 1) return alert("Odds deve ser maior que 1.00");
    if (!Number.isFinite(s) || s <= 0) return alert("Stake deve ser maior que 0");

    const newBet: Bet = {
      id: crypto.randomUUID(),
      date,
      odds: o,
      stake: s,
      result,
    };
    setBets((prev) => [newBet, ...prev]);
  }

  function removeBet(id: string) {
    setBets((prev) => prev.filter((b) => b.id !== id));
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="space-y-1">
          <h1 className="text-3xl font-bold">Apostas</h1>
          <p className="text-gray-600">MVP: registrar apostas e ver ROI básico (local).</p>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded border p-4 space-y-3">
            <h2 className="font-semibold">Registrar aposta</h2>

            <div className="grid gap-3">
              <label className="grid gap-1">
                <span className="text-sm text-gray-600">Data</span>
                <input
                  className="border rounded px-3 py-2"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </label>

              <div className="grid gap-3 grid-cols-2">
                <label className="grid gap-1">
                  <span className="text-sm text-gray-600">Odds</span>
                  <input
                    className="border rounded px-3 py-2"
                    inputMode="decimal"
                    value={odds}
                    onChange={(e) => setOdds(e.target.value)}
                    placeholder="2.00"
                  />
                </label>

                <label className="grid gap-1">
                  <span className="text-sm text-gray-600">Stake</span>
                  <input
                    className="border rounded px-3 py-2"
                    inputMode="decimal"
                    value={stake}
                    onChange={(e) => setStake(e.target.value)}
                    placeholder="10"
                  />
                </label>
              </div>

              <label className="grid gap-1">
                <span className="text-sm text-gray-600">Resultado</span>
                <select
                  className="border rounded px-3 py-2"
                  value={result}
                  onChange={(e) => setResult(e.target.value as Bet["result"])}
                >
                  <option value="win">Win</option>
                  <option value="loss">Loss</option>
                  <option value="void">Void</option>
                </select>
              </label>

              <button
                className="rounded bg-black text-white px-4 py-2"
                onClick={addBet}
              >
                Adicionar
              </button>
            </div>
          </div>

          <div className="rounded border p-4 space-y-3">
            <h2 className="font-semibold">Resumo</h2>
            <div className="grid gap-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Stake</span>
                <span className="font-medium">{summary.totalStake.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Lucro</span>
                <span className="font-medium">{summary.totalProfit.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ROI</span>
                <span className="font-medium">{summary.roi.toFixed(2)}%</span>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              *Por enquanto fica só no navegador (sem salvar em banco). Depois a gente
              salva no backend.
            </p>
          </div>
        </section>

        <section className="rounded border p-4">
          <h2 className="font-semibold mb-3">Histórico</h2>

          {bets.length === 0 ? (
            <p className="text-gray-600">Nenhuma aposta registrada ainda.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-gray-600">
                  <tr className="border-b">
                    <th className="py-2">Data</th>
                    <th className="py-2">Odds</th>
                    <th className="py-2">Stake</th>
                    <th className="py-2">Resultado</th>
                    <th className="py-2">Lucro</th>
                    <th className="py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {bets.map((b) => (
                    <tr key={b.id} className="border-b">
                      <td className="py-2">{b.date}</td>
                      <td className="py-2">{b.odds.toFixed(2)}</td>
                      <td className="py-2">{b.stake.toFixed(2)}</td>
                      <td className="py-2">{b.result}</td>
                      <td className="py-2">{profit(b).toFixed(2)}</td>
                      <td className="py-2 text-right">
                        <button
                          className="text-red-600"
                          onClick={() => removeBet(b.id)}
                        >
                          Remover
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

