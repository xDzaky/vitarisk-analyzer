const express = require("express");
const { sendSuccess, sendError } = require("../utils/apiResponse");
const { verifyGoogleCredential, signAppToken } = require("../utils/auth");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

function isDevLoginEnabled() {
  const flag = (process.env.ALLOW_DEV_LOGIN || "").toLowerCase().trim();

  if (["1", "true", "yes"].includes(flag)) {
    return true;
  }

  if (["0", "false", "no"].includes(flag)) {
    return false;
  }

  return process.env.NODE_ENV !== "production";
}

router.get("/config", (_req, res) => {
  const devLoginEnabled = isDevLoginEnabled();

  return sendSuccess(res, {
    data: {
      google_client_id: process.env.GOOGLE_CLIENT_ID || null,
      auth_enabled: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.JWT_SECRET),
      dev_login_enabled: devLoginEnabled,
    },
  });
});

router.post("/dev-login", (req, res) => {
  if (!isDevLoginEnabled()) {
    return sendError(res, {
      status: 403,
      code: "DEV_LOGIN_DISABLED",
      message: "Dev login tidak tersedia di production.",
    });
  }

  const { email, name } = req.body || {};
  const safeEmail = email || "demo@example.com";
  const safeName = name || "Demo User";

  try {
    const user = {
      google_id: "dev-google-user",
      email: safeEmail,
      name: safeName,
      picture: null,
      email_verified: true,
    };

    const token = signAppToken(user);

    return sendSuccess(res, {
      data: {
        token,
        user,
      },
      message: "Dev login berhasil.",
    });
  } catch (error) {
    return sendError(res, {
      status: 500,
      code: "DEV_LOGIN_FAILED",
      message: error.message || "Dev login gagal.",
    });
  }
});

router.post("/google", async (req, res) => {
  const { credential } = req.body || {};

  if (!credential) {
    return sendError(res, {
      status: 400,
      code: "MISSING_GOOGLE_CREDENTIAL",
      message: "Credential Google wajib dikirim.",
    });
  }

  try {
    const user = await verifyGoogleCredential(credential);
    const token = signAppToken(user);

    return sendSuccess(res, {
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    return sendError(res, {
      status: 401,
      code: "GOOGLE_AUTH_FAILED",
      message: error.message || "Verifikasi akun Google gagal.",
    });
  }
});

router.get("/me", requireAuth, (req, res) => {
  return sendSuccess(res, {
    data: {
      user: req.user,
    },
  });
});

router.post("/logout", requireAuth, (_req, res) => {
  return sendSuccess(res, {
    message: "Logout berhasil.",
    data: null,
  });
});

module.exports = router;
