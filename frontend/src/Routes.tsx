import { useEffect, useState } from "react";

export default function Routes() {
  const [routes, setRoutes] = useState<any[]>([]);

  // STEP 1: get data from backend
  useEffect(() => {
    fetch("http://localhost:3000/routes")
      .then((res) => res.json())
      .then((data) => setRoutes(data));
  }, []);

  return (
    <div>
      <h1>Routes</h1>

      {/* STEP 2: show table */}
      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>Route ID</th>
            <th>Vessel Type</th>
            <th>Fuel Type</th>
            <th>GHG Intensity</th>
          </tr>
        </thead>

        <tbody>
          {routes.map((r) => (
            <tr key={r.routeId}>
              <td>{r.routeId}</td>
              <td>{r.vesselType}</td>
              <td>{r.fuelType}</td>
              <td>{r.ghgIntensity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}