const {
  predictionSchemas,
  DISEASES,
  RISK_LEVELS,
  FACILITY_TYPES,
} = require("./requestSchemas");

function isBlank(value) {
  return value === undefined || value === null || value === "";
}

function isNumberLike(value) {
  if (typeof value === "number") {
    return Number.isFinite(value);
  }

  if (typeof value !== "string") {
    return false;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return false;
  }

  return Number.isFinite(Number(trimmed));
}

function normalizeEnum(value) {
  if (typeof value === "string") {
    return value.trim().toLowerCase();
  }

  if (typeof value === "boolean" || typeof value === "number") {
    return String(value).toLowerCase();
  }

  return value;
}

function validatePredictionPayload(disease, payload) {
  const schema = predictionSchemas[disease];
  if (!schema) {
    return [`Jenis penyakit tidak valid. Pilih: ${DISEASES.join(", ")}`];
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return ["Request body harus berupa object JSON"];
  }

  const errors = [];

  for (const field of schema.required || []) {
    if (isBlank(payload[field])) {
      errors.push(`Field '${field}' wajib diisi.`);
    }
  }

  for (const group of schema.requiredOneOf || []) {
    const hasAtLeastOneField = group.some((field) => !isBlank(payload[field]));
    if (!hasAtLeastOneField) {
      errors.push(`Minimal salah satu field wajib diisi: ${group.join(" atau ")}.`);
    }
  }

  for (const group of schema.requiredTogether || []) {
    const providedFields = group.filter((field) => !isBlank(payload[field]));
    if (providedFields.length > 0 && providedFields.length < group.length) {
      errors.push(`Field berikut harus dikirim bersamaan: ${group.join(", ")}.`);
    }
  }

  for (const field of schema.numeric || []) {
    if (!isBlank(payload[field]) && !isNumberLike(payload[field])) {
      errors.push(`Field '${field}' harus berupa angka.`);
    }
  }

  for (const [field, allowedValues] of Object.entries(schema.enums || {})) {
    if (isBlank(payload[field])) {
      continue;
    }

    const normalizedValue = normalizeEnum(payload[field]);
    const normalizedAllowed = allowedValues.map(normalizeEnum);

    if (!normalizedAllowed.includes(normalizedValue)) {
      errors.push(`Nilai field '${field}' tidak valid.`);
    }
  }

  return errors;
}

function validateRecommendationPayload(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return ["Request body harus berupa object JSON"];
  }

  const errors = [];
  const { disease, risk_level: riskLevel } = payload;

  if (isBlank(disease)) {
    errors.push("Field 'disease' wajib diisi.");
  } else if (!DISEASES.includes(disease)) {
    errors.push(`Jenis penyakit tidak valid. Pilih: ${DISEASES.join(", ")}.`);
  }

  if (isBlank(riskLevel)) {
    errors.push("Field 'risk_level' wajib diisi.");
  } else if (!RISK_LEVELS.includes(riskLevel)) {
    errors.push(`Tingkat risiko tidak valid. Gunakan: ${RISK_LEVELS.join(", ")}.`);
  }

  return errors;
}

function validateHospitalQuery(query) {
  const errors = [];
  const { lat, lng, radius, type } = query;

  if (isBlank(lat) || isBlank(lng)) {
    errors.push("Parameter 'lat' dan 'lng' wajib diisi.");
    return errors;
  }

  if (!isNumberLike(lat) || !isNumberLike(lng)) {
    errors.push("Koordinat harus berupa angka yang valid.");
  }

  if (!isBlank(radius) && !isNumberLike(radius)) {
    errors.push("Parameter 'radius' harus berupa angka.");
  }

  if (!isBlank(type) && !FACILITY_TYPES.includes(String(type).toLowerCase())) {
    errors.push(`Parameter 'type' harus salah satu dari: ${FACILITY_TYPES.join(", ")}.`);
  }

  return errors;
}

module.exports = {
  validatePredictionPayload,
  validateRecommendationPayload,
  validateHospitalQuery,
};
