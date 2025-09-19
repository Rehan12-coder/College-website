const crypto = require('crypto');

// Generate secure random tokens
const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Password hashing (using bcrypt in the model)
// Input sanitization function
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

module.exports = {
  generateToken,
  sanitizeInput
};