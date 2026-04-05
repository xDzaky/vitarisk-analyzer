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

function validateChatPayload(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return ["Request body harus berupa object JSON"];
  }

  const errors = [];
  const { message, context, conversation_history: conversationHistory } = payload;

  if (isBlank(message)) {
    errors.push("Field 'message' wajib diisi.");
  } else if (typeof message !== "string") {
    errors.push("Field 'message' harus berupa string.");
  } else if (message.trim().length < 2) {
    errors.push("Field 'message' minimal 2 karakter.");
  } else if (message.trim().length > 500) {
    errors.push("Field 'message' maksimal 500 karakter.");
  }

  if (!isBlank(context)) {
    if (typeof context !== "object" || Array.isArray(context)) {
      errors.push("Field 'context' harus berupa object.");
    } else {
      const {
        current_page: currentPage,
        disease,
        risk_level: riskLevel,
        prediction_result: predictionResult,
        clarification_state: clarificationState,
      } = context;

      if (!isBlank(currentPage) && typeof currentPage !== "string") {
        errors.push("Field 'context.current_page' harus berupa string.");
      }

      if (!isBlank(disease) && !DISEASES.includes(disease)) {
        errors.push(`Field 'context.disease' tidak valid. Pilih: ${DISEASES.join(", ")}.`);
      }

      if (!isBlank(riskLevel) && !RISK_LEVELS.includes(riskLevel)) {
        errors.push(`Field 'context.risk_level' tidak valid. Gunakan: ${RISK_LEVELS.join(", ")}.`);
      }

      if (!isBlank(predictionResult)) {
        if (typeof predictionResult !== "object" || Array.isArray(predictionResult)) {
          errors.push("Field 'context.prediction_result' harus berupa object.");
        } else if (!isBlank(predictionResult.risk_level) && !RISK_LEVELS.includes(predictionResult.risk_level)) {
          errors.push("Field 'context.prediction_result.risk_level' tidak valid.");
        }
      }

      if (!isBlank(clarificationState)) {
        if (typeof clarificationState !== "object" || Array.isArray(clarificationState)) {
          errors.push("Field 'context.clarification_state' harus berupa object.");
        } else {
          if (!isBlank(clarificationState.topic) && typeof clarificationState.topic !== "string") {
            errors.push("Field 'context.clarification_state.topic' harus berupa string.");
          }
          if (!isBlank(clarificationState.original_question) && typeof clarificationState.original_question !== "string") {
            errors.push("Field 'context.clarification_state.original_question' harus berupa string.");
          }
          if (!isBlank(clarificationState.missing_field) && typeof clarificationState.missing_field !== "string") {
            errors.push("Field 'context.clarification_state.missing_field' harus berupa string.");
          }
          if (!isBlank(clarificationState.follow_up_question) && typeof clarificationState.follow_up_question !== "string") {
            errors.push("Field 'context.clarification_state.follow_up_question' harus berupa string.");
          }
        }
      }
    }
  }

  if (!isBlank(conversationHistory)) {
    if (!Array.isArray(conversationHistory)) {
      errors.push("Field 'conversation_history' harus berupa array.");
    } else if (conversationHistory.length > 10) {
      errors.push("Field 'conversation_history' maksimal 10 item.");
    } else {
      conversationHistory.forEach((item, index) => {
        if (!item || typeof item !== "object" || Array.isArray(item)) {
          errors.push(`Item conversation_history[${index}] harus berupa object.`);
          return;
        }

        if (typeof item.role !== "string" || typeof item.content !== "string") {
          errors.push(`Item conversation_history[${index}] harus memiliki 'role' dan 'content' berupa string.`);
        }
      });
    }
  }

  return errors;
}

module.exports = {
  validatePredictionPayload,
  validateRecommendationPayload,
  validateHospitalQuery,
  validateChatPayload,
};
