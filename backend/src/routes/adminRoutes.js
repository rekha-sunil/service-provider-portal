const express = require("express");

const router = express.Router();

const {
  getAllProviders,
  approveProvider,
  rejectProvider,
  getDashboardStats,
} = require("../controllers/adminController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

// Get dashboard statistics
router.get(
  "/stats",
  protect,
  authorize("admin"),
  getDashboardStats
);

// Get providers
// Supports:
// /api/admin/providers
// /api/admin/providers?search=john
// /api/admin/providers?status=pending
// /api/admin/providers?search=john&status=pending
router.get(
  "/providers",
  protect,
  authorize("admin"),
  getAllProviders
);

// Approve provider
router.put(
  "/providers/:id/approve",
  protect,
  authorize("admin"),
  approveProvider
);

// Reject provider
router.put(
  "/providers/:id/reject",
  protect,
  authorize("admin"),
  rejectProvider
);

module.exports = router;