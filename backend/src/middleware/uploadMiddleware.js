const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Use Vercel's temporary writable directory in production.
// Use the normal uploads folder when running locally.
const uploadPath = process.env.VERCEL
  ? "/tmp/service-provider-uploads"
  : path.join(__dirname, "../../uploads");

// Create upload directory if it doesn't exist
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("UPLOAD DESTINATION:", uploadPath);
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    const filename =
      file.fieldname +
      "-" +
      uniqueName +
      path.extname(file.originalname);

    console.log("SAVING FILE AS:", filename);

    cb(null, filename);
  },
});

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

module.exports = upload;