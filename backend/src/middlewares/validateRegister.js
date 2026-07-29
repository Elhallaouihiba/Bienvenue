'use strict';

/**
 * validateRegister — Validation middleware for POST /api/auth/register
 *
 * Checks:
 *  - fullName  : required, non-empty string
 *  - email     : required, valid email format
 *  - password  : required, minimum 6 characters
 *
 * On failure → 400 with a clear error message.
 * On success → calls next() so the controller can run.
 *
 * ⚠️  The controller should NEVER re-validate these fields.
 *     Validation lives HERE, business logic lives in the controller.
 */
const validateRegister = (req, res, next) => {
  const { fullName, email, password } = req.body;
  const errors = [];

  // fullName
  if (!fullName || typeof fullName !== 'string' || fullName.trim() === '') {
    errors.push('Full name is required');
  }

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
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: errors[0] });
  }

  next();
};

module.exports = validateRegister;
