const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

// @route: POST /api/auth/login-sync
router.post('/login-sync', async (req, res) => {
  const { firebaseUid, phone } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { firebaseUid: firebaseUid },
      { phone: phone },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({
      success: true,
      userId: user._id,
      message: "User account synchronized"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;