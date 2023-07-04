const express = require('express');
const router = express.Router();
const User = require('../users');
const jwt = require('jsonwebtoken');
const { generateOTP, sendOTPByEmail } = require('../utils');

/*** Handles the POST request to log in a user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
router.post('/', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user with the matching username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ error: 'Invalid username' });
    }

    if (!user.isVerified) {
      return res.status(400).json({ error: 'User is not verified' });
    }

    if (password !== user.password) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    // Generate and sign the JWT token
    const payload = {
      username,
      email: user.email, // Assuming you have access to the user's email
      collegename: user.collegename // Assuming you have access to the user's collegename
    };

    // Set the secret key for signing the JWT token
    const secretKey = process.env.JWT_SECRET;

    // Check if the secret key is defined
    if (!secretKey) {
      return res.status(500).json({ error: 'JWT secret key not configured' });
    }

    // Generate and sign the JWT token
    const token = jwt.sign(payload, secretKey);

    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
