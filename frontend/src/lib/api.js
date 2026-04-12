// ─── Base URLs ────────────────────────────────────────────────────────────────
const PRIMARY_URL =
  import.meta.env.VITE_API_BASE_URL || "https://backend-vitarisk.vercel.app/api";
const FALLBACK_URL = "http://localhost:3000/api";

// SessionStorage key for caching which URL is alive
const ACTIVE_URL_KEY = "vitarisk_active_api_url";

/**
 * Returns the currently active base URL.
 * Reads from sessionStorage so the probe result persists for the whole session.
 */
function getActiveBaseUrl() {
  return sessionStorage.getItem(ACTIVE_URL_KEY) || PRIMARY_URL;
}

/**
 * Marks a URL as the working one for this session.
 */
function setActiveBaseUrl(url) {
  sessionStorage.setItem(ACTIVE_URL_KEY, url);
}

// ─── Token helpers ────────────────────────────────────────────────────────────
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

// ─── Core request helper ──────────────────────────────────────────────────────

/**
 * Send a fetch request to `baseUrl + path`.
 * Throws on network failure (CORS, offline, etc), resolves on any HTTP response.
 */
async function fetchFromBase(baseUrl, path, options) {
  const { headers = {}, auth = true, ...restOptions } = options;
  const response = await fetch(`${baseUrl}${path}`, {
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

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Main request function with automatic fallback.
 *
 * Strategy:
 *  1. Use whichever URL was proven to work this session (cached).
 *  2. If the primary URL fails with a network/CORS error (TypeError),
 *     automatically retry against the local fallback (localhost:3000).
 *  3. Cache the winner so subsequent calls skip the probe.
 */
export async function apiRequest(path, options = {}) {
  const activeUrl = getActiveBaseUrl();

  try {
    const result = await fetchFromBase(activeUrl, path, options);
    // If we just succeeded and the active URL was not yet confirmed, save it.
    if (!sessionStorage.getItem(ACTIVE_URL_KEY)) {
      setActiveBaseUrl(activeUrl);
    }
    return result;
  } catch (err) {
    // Only attempt fallback on network-level errors (TypeError = fetch failed /
    // CORS blocked), NOT on HTTP 4xx/5xx business errors.
    const isNetworkError = err instanceof TypeError;
    const isAlreadyFallback = activeUrl === FALLBACK_URL;

    if (!isNetworkError || isAlreadyFallback) {
      throw err;
    }

    // ── Probe the fallback ────────────────────────────────────────────────────
    console.warn(
      `[VitaRisk API] Primary URL unreachable (${err.message}). ` +
        `Falling back to ${FALLBACK_URL} …`
    );

    try {
      const result = await fetchFromBase(FALLBACK_URL, path, options);
      // Fallback works — remember it for the rest of the session.
      setActiveBaseUrl(FALLBACK_URL);
      console.info(`[VitaRisk API] Now using local backend: ${FALLBACK_URL}`);
      return result;
    } catch (fallbackErr) {
      // Both URLs failed — throw the original error so UX shows a meaningful msg.
      console.error("[VitaRisk API] Both primary and fallback URLs failed.");
      throw err;
    }
  }
}

/**
 * Expose the currently resolved base URL (useful for debugging / display).
 */
export function getApiBaseUrl() {
  return getActiveBaseUrl();
}
