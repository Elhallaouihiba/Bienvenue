'use strict';

const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

/**
 * authenticate — JWT verification middleware
 *
 * Protects routes that require a logged-in user.
 *
 * How it works:
 *  1. Reads the Authorization header: "Bearer <token>"
 *  2. Verifies the JWT with jwt.verify() using JWT_SECRET from .env
 *  3. Fetches the matching user from PostgreSQL (without the password field)
 *  4. Attaches the user to req.user so the controller can use it
 *  5. Calls next() if everything is valid
 *
 * ⚠️  RULE: Token verification NEVER happens inside a controller.
 *           This middleware is the single source of truth for auth.
 *
 * On missing token  → 401 { error: "Access denied. No token provided." }
 * On invalid token  → 401 { error: "Invalid or expired token." }
 * On user not found → 401 { error: "Invalid or expired token." }
 */
const authenticate = async (req, res, next) => {
  try {
    // 1. Check for Authorization header and Bearer prefix
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    // 2. Extract the token
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    // 3. Verify signature and expiry
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Fetch the user from the DB to ensure they still exist
    //    Explicitly exclude the password from the returned object
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid or expired token.' });
    }

    // 5. Attach user to the request — controllers use req.user
    req.user = user;

    next();
  } catch (error) {
    // jwt.verify() throws on bad signature or expiry
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

module.exports = authenticate;
