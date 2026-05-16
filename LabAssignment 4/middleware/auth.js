/* ================================================
   middleware/auth.js
   Authentication & Authorization Middleware
   - isLoggedIn: blocks unauthenticated users
   - isAdmin:    blocks non-admin users (RBAC)
   ================================================ */

/**
 * Ensures the user is logged in.
 * Used to protect routes like /checkout and /profile.
 */
function isLoggedIn(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    req.flash('error', 'Please login to access this page.');
    res.redirect('/login');
}

/**
 * Ensures the logged-in user has the "admin" role.
 * Applied to all /admin routes for Role-Based Access Control.
 * Redirects non-admin users with an "Access Denied" message.
 */
function isAdmin(req, res, next) {
    if (req.session && req.session.user && req.session.user.role === 'admin') {
        return next();
    }
    req.flash('error', 'Access Denied. Admin privileges required.');
    res.redirect('/');
}

module.exports = { isLoggedIn, isAdmin };
