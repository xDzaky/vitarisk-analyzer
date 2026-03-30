const { sendError } = require("../utils/apiResponse");
const { readBearerToken, verifyAppToken } = require("../utils/auth");

function requireAuth(req, res, next) {
  const token = readBearerToken(req.headers.authorization || "");

  if (!token) {
    return sendError(res, {
      status: 401,
      code: "AUTH_REQUIRED",
      message: "Login diperlukan untuk mengakses endpoint ini.",
    });
  }

  try {
    req.user = verifyAppToken(token);
    return next();
  } catch (_error) {
    return sendError(res, {
      status: 401,
      code: "INVALID_TOKEN",
      message: "Token login tidak valid atau sudah kedaluwarsa.",
    });
  }
}

module.exports = {
  requireAuth,
};
