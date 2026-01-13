const express = require("express");
const User = require("../models/userModel");
const router = express.Router();


router.get("/:firebaseUid", async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.params.firebaseUid });

    if (!user || user.interests.length === 0) {
      // Fallback: If new user, show top-rated or trending products
      const trending = await Product.find().limit(10).sort({ rating: -1 });
      return res.json({ success: true, products: trending });
    }

    // Sort interests to get the top categories
    const topCategories = user.interests
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map((i) => i.category);

    // Find products in those categories, excluding current wishlist items
    const suggestions = await Product.find({
      category: { $in: topCategories },
      _id: { $nin: user.wishlist.map((item) => item.productId) },
    }).limit(10);

    res.json({ success: true, products: suggestions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
