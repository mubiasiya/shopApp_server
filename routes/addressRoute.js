
const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const User = require('../models/userModel');
module.exports = router;

router.post("/add-address", async (req, res) => {
  const { uid, addressData } = req.body; 

  try {
    const updatedUser = await User.findOneAndUpdate(
      { firebaseUid: uid },
      { $push: { addresses: addressData } }, // Adds to the array
      {
        new: true, // Return the document AFTER the push
        runValidators: true, // Force check if addressData has all required fields
        setDefaultsOnInsert: true,
      },
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

router.put("/edit-address", async (req, res) => {
  const { uid, addressId, updatedAddress } = req.body;

  try {
    // Check if addressId is valid before converting
    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      return res.status(400).json({ error: "Invalid Address ID format" });
    }

    const addrObjectId = new mongoose.Types.ObjectId(addressId);

    const user = await User.findOneAndUpdate(
      { firebaseUid: uid, "addresses._id": addrObjectId },
      {
        $set: { "addresses.$": { ...updatedAddress, _id: addrObjectId } },
      },
      { new: true },
    );

    if (!user) return res.status(404).json({ error: "Address not found" });

    res.status(200).json({ success: true, addresses: user.addresses });
  } catch (err) {
    // Log the actual error to your terminal so you can see it
    console.error("Update Error:", err);
    res.status(500).json({ error: "Server Error", details: err.message });
  }
});

// Remove a specific address
router.delete("/remove-address", async (req, res) => {
  const { uid, addressId } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { firebaseUid: uid },
    
      { $pull: { addresses: { _id: addressId } } },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ success: true, addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});