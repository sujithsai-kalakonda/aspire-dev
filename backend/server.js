const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const dotenv = require('dotenv').config();
const fs = require('fs');
const jwt = require('jsonwebtoken');


const app = express();
const port = process.env.PORT || 5001;

app.use(bodyParser.json());

/*** Handles the POST request to register a new user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
app.post('/register', (req, res) => {
	// Extract the username, password, confirm password, email, college name, first name, and last name from the request body
	const { username, password, confirmPassword, email, collegename, firstname, lastname } = req.body;

	// Check if the password and confirm password fields match
	if (password !== confirmPassword) {
		// If they don't match, return a 400 error response with an error message
		return res.status(400).json({ error: 'Passwords do not match' });
	}

	// Read the users.json file and parse the JSON data
	const users = JSON.parse(fs.readFileSync('./users.json'));

	// Check if the username or email already exists in the users array
	const duplicateUsername = users.some(user => user.username === username);
	const duplicateEmail = users.some(user => user.email === email);

	if (duplicateUsername) {
		// If the username already exists, return a 400 error response with an error message
		return res.status(400).json({ error: 'Username already exists' });
	}

	if (duplicateEmail) {
		// If the email already exists, return a 400 error response with an error message
		return res.status(400).json({ error: 'Email already exists' });
	}

	// Generate a new OTP and create a new user object with the extracted data
	const otp = generateOTP();
	const newUser = {
		username,
		password,
		email,
		collegename,
		firstname,
		lastname,
		otp,
		isVerified: false
	};

	// Add the new user object to the users array and write the updated data to the users.json file
	users.push(newUser);
	fs.writeFileSync('./users.json', JSON.stringify(users));

	// Send an OTP to the user's email using the sendOTPByEmail() function
	sendOTPByEmail(email, otp);

	// Return a success response with a message indicating that the user was registered successfully
	res.json({ message: 'User registered successfully' });
});



/*** Handles the GET request to verify an OTP.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
app.get('/verify', (req, res) => {
	// Extract the OTP from the query parameters
	const { otp } = req.query;

	// Read the users.json file and parse the JSON data
	const users = JSON.parse(fs.readFileSync('./users.json'));

	// Find the user with the matching OTP
	const user = users.find(user => user.otp === otp);

	if (!user) {
		// If no user was found with the matching OTP, return a 400 error response with an error message
		return res.status(400).json({ error: 'Invalid OTP' });
	}

	// If a user was found with the matching OTP, update their isVerified property to true
	user.isVerified = true;

	// Write the updated data to the users.json file
	fs.writeFileSync('./users.json', JSON.stringify(users));

	// Return a success response with a message indicating that the OTP was verified successfully
	res.json({ message: 'OTP verified successfully' });
});



/*** Handles the POST request to log in a user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
app.post('/login', (req, res) => {
	// Access request body parameters
	const { username, password } = req.body;

	// Read the users.json file and parse the JSON data
	const users = JSON.parse(fs.readFileSync('./users.json'));

	// Find the user with matching username and password
	const user = users.find(
		(user) =>
			user.username === username
	);

	if (!user) {
		return res.status(400).json({ error: 'Invalid username' });
	}

	if (!user.otp) {
		return res.status(400).json({ error: 'User is not verified' });
	}

	if (password !== user.password) {
		return res.status(400).json({ error: 'Invalid password' });
	}

	res.json({ message: 'Login successful' });

	// If username, password, and OTP are valid, generate and sign the JWT token
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

	// Return the JWT token as the response
	res.json({ token });
});


/*** Generates a 25-digit alphanumeric OTP.
 * @returns {string} The OTP.
 */
function generateOTP() {
	// Define the characters that can be used in the OTP
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	// Initialize an empty string for the OTP
	let otp = '';

	// Loop through 25 times and generate a random character for each iteration
	for (let i = 0; i < 25; i++) {
		otp += chars.charAt(Math.floor(Math.random() * chars.length));
	}

	// Return the generated OTP
	return otp;
}

/*** Sends an OTP to the specified email address using the specified email service provider.
 * @param {string} email - The email address of the user.
 * @param {string} otp - The OTP to be sent.
 * @returns {void}
 */
function sendOTPByEmail(email, otp) {
	// Create a transporter object using the specified email service provider's SMTP settings
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'your-email@gmail.com',
			pass: 'your-password',
		},
	});

	// Define the email message
	const message = {
		from: ' + Integrate SwaggerUI',
		to: email,
		subject: 'OTP Verification',
		text: `Your OTP is ${otp}.`,
	};

	// Send the email
	transporter.sendMail(message, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});
}

// Start the server
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
