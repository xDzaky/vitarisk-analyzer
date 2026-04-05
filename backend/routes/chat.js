const express = require("express");
const rateLimit = require("express-rate-limit");

const { sendSuccess, sendError } = require("../utils/apiResponse");
const { validateChatPayload } = require("../utils/validateRequest");
const { getChatResponse } = require("../services/chatbotService");

const router = express.Router();

const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: "CHAT_RATE_LIMITED",
      message: "Terlalu banyak permintaan chat. Coba lagi sebentar lagi.",
    },
  },
});

router.use(chatLimiter);

router.post("/", (req, res) => {
  const validationErrors = validateChatPayload(req.body);
  if (validationErrors.length > 0) {
    return sendError(res, {
      status: 400,
      code: "INVALID_CHAT_PAYLOAD",
      message: "Payload chat tidak valid",
      details: validationErrors,
    });
  }

  const { message, context = {} } = req.body;

  try {
    const response = getChatResponse(req.body);

    console.info("[CHATBOT]", JSON.stringify({
      message,
      matched_topic: response.matched_topic,
      confidence: response.confidence,
      fallback: response.matched_topic === "unsupported_question",
      current_page: context.current_page || null,
      disease: context.disease || context.prediction_result?.disease || null,
      risk_level: context.risk_level || context.prediction_result?.risk_level || null,
    }));

    return sendSuccess(res, {
      data: response,
    });
  } catch (error) {
    console.error("[CHATBOT_ERROR]", error.message);
    return sendError(res, {
      status: 500,
      code: "CHATBOT_INTERNAL_ERROR",
      message: "Terjadi kesalahan saat memproses chat",
    });
  }
});

module.exports = router;
