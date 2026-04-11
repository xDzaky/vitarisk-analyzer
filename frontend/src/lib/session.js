import { apiRequest, clearStoredToken, getStoredToken } from "./api";

export function isLoggedIn() {
  return Boolean(getStoredToken());
}

export async function fetchCurrentUser() {
  const response = await apiRequest("/auth/me");
  return response?.data?.user || null;
}

export async function logoutSession() {
  try {
    await apiRequest("/auth/logout", {
      method: "POST",
    });
  } catch (_error) {
    // Abaikan error logout dari backend, session lokal tetap dibersihkan.
  } finally {
    clearStoredToken();
  }
}
