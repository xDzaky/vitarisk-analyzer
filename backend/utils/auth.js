const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

let googleClient = null;

function getGoogleClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;

  if (!clientId) {
    throw new Error("GOOGLE_CLIENT_ID belum diatur");
  }

  if (!googleClient) {
    googleClient = new OAuth2Client(clientId);
  }

  return googleClient;
}

async function verifyGoogleCredential(credential) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const client = getGoogleClient();

  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: clientId,
  });

  const payload = ticket.getPayload();
  if (!payload || !payload.sub || !payload.email) {
    throw new Error("Payload Google tidak valid");
  }

  return {
    google_id: payload.sub,
    email: payload.email,
    name: payload.name || payload.email,
    picture: payload.picture || null,
    email_verified: Boolean(payload.email_verified),
  };
}

function signAppToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET belum diatur");
  }

  return jwt.sign(
    {
      sub: user.google_id,
      email: user.email,
      name: user.name,
      picture: user.picture,
    },
    secret,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      issuer: "airin-backend",
    }
  );
}

function readBearerToken(headerValue = "") {
  if (!headerValue.startsWith("Bearer ")) {
    return null;
  }

  return headerValue.slice("Bearer ".length).trim();
}

function verifyAppToken(token) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET belum diatur");
  }

  return jwt.verify(token, secret, {
    issuer: "airin-backend",
  });
}

module.exports = {
  verifyGoogleCredential,
  signAppToken,
  readBearerToken,
  verifyAppToken,
};
