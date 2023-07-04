const express = require('express');
const router = express.Router();
const User = require('../users');


/*** Handles the PUT request to reset the user's password.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
router.put('/', async (req, res) => {
  const { password } = req.body;

  try {
    // Find the user with isVerify_forgot set to true
    const user = await User.findOne({ isVerify_forgot: true });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Reset the user's password
    user.password = password;
    user.isVerify_forgot = false;

    // Save the updated user document to the database
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
