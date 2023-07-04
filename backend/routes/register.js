const express = require('express');
const router = express.Router();
const User = require('../users');
const { generateOTP, sendOTPByEmail } = require('../utils');

// Handle the POST request to register a new user
router.post('/', async (req, res) => {
	const { username, password, confirmPassword, email, collegename, firstname, lastname } = req.body;

	if (password !== confirmPassword) {
		return res.status(400).json({ error: 'Passwords do not match' });
	}

	try {
		// Check if the username or email already exists in the database
		const duplicateUsername = await User.exists({ username });
		const duplicateEmail = await User.exists({ email });

		if (duplicateUsername) {
			return res.status(400).json({ error: 'Username already exists' });
		}

		if (duplicateEmail) {
			return res.status(400).json({ error: 'Email already exists' });
		}

		const otp = generateOTP();

		// Create a new user document with the extracted data
		const newUser = new User({
			username,
			password,
			email,
			collegename,
			firstname,
			lastname,
			otp,
			isVerified: false
		});

		// Save the new user document to the database
		await newUser.save();

		// Send an OTP to the user's email using the sendOTPByEmail() function
		sendOTPByEmail(email, otp);

		res.json({ message: 'User registered successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Server error' });
	}

});

module.exports = router;
