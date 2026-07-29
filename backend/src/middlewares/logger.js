'use strict';

/**
 * logger — Global middleware
 *
 * Logs every incoming HTTP request with:
 *   METHOD  URL  [timestamp]
 *
 * Applied globally in server.js (before all routes).
 * Usage: app.use(logger);
 */
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method.padEnd(6)} ${req.originalUrl}`);
  next();
};

module.exports = logger;
