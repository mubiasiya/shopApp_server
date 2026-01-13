const express = require("express");
const User = require("../models/userModel");
const router = express.Router();

router.post("/", async (req, res) => {
  const { firebaseUid, category } = req.body;

  try {
    // 1. Try to increment the count if category exists
    const result = await User.findOneAndUpdate(
      { firebaseUid, "interests.category": category },
      { $inc: { "interests.$.count": 1 } },
      { new: true }
    );

    // 2. If result is null, the category doesn't exist yet, so PUSH it
    if (!result) {
      await User.findOneAndUpdate(
        { firebaseUid },
        {
          $push: {
            interests: { category: category, count: 1 },
          },
        }
      );
    }

    res.status(200).json({ success: true, message: "Interest tracked" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;