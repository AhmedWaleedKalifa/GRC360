// utils/verificationCode.js
const crypto = require('crypto');

// Generate a 6-digit verification code
const generateVerificationCode = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Generate expiration time (15 minutes from now)
const generateExpirationTime = () => {
  return new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
};

// Check if verification code is expired
const isCodeExpired = (expirationTime) => {
  return new Date() > new Date(expirationTime);
};

module.exports = {
  generateVerificationCode,
  generateExpirationTime,
  isCodeExpired,
};