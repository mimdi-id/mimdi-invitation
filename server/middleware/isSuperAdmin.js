const { Role } = require('../models');

const isSuperAdmin = async (req, res, next) => {
    try {
        // req.user.roleId didapat dari middleware auth sebelumnya
        if (!req.user || !req.user.roleId) {
            return res.status(403).json({ msg: 'Akses ditolak. Informasi peran tidak ada.' });
        }
        
        const userRole = await Role.findByPk(req.user.roleId);
        
        if (userRole && userRole.name === 'super_admin') {
            next(); // Lanjutkan ke controller jika rolenya super_admin
        } else {
            return res.status(403).json({ msg: 'Akses ditolak. Memerlukan hak akses Super Admin.' });
        }
    } catch (err) {
        console.error('Error di middleware isSuperAdmin:', err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = isSuperAdmin;
