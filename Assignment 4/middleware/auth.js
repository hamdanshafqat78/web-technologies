/* ================================================
   middleware/auth.js
   Admin session guard — protects all /admin routes
   ================================================ */

function requireAdmin(req, res, next) {
    if (req.session && req.session.isAdmin) {
        return next();
    }
    req.flash('error', 'Please login to access the admin panel.');
    res.redirect('/admin/login');
}

module.exports = requireAdmin;
