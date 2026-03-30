function sendSuccess(res, options = {}) {
  const {
    status = 200,
    message = null,
    data = null,
    meta = null,
  } = options;

  const payload = {
    success: true,
    data,
  };

  if (message) {
    payload.message = message;
  }

  if (meta) {
    payload.meta = meta;
  }

  return res.status(status).json(payload);
}

function sendError(res, options = {}) {
  const {
    status = 500,
    code = "INTERNAL_SERVER_ERROR",
    message = "Terjadi kesalahan pada server",
    details = null,
  } = options;

  const payload = {
    success: false,
    error: {
      code,
      message,
    },
  };

  if (details) {
    payload.error.details = details;
  }

  return res.status(status).json(payload);
}

module.exports = {
  sendSuccess,
  sendError,
};
