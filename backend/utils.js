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

module.exports = {
  generateOTP,
  sendOTPByEmail
};
