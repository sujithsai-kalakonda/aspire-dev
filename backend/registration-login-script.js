/**
 * Imports the necessary modules.
 */
const User = require('../users');
const { generateOTP, sendOTPByEmail } = require('./utils');

/**
 * The user data to be registered.
 * @type {Object}
 */
const userData = {
  username: 'user123',
  password: 'password123',
  confirmPassword: 'password123',
  email: 'user@example.com',
  collegename: 'Example College',
  firstname: 'John',
  lastname: 'Doe'
};

/**
 * Registers a new user and verifies their OTP.
 * @returns {Promise}
 */
const registerUser = async (userData) => {
  try {
    const { username, password, confirmPassword, email, collegename, firstname, lastname } = userData;

    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    const duplicateUsername = await User.exists({ username });
    const duplicateEmail = await User.exists({ email });

    if (duplicateUsername) {
      throw new Error('Username already exists');
    }

    if (duplicateEmail) {
      throw new Error('Email already exists');
    }

    const otp = generateOTP();

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

    await newUser.save();

    sendOTPByEmail(email, otp);

    return { message: 'User registered successfully' };
  } catch (error) {
    throw error;
  }
};

/**
 * Verifies the OTP for the registered user.
 * @returns {Promise}
 */
const verifyOTP = async (otp) => {
  try {
    const user = await User.findOne({ otp });

    if (!user) {
      throw new Error('Invalid OTP');
    }

    user.isVerified = true;
    user.isVerified_forget = false;
    user.otp = undefined;

    await user.save();

    return { message: 'OTP verification successful' };
  } catch (error) {
    throw error;
  }
};

/**
 * Logs in a user.
 * @returns {Promise}
 */
const loginUser = async (credentials) => {
  try {
    const { username, password } = credentials;

    const user = await User.findOne({ username });

    if (!user || user.password !== password) {
      throw new Error('Invalid username or password');
    }

    return { message: 'Login successful' };
  } catch (error) {
    throw error;
  }
};

// Register a new user and verify OTP
registerUser(userData)
  .then(response => {
    console.log('Registration successful:', response.message);

    // Extract the OTP value from the response if needed
    const otp = response.otp;

    // Verify the OTP
    verifyOTP(otp)
      .then(response => {
        console.log('OTP verification successful:', response.message);

        // Perform login
        const credentials = {
          username: 'user123',
          password: 'password123'
        };

        loginUser(credentials)
          .then(response => {
            console.log('Login successful:', response.message);
          })
          .catch(error => {
            console.error('Login failed:', error.message);
          });
      })
      .catch(error => {
        console.error('OTP verification failed:', error.message);
      });
  })
  .catch(error => {
    console.error('Registration failed:', error.message);
  });
