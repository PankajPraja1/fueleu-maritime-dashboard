import { httpClient } from "../adapters/api/httpClient";

export const compareRoutes = async (routeIds: number[]) => {
  const res = await httpClient.post("/routes/comparison", { routeIds });
  return res.data;
};