const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// Store uploaded files temporarily in memory
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  console.log("FILE RECEIVED:", file.originalname);
  console.log("FILE MIME:", file.mimetype);

  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/pdf",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, JPEG, PNG and PDF files are allowed"
      )
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Upload file to Cloudinary
const uploadToCloudinary = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const resourceType =
    req.file.mimetype === "application/pdf"
      ? "raw"
      : "image";

  const uploadStream = cloudinary.uploader.upload_stream(
    {
      resource_type: resourceType,
      folder: "service-provider-portal",
    },
    (error, result) => {
      if (error) {
        console.error("Cloudinary upload error:", error);

        return res.status(500).json({
          message: "File upload failed",
          error: error.message,
        });
      }

      // Save Cloudinary information in req.file
      req.file.cloudinaryUrl = result.secure_url;
      req.file.cloudinaryPublicId = result.public_id;

      next();
    }
  );

  streamifier
    .createReadStream(req.file.buffer)
    .pipe(uploadStream);
};

module.exports = {
  upload,
  uploadToCloudinary,
};