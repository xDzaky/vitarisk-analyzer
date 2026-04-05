/**
 * routes/recommendations.js
 * Returns health recommendations based on prediction result.
 * Route: POST /api/recommendations
 *
 * Body: { disease: "heart"|"diabetes"|"cholesterol", risk_level: "Rendah"|"Sedang"|"Tinggi", top_factors: [...] }
 */

const express = require("express");
const router  = express.Router();
const { sendSuccess, sendError } = require("../utils/apiResponse");
const { validateRecommendationPayload } = require("../utils/validateRequest");
const { TIPS } = require("../data/recommendationTips");

// ─── POST /api/recommendations ───────────────────────────────────────
router.post("/", (req, res) => {
  const { disease, risk_level } = req.body;

  const validationErrors = validateRecommendationPayload(req.body);
  if (validationErrors.length > 0) {
    return sendError(res, {
      status: 400,
      code: "INVALID_PAYLOAD",
      message: "Payload rekomendasi tidak valid",
      details: validationErrors,
    });
  }

  const diseaseTips = TIPS[disease];
  if (!diseaseTips) {
    return sendError(res, {
      status: 400,
      code: "INVALID_DISEASE",
      message: `Jenis penyakit tidak valid: ${disease}`,
    });
  }

  const levelTips = diseaseTips[risk_level];
  if (!levelTips) {
    return sendError(res, {
      status: 400,
      code: "INVALID_RISK_LEVEL",
      message: `Tingkat risiko tidak valid: ${risk_level}. Gunakan Rendah, Sedang, atau Tinggi.`,
    });
  }

  return sendSuccess(res, {
    data: {
      disease,
      risk_level,
      recommendations: levelTips,
      when_to_see_doctor: risk_level === "Tinggi"
        ? "Segera dalam 1-3 hari"
        : risk_level === "Sedang"
        ? "Dalam 1-2 minggu ke depan"
        : "Pemeriksaan rutin tahunan",
    },
  });
});

module.exports = router;
