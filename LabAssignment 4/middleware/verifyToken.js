/* ================================================
   middleware/verifyToken.js
   JWT Authentication Middleware
   - Extracts Bearer token from Authorization header
   - Verifies token and appends decoded user to req.user
   - Returns 401/403 on missing/invalid tokens
   ================================================ */

const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    // Extract token from Authorization header
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. No token provided.'
        });
    }

    // Expected format: "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({
            success: false,
            message: 'Access denied. Invalid token format. Use: Bearer <token>'
        });
    }

    const token = parts[1];

    try {
        // Verify token using secret from environment
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Append decoded user info to request object
        req.user = {
            _id:  decoded.user_id,
            role: decoded.role
        };

        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(403).json({
                success: false,
                message: 'Token has expired. Please login again.'
            });
        }
        return res.status(403).json({
            success: false,
            message: 'Invalid or malformed token.'
        });
    }
}

module.exports = verifyToken;
