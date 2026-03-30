/**
 * Main entry point for the backend service.
 * This app handles auth, prediction proxying, recommendations,
 * and nearby health facility lookup.
 */

require("dotenv").config();
const express     = require("express");
const cors        = require("cors");
const helmet      = require("helmet");
const rateLimit   = require("express-rate-limit");
const path        = require("path");
const fs          = require("fs");

const predictRoutes       = require("./routes/predict");
const recommendRoutes     = require("./routes/recommendations");
const hospitalsRoutes     = require("./routes/hospitals");
const authRoutes          = require("./routes/auth");
const { sendSuccess, sendError } = require("./utils/apiResponse");

const app  = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_DIR = path.join(__dirname, "..", "frontend");
const FRONTEND_INDEX = path.join(FRONTEND_DIR, "index.html");
const HAS_FRONTEND = fs.existsSync(FRONTEND_INDEX);

app.set("trust proxy", 1);

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://accounts.google.com"],
      scriptSrcElem: ["'self'", "https://accounts.google.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://accounts.google.com"],
      styleSrcElem: ["'self'", "'unsafe-inline'", "https://accounts.google.com"],
      imgSrc: ["'self'", "data:", "https://*.googleusercontent.com", "https://*.gstatic.com", "https://accounts.google.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'", "https://accounts.google.com"],
      frameSrc: ["'self'", "https://accounts.google.com"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
    },
  },
}));
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Terlalu banyak permintaan. Coba lagi dalam 15 menit." },
});
app.use(limiter);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
if (HAS_FRONTEND) {
  app.use(express.static(FRONTEND_DIR));
}

app.get("/health", (_req, res) => {
  return sendSuccess(res, {
    data: {
      status: "ok",
      service: "airin-backend",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      flask_url: process.env.FLASK_URL || "http://localhost:5001",
    },
  });
});

app.use("/api/predict",         predictRoutes);
app.use("/api/recommendations", recommendRoutes);
app.use("/api/hospitals",       hospitalsRoutes);
app.use("/api/auth",            authRoutes);

app.get("/", (_req, res) => {
  if (HAS_FRONTEND) {
    return res.sendFile(FRONTEND_INDEX);
  }

  return sendSuccess(res, {
    data: {
      status: "ok",
      service: "airin-backend",
      frontend_served: false,
      message: "Frontend static files tidak tersedia di deployment ini.",
      health_url: "/health",
      predict_health_url: "/api/predict/health",
    },
  });
});

app.use((_req, res) => {
  return sendError(res, {
    status: 404,
    code: "NOT_FOUND",
    message: "Endpoint tidak ditemukan",
  });
});

app.use((err, _req, res, _next) => {
  console.error("[ERROR]", err.message);
  return sendError(res, {
    status: err.status || 500,
    code: err.code || "INTERNAL_SERVER_ERROR",
    message: err.message || "Terjadi kesalahan pada server",
  });
});

const server = app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
  console.log(`   Flask ML API → ${process.env.FLASK_URL || "http://localhost:5001"}`);
  console.log(`   Frontend static → ${HAS_FRONTEND ? FRONTEND_DIR : "not available"}`);
});

let shuttingDown = false;

function shutdown(signal) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;
  console.log(`\nReceived ${signal}. Shutting down backend...`);

  server.close((error) => {
    if (error) {
      console.error("[SHUTDOWN ERROR]", error.message);
      process.exit(1);
      return;
    }

    console.log("Backend stopped cleanly.");
    process.exit(0);
  });

  setTimeout(() => {
    console.error("Shutdown timeout. Forcing exit.");
    process.exit(1);
  }, 5000).unref();
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

module.exports = app;
