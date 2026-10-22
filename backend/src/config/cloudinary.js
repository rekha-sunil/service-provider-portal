const { v2: cloudinary } = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_tgpkemy1,
  api_key: process.env.CLOUDINARY_715963322893844,
  api_secret: process.env.CLOUDINARY_9exFimH1jC95LTjYFDzSm2MMjhk,
});

module.exports = cloudinary;