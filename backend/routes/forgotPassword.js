const express = require('express');
const router = express.Router();
const User = require('../users');
const { generateOTP, sendOTPByEmail } = require('../utils');

// Handle the POST request for forgot password
router.post('/', async (req, res) => {
  const { username, email } = req.body;

  try {
    // Find the user with the matching username or email
    const user = await User.findOne({ $or: [{ username }, { email }] });

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const otp = generateOTP();

    // Update the user's OTP in the database
    user.otp = otp;
    await user.save();

    // Send the OTP to the user's email using the sendOTPByEmail() function
    sendOTPByEmail(user.email, otp);

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
