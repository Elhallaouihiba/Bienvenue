'use strict';

/**
 * validateLogin — Validation middleware for POST /api/auth/login
 *
 * Checks:
 *  - email    : required, valid email format
 *  - password : required (length check not needed here — wrong pass = 401 anyway)
 *
 * On failure → 400 with a clear error message.
 * On success → calls next() so the controller can run.
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  // email
  if (!email || typeof email !== 'string' || email.trim() === '') {
    errors.push('Email is required');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      errors.push('Please provide a valid email address');
    }
  }

  // password
  if (!password || typeof password !== 'string' || password.length === 0) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: errors[0] });
  }

  next();
};

module.exports = validateLogin;
