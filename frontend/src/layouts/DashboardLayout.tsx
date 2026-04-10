import { Link, useLocation } from "react-router-dom";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  // 🔥 improved active check (important for nested routes)
  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-900 text-white p-6 shadow-xl">

        {/* HEADER */}
        <h1 className="text-xl font-bold mb-8 tracking-wide">
          🚢 FuelEU Dashboard
        </h1>

        {/* NAV */}
        <nav className="flex flex-col gap-2 text-sm">

          <p className="text-gray-400 text-xs mb-2">MAIN</p>

          <Link
            to="/"
            className={`p-2 rounded transition ${
              isActive("/") ? "bg-blue-600" : "hover:bg-gray-700"
            }`}
          >
            Routes
          </Link>

          <Link
            to="/compare"
            className={`p-2 rounded transition ${
              isActive("/compare") ? "bg-blue-600" : "hover:bg-gray-700"
            }`}
          >
            Compare
          </Link>

          <p className="text-gray-400 text-xs mt-4 mb-2">FINANCE</p>

          <Link
            to="/banking"
            className={`p-2 rounded transition ${
              isActive("/banking") ? "bg-blue-600" : "hover:bg-gray-700"
            }`}
          >
            Banking
          </Link>

          <p className="text-gray-400 text-xs mt-4 mb-2">ADVANCED</p>

          <Link
            to="/pools"
            className={`p-2 rounded transition ${
              isActive("/pools") ? "bg-blue-600" : "hover:bg-gray-700"
            }`}
          >
            Pools
          </Link>

        </nav>

        {/* FOOTER */}
        <div className="absolute bottom-4 text-xs text-gray-500">
          FuelEU Simulation v1.0
        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6">
        {children}
      </main>

    </div>
  );
};

export default DashboardLayout;