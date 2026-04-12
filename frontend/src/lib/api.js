export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://backend-vitarisk.vercel.app/api";

export function getStoredToken() {
  return localStorage.getItem("token");
}

export function clearStoredToken() {
  localStorage.removeItem("token");
}

export function getAuthHeaders(extraHeaders = {}) {
  const token = getStoredToken();

  return {
    ...extraHeaders,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function apiRequest(path, options = {}) {
  const { headers = {}, auth = true, ...restOptions } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...restOptions,
    headers: auth ? getAuthHeaders(headers) : headers,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(
      payload?.error?.message ||
        payload?.message ||
        "Terjadi kesalahan saat memproses permintaan."
    );
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}
