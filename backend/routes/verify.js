const express = require('express');
const router = express.Router();
const User = require('../users');

// Handle the GET request to verify an OTP
router.get('/', async (req, res) => {
  const { otp } = req.query;

  try {
    // Find the user with the matching OTP
    const user = await User.findOne({ otp });

    if (!user) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // If a user was found with the matching OTP, update their isVerified property to true
    user.isVerified = true;

    // Save the updated user document to the database
    await user.save();

    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
