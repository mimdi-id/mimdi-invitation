/**
 * Middleware untuk memeriksa apakah pengguna memiliki peran 'Admin' atau 'Super Admin'.
 */
const isAdmin = (req, res, next) => {
    const allowedRoles = ['Admin', 'Super Admin'];
    if (req.user && req.user.role && allowedRoles.includes(req.user.role.name)) {
        next();
    } else {
        res.status(403).json({ success: false, error: 'Akses ditolak. Membutuhkan peran Admin.' });
    }
};

module.exports = isAdmin;
