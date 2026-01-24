
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


router.put('/edit-address', async (req, res) => {
  const { uid, addressId, updatedAddress } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { firebaseUid: uid, "addresses._id": addressId },
      {
        $set: { "addresses.$": { ...updatedAddress, _id: addressId } },
      },
      { new: true },
    );
   
    if (!user) {
      console.log("User not found for UID:", uid);
      return res.status(404).json({ error: "User or Address not found" });
    }
    res.status(200).json({ success: true, addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove a specific address
router.delete('/remove-address', async (req, res) => {
  const { uid, addressId } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { firebaseUid: uid },
      { $pull: { addresses: { _id: addressId } } },
      { new: true }
    );

    res.status(200).json({ success: true, addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;