const express = require("express");

const authRoutes = require("./routes/authRoutes");
const providerRoutes = require("./routes/providerRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// ===============================
// CORS Configuration
// ===============================
app.use((req, res, next) => {
  const origin = req.headers.origin;

  // Allow production frontend and local development
  if (
    origin === "https://service-provider-portal-woad.vercel.app" ||
    origin === "http://localhost:5173"
  ) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Vary", "Origin");
  }

  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );

  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  // Handle browser preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

// ===============================
// Body Parsers
// ===============================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// Uploaded Files
// ===============================
app.use("/uploads", express.static("uploads"));

// ===============================
// Health Check
// ===============================
app.get("/", (req, res) => {
  res.json({
    message: "Service Provider Onboarding API is running",
  });
});

// ===============================
// API Routes
// ===============================
app.use("/api/auth", authRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/admin", adminRoutes);

// ===============================
// Export App
// ===============================
module.exports = app;