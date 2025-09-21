import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:9000/api",
  headers: { "Content-Type": "application/json" },
});

export const rewardApi = (body) =>
  api.post("/reward", body, {
    headers: { "Idempotency-Key": crypto.randomUUID() },
  });

export const todayApi = (userId) =>
  api.get(`/today-stocks/${encodeURIComponent(userId)}`);
export const statsApi = (userId) =>
  api.get(`/stats/${encodeURIComponent(userId)}`);
export const portfolioApi = (userId) =>
  api.get(`/portfolio/${encodeURIComponent(userId)}`);
export const historicalApi = (userId, from, to) => {
  const qs = new URLSearchParams();
  if (from) qs.set("from", from);
  if (to) qs.set("to", to);
  const suffix = qs.toString() ? `?${qs}` : "";
  return api.get(`/historical-inr/${encodeURIComponent(userId)}${suffix}`);
};
