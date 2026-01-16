const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const apiKeys = require("./config/apiKeys");
const gameRoutes = require("./routes/game");
const parentRoutes = require("./routes/parent");
const teacherRoutes = require("./routes/teacher");
const errorHandler = require("./utils/errorHandler");
const { requestLogger, logError, logWarn } = require("./utils/logger");

const REQUIRED_KEYS = ["anthropic", "elevenlabs", "freepik", "senso", "macroscope"];
const missing = REQUIRED_KEYS.filter((key) => !apiKeys[key]);
if (missing.length) {
  logError("missing_required_api_keys", { missing });
  process.exit(1);
}

if (!apiKeys.modulate) {
  logWarn("optional_key_missing", { key: "MODULATE_API_KEY" });
}
if (!apiKeys.tonic) {
  logWarn("optional_key_missing", { key: "TONIC_API_KEY" });
}

const app = express();
const PORT = process.env.PORT || 3001;

// Allow all localhost origins for development
app.use(cors({ 
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    // Allow any localhost port
    if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  }
}));
app.use(express.json({ limit: "2mb" }));
app.use(requestLogger());

const rateWindowMs = 15 * 60 * 1000;
const rateLimit = 120;
const ipRequests = new Map();

app.use((req, res, next) => {
  const now = Date.now();
  const key = req.ip || "unknown";
  const record = ipRequests.get(key) || { count: 0, start: now };
  if (now - record.start > rateWindowMs) {
    record.count = 0;
    record.start = now;
  }
  record.count += 1;
  ipRequests.set(key, record);

  if (record.count > rateLimit) {
    return res.status(429).json({ error: "Too many requests, slow down." });
  }
  next();
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use(gameRoutes);
app.use(parentRoutes);
app.use(teacherRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
