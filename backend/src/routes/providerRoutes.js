const express = require("express");

const router = express.Router();

const {
  updateProfile,
  getProfile,
  submitApplication,
  uploadProfilePhoto,
  uploadDocument,
} = require("../controllers/providerController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const {
  upload,
  uploadToCloudinary,
} = require("../middleware/uploadMiddleware");

// =====================================================
// GET PROVIDER PROFILE
// =====================================================
router.get(
  "/profile",
  protect,
  authorize("provider"),
  getProfile
);

// =====================================================
// UPDATE PROVIDER PROFILE
// =====================================================
router.put(
  "/profile",
  protect,
  authorize("provider"),
  updateProfile
);

// =====================================================
// SUBMIT PROVIDER APPLICATION
// =====================================================
router.post(
  "/submit",
  protect,
  authorize("provider"),
  submitApplication
);

// =====================================================
// PROFILE PHOTO UPLOAD
// =====================================================
router.post(
  "/upload/profile-photo",
  protect,
  authorize("provider"),

  // Debug middleware
  (req, res, next) => {
    console.log("================================");
    console.log("PROFILE PHOTO ROUTE REACHED");
    console.log("================================");
    next();
  },

  // Receive file from frontend
  upload.single("profilePhoto"),

  // Upload file to Cloudinary
  uploadToCloudinary,

  // Save Cloudinary URL in MongoDB
  uploadProfilePhoto
);

// =====================================================
// VERIFICATION DOCUMENT UPLOAD
// =====================================================
router.post(
  "/upload/document",
  protect,
  authorize("provider"),

  // Debug middleware
  (req, res, next) => {
    console.log("================================");
    console.log("DOCUMENT ROUTE REACHED");
    console.log("================================");
    next();
  },

  // Receive file from frontend
  upload.single("document"),

  // Upload file to Cloudinary
  uploadToCloudinary,

  // Save Cloudinary URL in MongoDB
  uploadDocument
);

// =====================================================
// UPLOAD ERROR HANDLER
// =====================================================
router.use(
  (error, req, res, next) => {
    console.error("================================");
    console.error(
      "UPLOAD ERROR:",
      error.message
    );
    console.error("================================");

    return res.status(400).json({
      message: error.message,
    });
  }
);

// =====================================================
// EXPORT ROUTER
// =====================================================
module.exports = router;