const express = require("express");
const router = express.Router();
const Product = require("../models/productModel");

router.get("/products/trending", async (req, res) => {
  try {
    const products = await Product.aggregate([
      { $match: { hint: { $regex: "popular", $options: "i" } } },

      { $sample: { size: 10 } },
    ]);

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = router;
