const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

// Overwrite sync: Local is the source of truth
router.post("/sync-cart", async (req, res) => {
  const { firebaseUid, cartItems } = req.body;
  // cartItems is the FULL list currently in Hive

  try {
    // We update the user and replace the 'cart' array entirely
    const user = await User.findOneAndUpdate(
      { firebaseUid: firebaseUid },
      { $set: { cart: cartItems } },
      { new: true }
    ).populate("cart.productId");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      latestCart: user.cart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
