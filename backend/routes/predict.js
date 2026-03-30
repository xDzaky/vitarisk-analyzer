/**
 * routes/predict.js
 * Proxies prediction requests to Flask ML microservice.
 * Routes:
 *   POST /api/predict/heart
 *   POST /api/predict/diabetes
 *   POST /api/predict/cholesterol
 */

const express = require("express");
const axios   = require("axios");
const router  = express.Router();
const { sendSuccess, sendError } = require("../utils/apiResponse");
const { validatePredictionPayload } = require("../utils/validateRequest");

const FLASK_URL = () => process.env.FLASK_URL || "http://localhost:5001";
const TIMEOUT_MS = 10_000;

const DISEASES = ["heart", "diabetes", "cholesterol"];

// ─── Validate disease param ──────────────────────────────────────────
router.param("disease", (req, res, next, disease) => {
  if (!DISEASES.includes(disease)) {
    return sendError(res, {
      status: 400,
      code: "INVALID_DISEASE",
      message: `Jenis penyakit tidak valid. Pilih: ${DISEASES.join(", ")}`,
    });
  }
  next();
});

// ─── POST /api/predict/:disease ──────────────────────────────────────
router.post("/:disease", async (req, res) => {
  const { disease } = req.params;
  const body = req.body;

  if (!body || Object.keys(body).length === 0) {
    return sendError(res, {
      status: 400,
      code: "EMPTY_BODY",
      message: "Request body tidak boleh kosong",
    });
  }

  const validationErrors = validatePredictionPayload(disease, body);
  if (validationErrors.length > 0) {
    return sendError(res, {
      status: 400,
      code: "INVALID_PAYLOAD",
      message: "Payload prediksi tidak valid",
      details: validationErrors,
    });
  }

  try {
    const flaskRes = await axios.post(
      `${FLASK_URL()}/predict/${disease}`,
      body,
      {
        headers: { "Content-Type": "application/json" },
        timeout: TIMEOUT_MS,
      }
    );

    return sendSuccess(res, {
      data: flaskRes.data,
      meta: {
        disease,
        ml_service_url: FLASK_URL(),
      },
    });
  } catch (err) {
    if (err.code === "ECONNREFUSED" || err.code === "ECONNABORTED") {
      return sendError(res, {
        status: 503,
        code: "ML_SERVICE_UNAVAILABLE",
        message: "ML service tidak tersedia. Coba lagi nanti.",
      });
    }

    if (err.response) {
      return sendError(res, {
        status: err.response.status,
        code: "ML_SERVICE_ERROR",
        message: err.response.data?.error || "Error dari ML service",
        details: err.response.data?.details || null,
      });
    }

    return sendError(res, {
      status: 500,
      code: "PREDICTION_PROXY_ERROR",
      message: "Terjadi kesalahan pada server",
    });
  }
});

// ─── GET /api/predict/health ─────────────────────────────────────────
router.get("/health", async (_req, res) => {
  try {
    const flaskRes = await axios.get(`${FLASK_URL()}/health`, { timeout: 5000 });
    return sendSuccess(res, {
      data: {
        flask: flaskRes.data,
      },
    });
  } catch {
    return sendError(res, {
      status: 503,
      code: "ML_SERVICE_UNAVAILABLE",
      message: "ML service tidak tersedia",
    });
  }
});

module.exports = router;
