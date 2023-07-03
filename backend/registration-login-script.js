/**
 * Imports the apiRequests module.
 * @module apiRequests
 */
const apiRequests = require('./apiRequests.js');

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
 * @returns {void}
 */
apiRequests.registerUser(userData)
 .then(response => {
    console.log('Registration successful:', response.data);

    // Extract the OTP value from the response if needed
    const otp = response.data.otp;

    // Verify the OTP
    apiRequests.verifyOTP(otp)
     .then(response => {
        console.log('OTP verification successful:', response.data);

        // Perform login
        const credentials = {
          username: 'user123',
          password: 'password123'
        };

        apiRequests.loginUser(credentials)
         .then(response => {
            console.log('Login successful:', response.data);
          })
         .catch(error => {
            console.error('Login failed:', error.response.data);
          });
      })
     .catch(error => {
        console.error('OTP verification failed:', error.response.data);
      });
  })
 .catch(error => {
    console.error('Registration failed:', error.response.data);
  });