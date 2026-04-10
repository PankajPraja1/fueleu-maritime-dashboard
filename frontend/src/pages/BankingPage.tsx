import { useMemo, useState } from "react";
import { useBanking } from "../ui/hooks/useBanking";

const BankingPage = () => {
  const {
    balances,
    bankResult,
    applyResult,
    loading,
    error,
    loadBalances,
    bank,
    apply,
  } = useBanking();
  const [year, setYear] = useState("2024");
  const [shipId, setShipId] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const currentBalance = useMemo(() => {
    if (shipId) {
      return balances.find((b) => b.shipId === shipId);
    }
    return balances[0];
  }, [balances, shipId]);

  const currentCb = currentBalance?.cb ?? 0;
  const canBank = currentCb > 0 && shipId.length > 0;
  const canApply = currentCb < 0 && shipId.length > 0 && Number(amount) > 0;

  const handleLoad = async () => {
    setMessage(null);
    await loadBalances(Number(year), shipId || undefined);
  };

  const handleBank = async () => {
    setMessage(null);
    try {
      await bank({ year: Number(year), shipId });
      setMessage("Surplus banked successfully.");
    } catch {
      setMessage("Banking failed.");
    }
  };

  const handleApply = async () => {
    setMessage(null);
    try {
      await apply({ year: Number(year), shipId, amount: Number(amount) });
      setMessage("Banked surplus applied successfully.");
    } catch {
      setMessage("Apply failed.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Banking Dashboard</h1>

      <div className="bg-white rounded-xl shadow border p-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          className="border rounded px-3 py-2"
          value={year}
          onChange={(event) => setYear(event.target.value)}
          placeholder="Year"
        />
        <input
          className="border rounded px-3 py-2"
          value={shipId}
          onChange={(event) => setShipId(event.target.value)}
          placeholder="Ship ID"
        />
        <button
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
          onClick={handleLoad}
          disabled={loading}
        >
          {loading ? "Loading..." : "Load CB"}
        </button>
        <div className="text-sm text-gray-500 flex items-center">
          Current CB: {currentCb.toFixed(2)}
        </div>
      </div>

      {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
      {message && (
        <div className="mb-4 text-sm text-gray-700">{message}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-gray-500">
          <h2 className="text-sm text-gray-500">CB Before</h2>
          <p className="text-2xl font-bold">
            {(applyResult?.cb_before ?? currentCb).toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-blue-500">
          <h2 className="text-sm text-gray-500">Applied</h2>
          <p className="text-2xl font-bold">
            {(applyResult?.applied ?? 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-green-500">
          <h2 className="text-sm text-gray-500">CB After</h2>
          <p className="text-2xl font-bold">
            {(applyResult?.cb_after ?? currentCb).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow border p-4 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          className="border rounded px-3 py-2"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="Amount"
        />
        <button
          className={`px-4 py-2 rounded text-white transition ${
            canBank
              ? "bg-emerald-600 hover:bg-emerald-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          onClick={handleBank}
          disabled={!canBank}
        >
          Bank Surplus
        </button>
        <button
          className={`px-4 py-2 rounded text-white transition ${
            canApply
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          onClick={handleApply}
          disabled={!canApply}
        >
          Apply Banked
        </button>
      </div>

      <div className="bg-white rounded-xl shadow border overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="p-3 text-left">Ship ID</th>
              <th className="p-3 text-left">Year</th>
              <th className="p-3 text-left">CB</th>
            </tr>
          </thead>
          <tbody>
            {balances.map((balance) => (
              <tr
                key={`${balance.shipId}-${balance.year}`}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-3">{balance.shipId || "-"}</td>
                <td className="p-3">{balance.year}</td>
                <td className="p-3 font-semibold">
                  {balance.cb.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {bankResult && (
        <div className="mt-4 text-sm text-gray-600">
          Banked: {bankResult.amount.toFixed(2)} for {bankResult.shipId}.
        </div>
      )}
    </div>
  );
};

export default BankingPage;
