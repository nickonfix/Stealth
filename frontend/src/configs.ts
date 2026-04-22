const rawBackendUrl = process.env.REACT_APP_BACKEND_URL || "https://localhost:5249";
const normalizedBackendUrl = rawBackendUrl.replace(/\/+$/, "");
const API_BASE = normalizedBackendUrl.endsWith("/api")
  ? normalizedBackendUrl
  : `${normalizedBackendUrl}/api`;

export const API_URL = `${API_BASE}/`;
