const express = require("express");
const User = require("../models/userModel");
const router = express.Router();

router.post("/track-view", async (req, res) => {
  const { firebaseUid, category } = req.body;

  await User.findOneAndUpdate(
    { firebaseUid, "interests.category": category },
    { $inc: { "interests.$.count": 1 } }, // Increase count if category exists
    { upsert: false }
  );

  // Logic to add category if it doesn't exist in interests array...
  res.status(200).send("Interest tracked");
});

module.exports = router;