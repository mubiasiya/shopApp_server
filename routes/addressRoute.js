
const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
module.exports = router;

router.post("/add-address", async (req, res) => {
  const { uid, addressData } = req.body; 

  try {
    const updatedUser = await User.findOneAndUpdate(
      { firebaseUid: uid },
      { $push: { addresses: addressData } }, // Adds to the array
      { new: true },
    );

    if (!updatedUser) return res.status(404).send("User not found");

    res.status(200).json({
      message: "Address added!",
      addresses: updatedUser.addresses,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
