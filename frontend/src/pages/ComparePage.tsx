import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useComparison } from "../ui/hooks/useComparison";

const ComparePage = () => {
  const { data, loading, error } = useComparison();

  const rows = data.rows;

  // loading UI (better UX)
  if (loading) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="h-6 bg-gray-300 w-1/3 rounded"></div>
        <div className="h-40 bg-gray-300 rounded"></div>
        <div className="h-40 bg-gray-300 rounded"></div>
      </div>
    );
  }

  // ================= KPIs =================
  const totalRoutes = rows.length;

  const avgDiff =
    rows.length > 0
      ? rows.reduce((sum, row) => sum + row.percentDiff, 0) /
        rows.length
      : 0;

  const compliantCount = rows.filter((row) => row.compliant).length;

  // ================= chart data =================
  const chartData = rows.map((item) => ({
    name: item.routeId,
    ghgIntensity: item.ghgIntensity,
  }));

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-6">
        Route Emission Comparison Dashboard
      </h1>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-blue-500">
          <h2 className="text-sm text-gray-500">Total Routes</h2>
          <p className="text-2xl font-bold">{totalRoutes}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-green-500">
          <h2 className="text-sm text-gray-500">Avg % Difference</h2>
          <p className="text-2xl font-bold">
            {avgDiff.toFixed(2)}%
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-red-500">
          <h2 className="text-sm text-gray-500">Compliant Routes</h2>
          <p className="text-2xl font-bold">{compliantCount}</p>
        </div>

      </div>

      {error && (
        <div className="mb-4 text-sm text-red-600">{error}</div>
      )}

      {/* CHART */}
      <div className="h-80 bg-white p-4 rounded-xl shadow mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="ghgIntensity" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow border overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="p-3 text-left">Route</th>
              <th className="p-3 text-left">GHG Intensity</th>
              <th className="p-3 text-left">% Difference</th>
              <th className="p-3 text-left">Compliant</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.routeId}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-3 font-semibold">
                  {row.routeId}
                </td>
                <td className="p-3">{row.ghgIntensity.toFixed(2)}</td>
                <td className="p-3">
                  {row.percentDiff.toFixed(2)}%
                </td>
                <td className="p-3">
                  {row.compliant ? "✅" : "❌"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparePage;