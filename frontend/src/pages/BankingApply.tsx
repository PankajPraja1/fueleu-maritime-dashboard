import { useState } from "react";
import axios from "axios";

const API = "http://localhost:3000";

const BankingApply = () => {
  const [routeId, setRouteId] = useState("");
  const [credits, setCredits] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    // 🔥 basic validation
    if (!routeId || !credits) {
      setMessage("Please fill all fields ⚠️");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(`${API}/banking/apply`, {
        routeId: Number(routeId),
        credits: Number(credits),
      });

      setMessage("Credit applied successfully ✅");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      setMessage("Error applying credit ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Banking Credit Application
      </h1>

      <div className="bg-white p-6 rounded-xl shadow w-96">

        {/* ROUTE ID */}
        <input
          className="border p-2 w-full mb-3 rounded"
          placeholder="Route ID"
          value={routeId}
          onChange={(e) => setRouteId(e.target.value)}
        />

        {/* CREDITS */}
        <input
          className="border p-2 w-full mb-3 rounded"
          placeholder="Credits"
          value={credits}
          onChange={(e) => setCredits(e.target.value)}
        />

        {/* BUTTON */}
        <button
          onClick={handleApply}
          disabled={loading}
          className={`w-full px-4 py-2 rounded text-white transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Applying..." : "Apply Credit"}
        </button>

        {/* MESSAGE */}
        {message && (
          <p className="mt-4 font-semibold text-center">
            {message}
          </p>
        )}

      </div>
    </div>
  );
};

export default BankingApply;