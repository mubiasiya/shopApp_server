require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const app = express();
const Product = require("./models/productModel");
const authRoutes = require("./routes/authRoute");
const syncRoutes = require("./routes/syncCartRoute");
const syncwishlistRoutes = require("./routes/syncWishlist");

const popularRoutes = require("./routes/popularRoute");

const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

// ------------------- CLOUDINARY CONFIG -------------------------
cloudinary.config({
  cloud_name: process.env.ClOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

// ------------------- MULTER (Memory storage) --------------------
// Instead of saving locally → store file in memory to upload to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ------------------- ROUTES -------------------------

// Upload to Cloudinary + Save to MongoDB

app.post("/add-product", upload.single("image"), async (req, res) => {
  try {
    const {
      title,
      price,
      offerPrice,
      description,
      category,
      tags,
      specifications,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    // Upload image to Cloudinary
    cloudinary.uploader
      .upload_stream({ folder: "products" }, async (error, result) => {
        if (error) {
          return res.status(500).json({ error: error.message });
        }

        const product = new Product({
          title,
          price,
          offerPrice,
          image: result.secure_url,
          description,
          category,
          tags,
          specifications,
        });

        await product.save();

        res.status(201).json({
          message: "Product added successfully",
          product,
        });
      })
      .end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all products
app.get("/products", async (req, res) => {
  res.json(await Product.find());
});

// Get single product
app.get("/product/:id", async (req, res) => {
  res.json(await Product.findById(req.params.id));
});

//get product while search
app.get("/Search", async (req, res) => {
  try {
    const keyword = req.query.keyword;
    console.log(keyword);
    const products = await Product.find({
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { tags: { $regex: keyword, $options: "i" } },
      ],
    });

    console.log(products);
    if (products.length === 0) {
      return res.status(404).json({
        message: "Not found",
      });
    }

    res.status(200).json({
      count: products.length,
      products: products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

//

// auth route
app.use("/api/auth", authRoutes);

//cartsync route
app.use("/api/cartSync", syncRoutes);

//wishlistsync route
app.use("/api/wishlistSync", syncwishlistRoutes);

app.use("/api/popitems", popularRoutes);

//middleware for unknown routes
app.use((req, res) => {
  res.status(404).send("Not Found");
});

app.listen(8080, () => console.log("Server running"));
