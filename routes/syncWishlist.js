const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

// Overwrite sync: Local is the source of truth
router.post("/sync-wishlist", async (req, res) => {
  const { firebaseUid, wishlistItems } = req.body;
 

  try {
  
    const user = await User.findOneAndUpdate(
      { firebaseUid: firebaseUid },
      { $set: { wishlist: wishlistItems } },
      { new: true }
    ).populate("wishlist.productId");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
     
    });
    console.log("completed");
  } 
  
  catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
