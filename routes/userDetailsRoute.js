const express = require('express');
const router = express.Router();
const User = require('../models/userModel');


router.post('/details-sync', async (req, res) => {
  const { firebaseUid,namee, phone,email } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { firebaseUid: firebaseUid },

      { $set: { name: namee, phone: phone, email: email } },
      { new: true, runValidators: true },
    );

    res.status(200).json({
      success: true,
      userId: user._id,
      message: "User details synchronized"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;