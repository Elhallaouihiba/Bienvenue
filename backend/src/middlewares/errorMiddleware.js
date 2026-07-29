'use strict';

/**
 * errorHandler — Global error-handling middleware (Express 4-param signature)
 *
 * MUST be registered LAST in server.js (after all routes).
 * Express recognises it as an error handler because it has 4 parameters.
 *
 * Catches errors forwarded via next(err) anywhere in the application and
 * always returns a clean JSON response:
 *   { "error": "<message>" }
 *
 * HTTP status:
 *  - Uses err.status / err.statusCode if set by the thrower
 *  - Falls back to 500 Internal Server Error
 */
const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  const statusCode = err.status || err.statusCode || 500;

  // Don't leak stack traces in production
  if (process.env.NODE_ENV === 'development') {
    console.error('[ErrorHandler]', err);
  }

  res.status(statusCode).json({
    error: err.message || 'An unexpected error occurred',
  });
};

module.exports = errorHandler;
