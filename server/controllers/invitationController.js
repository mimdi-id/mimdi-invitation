const db = require('../models');

/**
 * GET /api/invitations/my-invitations
 * Mengambil undangan milik Admin yang sedang login.
 */
exports.getAdminInvitations = async (req, res) => {
    try {
        const invitations = await db.Invitation.findAll({
            where: { adminId: req.user.id },
            include: [
                { model: db.Package, as: 'package', attributes: ['name'], required: false },
                { model: db.Theme, as: 'theme', attributes: ['name'], required: false }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json({ success: true, data: invitations });
    } catch (error) {
        console.error('Error saat mengambil undangan admin:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

/**
 * GET /api/invitations/all
 * (FUNGSI YANG DIPERBAIKI) Mengambil SEMUA undangan untuk Super Admin.
 */
exports.getAllInvitations = async (req, res) => {
    try {
        const invitations = await db.Invitation.findAll({
            include: [
                // 'required: false' (LEFT JOIN) memastikan query tidak gagal jika data terkait tidak ada.
                { model: db.User, as: 'admin', attributes: ['username'], required: false },
                { model: db.Package, as: 'package', attributes: ['name'], required: false },
                { model: db.Theme, as: 'theme', attributes: ['name'], required: false }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json({ success: true, data: invitations });
    } catch (error) {
        // Ini akan memberi tahu kita di log backend apa error sebenarnya
        console.error('Error fatal saat mengambil semua undangan:', error); 
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

