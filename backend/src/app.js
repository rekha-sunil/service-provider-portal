const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const providerRoutes = require("./routes/providerRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// CORS configuration for production frontend
app.use(
  cors({
    origin: "https://service-provider-portal-woad.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle CORS preflight requests
app.options(/.*/, cors());

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "Service Provider Onboarding API is running",
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/admin", adminRoutes);

module.exports = app;