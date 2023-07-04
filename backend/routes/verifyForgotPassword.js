const express = require('express');
const router = express.Router();
const User = require('../users');
const { generateOTP, sendOTPByEmail } = require('../utils');


/*** Handles the POST request to verify the OTP for forgot password.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
router.post('/verifyforgotpassword', async (req, res) => {
  const { usernameOrEmail, otp } = req.body;

  try {
    // Find the user by username or email
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Check if the OTP matches the user's OTP
    if (otp === user.otp) {
      // Update the isVerified_forgot property to true
      user.isVerified_forgot = true;
      await user.save();

      // Return a success response
      return res.json({ message: 'OTP verification successful' });
    }

    return res.status(400).json({ error: 'Invalid OTP' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
