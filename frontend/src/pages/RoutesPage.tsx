import { useMemo } from "react";
import { useRoutes } from "../ui/hooks/useRoutes";

const RoutesPage = () => {
  const {
    routes,
    allRoutes,
    filters,
    setFilters,
    setBaselineRoute,
    loading,
    error,
  } = useRoutes();

  const filterOptions = useMemo(() => {
    const vessels = Array.from(
      new Set(allRoutes.map((route) => route.vesselType))
    );
    const fuels = Array.from(
      new Set(allRoutes.map((route) => route.fuelType))
    );
    const years = Array.from(
      new Set(allRoutes.map((route) => route.year))
    ).sort((a, b) => a - b);

    return { vessels, fuels, years };
  }, [allRoutes]);

  // loading UI (better UX)
  if (loading) {
    return (
      <div className="p-6 space-y-3 animate-pulse">
        <div className="h-6 bg-gray-300 w-1/3 rounded"></div>
        <div className="h-40 bg-gray-300 rounded"></div>
        <div className="h-40 bg-gray-300 rounded"></div>
      </div>
    );
  }

  // ================= KPI CALCULATIONS =================
  const totalRoutes = routes.length;

  const totalEmissions = routes.reduce(
    (sum, r) => sum + (r.totalEmissions || 0),
    0
  );

  const avgEmissions =
    totalRoutes > 0 ? totalEmissions / totalRoutes : 0;

  const highEmissionRoutes = routes.filter(
    (r) => (r.ghgIntensity || 0) > 100
  ).length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-6">
        Routes Dashboard
      </h1>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

        <div className="bg-white p-5 rounded-xl shadow border-l-4 border-blue-500 hover:shadow-lg transition">
          <p className="text-sm text-gray-500">Total Routes</p>
          <p className="text-2xl font-bold">{totalRoutes}</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow border-l-4 border-green-500 hover:shadow-lg transition">
          <p className="text-sm text-gray-500">Avg Emissions</p>
          <p className="text-2xl font-bold">
            {avgEmissions.toFixed(2)}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow border-l-4 border-red-500 hover:shadow-lg transition">
          <p className="text-sm text-gray-500">High Emission Routes</p>
          <p className="text-2xl font-bold">{highEmissionRoutes}</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow border-l-4 border-gray-500 hover:shadow-lg transition">
          <p className="text-sm text-gray-500">Total Emissions</p>
          <p className="text-2xl font-bold">{totalEmissions}</p>
        </div>

      </div>

      {/* FILTERS */}
      <div className="bg-white rounded-xl shadow border p-4 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <select
          className="border rounded px-3 py-2"
          value={filters.vesselType}
          onChange={(event) =>
            setFilters((prev) => ({
              ...prev,
              vesselType: event.target.value,
            }))
          }
        >
          <option value="">All Vessel Types</option>
          {filterOptions.vessels.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>

        <select
          className="border rounded px-3 py-2"
          value={filters.fuelType}
          onChange={(event) =>
            setFilters((prev) => ({
              ...prev,
              fuelType: event.target.value,
            }))
          }
        >
          <option value="">All Fuel Types</option>
          {filterOptions.fuels.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>

        <select
          className="border rounded px-3 py-2"
          value={filters.year}
          onChange={(event) =>
            setFilters((prev) => ({
              ...prev,
              year: event.target.value,
            }))
          }
        >
          <option value="">All Years</option>
          {filterOptions.years.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-600">{error}</div>
      )}

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded-xl shadow border">

        <table className="min-w-full">

          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="p-3 text-left">Route ID</th>
              <th className="p-3 text-left">Vessel Type</th>
              <th className="p-3 text-left">Fuel Type</th>
              <th className="p-3 text-left">Year</th>
              <th className="p-3 text-left">GHG Intensity</th>
              <th className="p-3 text-left">Fuel Consumption (t)</th>
              <th className="p-3 text-left">Distance (km)</th>
              <th className="p-3 text-left">Total Emissions (t)</th>
              <th className="p-3 text-left">Baseline</th>
            </tr>
          </thead>

          <tbody>
            {routes.map((route) => (
              <tr
                key={route.routeId}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-3">{route.routeId}</td>
                <td className="p-3">{route.vesselType}</td>
                <td className="p-3">{route.fuelType}</td>
                <td className="p-3">{route.year}</td>
                <td className="p-3 font-semibold">
                  {route.ghgIntensity.toFixed(2)}
                </td>
                <td className="p-3">{route.fuelConsumption}</td>
                <td className="p-3">{route.distance}</td>
                <td className="p-3">{route.totalEmissions}</td>
                <td className="p-3">
                  {route.isBaseline ? (
                    <span className="text-green-700 font-semibold">
                      Baseline
                    </span>
                  ) : (
                    <button
                      className="text-sm px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                      onClick={() => setBaselineRoute(route.routeId)}
                      disabled={loading}
                    >
                      Set Baseline
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>
    </div>
  );
};

export default RoutesPage;