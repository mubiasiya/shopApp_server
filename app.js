const express = require("express");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const app = express();

cloudinary.config({
  ccloud_name: process.env.ClOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

// Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "products",
    allowed_formats: ["jpg", "png", "jpeg"]
  }
});

const upload = multer({ storage });

app.post("/add-product", upload.single("image"), (req, res) => {
  res.json({
    message: "Uploaded!",
    fileUrl: req.file.path
  });
});

app.listen(8080, () => console.log("Server running on port 8080"));
