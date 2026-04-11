const express = require("express");

const { requireAuth } = require("../middleware/auth");
const { sendSuccess, sendError } = require("../utils/apiResponse");
const {
  listPredictionHistoryByGoogleId,
  getPredictionHistoryDetail,
  deletePredictionHistory,
} = require("../services/databaseService");

const router = express.Router();

router.use(requireAuth);

router.get("/predictions", async (req, res) => {
  const limit = Number(req.query.limit || 20);

  try {
    const items = await listPredictionHistoryByGoogleId(req.user.sub, limit);
    return sendSuccess(res, {
      data: {
        items,
      },
      meta: {
        total: items.length,
        limit: Math.min(Math.max(limit || 20, 1), 100),
      },
    });
  } catch (error) {
    return sendError(res, {
      status: 500,
      code: "HISTORY_FETCH_FAILED",
      message: error.message || "Gagal mengambil riwayat prediksi.",
    });
  }
});

router.get("/predictions/:id", async (req, res) => {
  try {
    const item = await getPredictionHistoryDetail(req.user.sub, Number(req.params.id));
    if (!item) {
      return sendError(res, {
        status: 404,
        code: "HISTORY_NOT_FOUND",
        message: "Riwayat prediksi tidak ditemukan.",
      });
    }

    return sendSuccess(res, {
      data: item,
    });
  } catch (error) {
    return sendError(res, {
      status: 500,
      code: "HISTORY_DETAIL_FAILED",
      message: error.message || "Gagal mengambil detail riwayat prediksi.",
    });
  }
});

router.delete("/predictions/:id", async (req, res) => {
  try {
    const deleted = await deletePredictionHistory(req.user.sub, Number(req.params.id));
    if (!deleted) {
      return sendError(res, {
        status: 404,
        code: "HISTORY_NOT_FOUND",
        message: "Riwayat prediksi tidak ditemukan.",
      });
    }

    return sendSuccess(res, {
      message: "Riwayat prediksi berhasil dihapus.",
      data: null,
    });
  } catch (error) {
    return sendError(res, {
      status: 500,
      code: "HISTORY_DELETE_FAILED",
      message: error.message || "Gagal menghapus riwayat prediksi.",
    });
  }
});

module.exports = router;
