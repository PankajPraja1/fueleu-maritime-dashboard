import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:3000";

type Record = {
  routeId: number;
  credits: number;
  status?: string;
};

const BankingRecords = () => {
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await axios.get(`${API}/banking/records`);
        setRecords(res.data || []);
      } catch (err) {
        console.error("Error fetching records:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  // 🔥 loading UI
  if (loading) {
    return (
      <div className="p-6 space-y-3 animate-pulse">
        <div className="h-6 bg-gray-300 w-1/3 rounded"></div>
        <div className="h-40 bg-gray-300 rounded"></div>
      </div>
    );
  }

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Banking Transaction Records
      </h1>

      {/* EMPTY STATE */}
      {records.length === 0 ? (
        <div className="bg-white p-6 rounded-xl shadow text-center text-gray-500">
          No banking records found
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto border">

          <table className="min-w-full">

            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="p-3 text-left">Route ID</th>
                <th className="p-3 text-left">Credits</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {records.map((r, i) => (
                <tr
                  key={i}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-3">{r.routeId}</td>
                  <td className="p-3">{r.credits}</td>

                  <td
                    className={`p-3 font-bold ${
                      r.status === "REJECTED"
                        ? "text-red-600"
                        : r.status === "PENDING"
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {r.status || "APPROVED"}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}

    </div>
  );
};

export default BankingRecords;