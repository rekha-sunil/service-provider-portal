const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const providerRoutes = require("./routes/providerRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.json({
    message: "Service Provider Onboarding API is running",
  });
});

app.use("/api/auth", authRoutes);

app.use("/api/providers", providerRoutes);

app.use("/api/admin", adminRoutes);

module.exports = app;