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

const upload = require("../middleware/uploadMiddleware");

router.get(
  "/profile",
  protect,
  authorize("provider"),
  getProfile
);

router.put(
  "/profile",
  protect,
  authorize("provider"),
  updateProfile
);

router.post(
  "/submit",
  protect,
  authorize("provider"),
  submitApplication
);

// Profile photo upload
router.post(
  "/upload/profile-photo",
  protect,
  authorize("provider"),
  (req, res, next) => {
    console.log("================================");
    console.log("PROFILE PHOTO ROUTE REACHED");
    console.log("================================");
    next();
  },
  upload.single("profilePhoto"),
  uploadProfilePhoto
);

// Verification document upload
router.post(
  "/upload/document",
  protect,
  authorize("provider"),
  (req, res, next) => {
    console.log("================================");
    console.log("DOCUMENT ROUTE REACHED");
    console.log("================================");
    next();
  },
  upload.single("document"),
  uploadDocument
);

// Upload error handler
router.use((error, req, res, next) => {
  console.error("================================");
  console.error("UPLOAD ERROR:", error.message);
  console.error("================================");

  return res.status(400).json({
    message: error.message,
  });
});

module.exports = router;