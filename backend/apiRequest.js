const axios = require('axios');

/*** Registers a new user.
 * @param {Object} userData - The user data to be registered.
 * @returns {Promise} A promise that resolves with the response from the server.
 */
function registerUser(userData) {
  return axios.post('http://localhost:5001/register', userData);
}

/*** Verifies an OTP.
 * @param {string} otp - The OTP to be verified.
 * @returns {Promise} A promise that resolves with the response from the server.
 */
function verifyOTP(otp) {
  return axios.get(`http://localhost:5001/verify?otp=${otp}`);
}

/*** Logs in a user.
 * @param {Object} credentials - The login credentials.
 * @returns {Promise} A promise that resolves with the response from the server.
 */
function loginUser(credentials) {
  return axios.post('http://localhost:5001/login', credentials);
}

module.exports = {
  registerUser,
  verifyOTP,
  loginUser
};