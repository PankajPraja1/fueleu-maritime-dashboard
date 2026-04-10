import { useMemo, useState } from "react";
import { usePooling } from "../ui/hooks/usePooling";

const PoolsPage = () => {
  const { entries, members, loading, error, loadEntries, create } = usePooling();
  const [year, setYear] = useState("2024");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [message, setMessage] = useState<string | null>(null);

  // 🔥 loading UI
  const selectedIds = useMemo(
    () => entries.filter((e) => selected[e.shipId]).map((e) => e.shipId),
    [entries, selected]
  );

  const poolSum = useMemo(
    () =>
      entries
        .filter((e) => selected[e.shipId])
        .reduce((sum, e) => sum + e.cb_after, 0),
    [entries, selected]
  );

  const canCreate = selectedIds.length > 0 && poolSum >= 0 && !loading;

  const handleLoad = async () => {
    setMessage(null);
    await loadEntries(Number(year));
  };

  const handleCreate = async () => {
    setMessage(null);
    try {
      await create({ year: Number(year), shipIds: selectedIds });
      setMessage("Pool created successfully.");
    } catch {
      setMessage("Pool creation failed.");
    }
  };

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Emission Credit Pools
      </h1>

      <div className="bg-white rounded-xl shadow border p-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          className="border rounded px-3 py-2"
          value={year}
          onChange={(event) => setYear(event.target.value)}
          placeholder="Year"
        />
        <button
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
          onClick={handleLoad}
          disabled={loading}
        >
          {loading ? "Loading..." : "Load Adjusted CB"}
        </button>
        <div className="col-span-1 md:col-span-2 flex items-center gap-3">
          <span className="text-sm text-gray-500">Pool Sum</span>
          <span
            className={`font-semibold ${
              poolSum >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {poolSum.toFixed(2)}
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-600">{error}</div>
      )}
      {message && (
        <div className="mb-4 text-sm text-gray-700">{message}</div>
      )}

      <div className="bg-white rounded-xl shadow border overflow-x-auto mb-6">
        <table className="min-w-full">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="p-3 text-left">Select</th>
              <th className="p-3 text-left">Ship ID</th>
              <th className="p-3 text-left">CB Before</th>
              <th className="p-3 text-left">CB After</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr
                key={entry.shipId}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={Boolean(selected[entry.shipId])}
                    onChange={(event) =>
                      setSelected((prev) => ({
                        ...prev,
                        [entry.shipId]: event.target.checked,
                      }))
                    }
                  />
                </td>
                <td className="p-3 font-semibold">{entry.shipId}</td>
                <td className="p-3">{entry.cb_before.toFixed(2)}</td>
                <td className="p-3">{entry.cb_after.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        className={`px-4 py-2 rounded text-white transition ${
          canCreate
            ? "bg-emerald-600 hover:bg-emerald-700"
            : "bg-gray-400 cursor-not-allowed"
        }`}
        disabled={!canCreate}
        onClick={handleCreate}
      >
        Create Pool
      </button>

      {members.length > 0 && (
        <div className="bg-white rounded-xl shadow border overflow-x-auto mt-6">
          <table className="min-w-full">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="p-3 text-left">Ship ID</th>
                <th className="p-3 text-left">CB Before</th>
                <th className="p-3 text-left">CB After</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr
                  key={member.shipId}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-3 font-semibold">{member.shipId}</td>
                  <td className="p-3">{member.cb_before.toFixed(2)}</td>
                  <td className="p-3">{member.cb_after.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

export default PoolsPage;