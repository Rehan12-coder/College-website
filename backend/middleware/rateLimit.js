const rateLimit = require('express-rate-limit');

// General rate limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});

// Auth rate limiter (stricter for auth endpoints)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later.'
  }
});

// Form submission rate limiter
const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 form submissions per hour
  message: {
    error: 'Too many form submissions, please try again later.'
  }
});

module.exports = { generalLimiter, authLimiter, formLimiter };