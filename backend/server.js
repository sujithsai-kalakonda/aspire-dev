const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const registerRoute = require('./routes/register.js');
const loginRoute = require('./routes/login.js');
const verifyRoute = require('./routes/verify.js');
const verifyforgotRoute = require('./routes/verifyForgotPassword.js')
const forgotPasswordRoute = require('./routes/forgotPassword.js');
const resetPasswordRoute = require('./routes/resetPassword.js');

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(express.json());

// Connect to MongoDB
try {
	mongoose.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	console.log('Connected to MongoDB');
} catch (error) {
	console.error('Error connecting to MongoDB:', error);
}


// Routes
app.use('/register', registerRoute);
app.use('/login', loginRoute);
app.use('/verify', verifyRoute);
app.use('/forgotpassword', forgotPasswordRoute);
app.use('/verifyForgotPassword', verifyforgotRoute);
app.use('/resetpassword', resetPasswordRoute);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
