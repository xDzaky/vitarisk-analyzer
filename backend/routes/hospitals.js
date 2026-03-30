/**
 * routes/hospitals.js
 * Finds nearby hospitals/clinics using OpenStreetMap Overpass API (free, no key).
 * Route: GET /api/hospitals?lat=LATITUDE&lng=LONGITUDE&radius=5000&type=hospital
 *
 * Note: Overpass API is rate-limited; for production use a dedicated instance
 * or add caching.
 */

const express = require("express");
const axios   = require("axios");
const router  = express.Router();
const { sendSuccess, sendError } = require("../utils/apiResponse");
const { validateHospitalQuery } = require("../utils/validateRequest");

const OVERPASS_URLS = [
  "https://overpass-api.de/api/interpreter",
  "https://lz4.overpass-api.de/api/interpreter",
];
const DEFAULT_RADIUS_M = 5000;   // 5 km
const MAX_RESULTS = 10;
const CACHE_TTL_MS = parseInt(process.env.HOSPITAL_CACHE_TTL_MS || "300000", 10);
const OVERPASS_TIMEOUT_MS = parseInt(process.env.OVERPASS_TIMEOUT_MS || "20000", 10);
const responseCache = new Map();

// ─── Build Overpass QL query ──────────────────────────────────────────
function buildQuery(lat, lng, radiusM, type) {
  const amenity = type === "clinic" ? "clinic" : "hospital";

  // Query both nodes and ways to cover all OSM representations
  return `
    [out:json][timeout:25];
    (
      node["amenity"="${amenity}"](around:${radiusM},${lat},${lng});
      way["amenity"="${amenity}"](around:${radiusM},${lat},${lng});
    );
    out center ${MAX_RESULTS};
  `;
}

// ─── Parse Overpass response ──────────────────────────────────────────
function parseResults(elements, userLat, userLng) {
  return elements.map((el) => {
    const lat = el.lat ?? el.center?.lat;
    const lng = el.lon ?? el.center?.lon;

    // Haversine distance in km
    const R = 6371;
    const dLat = ((lat - userLat) * Math.PI) / 180;
    const dLon = ((lng - userLng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((userLat * Math.PI) / 180) *
        Math.cos((lat * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const distKm = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return {
      id: el.id,
      name: el.tags?.name || el.tags?.["name:id"] || "Tidak tersedia",
      address:
        [el.tags?.["addr:full"], el.tags?.["addr:street"], el.tags?.["addr:city"]]
          .filter(Boolean)
          .join(", ") || "Alamat tidak tersedia",
      phone: el.tags?.phone || el.tags?.contact_phone || null,
      website: el.tags?.website || null,
      opening_hours: el.tags?.opening_hours || null,
      emergency: el.tags?.emergency === "yes",
      lat,
      lng,
      distance_km: Math.round(distKm * 10) / 10,
      google_maps_url: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
    };
  }).sort((a, b) => a.distance_km - b.distance_km);
}

function getCacheKey({ lat, lng, radius, type }) {
  return [Number(lat).toFixed(4), Number(lng).toFixed(4), radius, type || "hospital"].join(":");
}

function getCachedValue(cacheKey) {
  const cachedItem = responseCache.get(cacheKey);
  if (!cachedItem) {
    return null;
  }

  if (cachedItem.expiresAt <= Date.now()) {
    responseCache.delete(cacheKey);
    return null;
  }

  return cachedItem.data;
}

function setCachedValue(cacheKey, data) {
  responseCache.set(cacheKey, {
    data,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
}

async function fetchHospitalsFromOverpass(query) {
  const requestBody = new URLSearchParams({
    data: query,
  }).toString();

  for (const url of OVERPASS_URLS) {
    try {
      const response = await axios.post(url, requestBody, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "airin-health-app/1.0",
        },
        timeout: OVERPASS_TIMEOUT_MS,
      });

      return response.data;
    } catch (error) {
      const shouldTryNextUrl = error.code === "ECONNABORTED" || error.response?.status >= 500;
      if (!shouldTryNextUrl || url === OVERPASS_URLS[OVERPASS_URLS.length - 1]) {
        throw error;
      }
    }
  }
}

// ─── GET /api/hospitals ───────────────────────────────────────────────
router.get("/", async (req, res) => {
  const { lat, lng, radius, type } = req.query;
  const validationErrors = validateHospitalQuery(req.query);

  if (validationErrors.length > 0) {
    return sendError(res, {
      status: 400,
      code: "INVALID_QUERY",
      message: "Query pencarian fasilitas kesehatan tidak valid",
      details: validationErrors,
    });
  }

  const userLat  = parseFloat(lat);
  const userLng  = parseFloat(lng);
  const radiusM  = parseInt(radius, 10) || DEFAULT_RADIUS_M;
  const facilityType = String(type || "hospital").toLowerCase();

  if (isNaN(userLat) || isNaN(userLng)) {
    return sendError(res, {
      status: 400,
      code: "INVALID_COORDINATES",
      message: "Koordinat tidak valid.",
    });
  }

  if (radiusM > 20000) {
    return sendError(res, {
      status: 400,
      code: "INVALID_RADIUS",
      message: "Radius maksimal 20 km (20000 meter).",
    });
  }

  const cacheKey = getCacheKey({
    lat: userLat,
    lng: userLng,
    radius: radiusM,
    type: facilityType,
  });
  const cachedResponse = getCachedValue(cacheKey);

  if (cachedResponse) {
    return sendSuccess(res, {
      data: cachedResponse,
      meta: {
        cached: true,
        cache_ttl_ms: CACHE_TTL_MS,
      },
    });
  }

  const query = buildQuery(userLat, userLng, radiusM, facilityType);

  try {
    const responseData = await fetchHospitalsFromOverpass(query);
    const elements = responseData?.elements || [];
    const hospitals = parseResults(elements, userLat, userLng);
    const payload = {
      count: hospitals.length,
      radius_km: radiusM / 1000,
      facility_type: facilityType,
      user_location: { lat: userLat, lng: userLng },
      hospitals,
    };

    setCachedValue(cacheKey, payload);

    return sendSuccess(res, {
      data: payload,
      meta: {
        cached: false,
        cache_ttl_ms: CACHE_TTL_MS,
      },
    });
  } catch (err) {
    if (err.code === "ECONNABORTED") {
      return sendError(res, {
        status: 504,
        code: "HOSPITAL_LOOKUP_TIMEOUT",
        message: "Pencarian fasilitas kesehatan timeout. Coba lagi.",
      });
    }

    console.error("[HOSPITALS ERROR]", err.message || err.response?.statusText || "Unknown error");
    return sendError(res, {
      status: 500,
      code: "HOSPITAL_LOOKUP_FAILED",
      message: "Gagal mengambil data fasilitas kesehatan.",
    });
  }
});

module.exports = router;
