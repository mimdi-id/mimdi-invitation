const db = require('../models');

/**
 * Fungsi helper untuk mengambil semua data undangan secara lengkap dan bersih.
 * Ini mengubah instance Sequelize yang kompleks menjadi objek JavaScript biasa.
 */
const getFullInvitationData = async (invitationId) => {
    const invitationInstance = await db.Invitation.findByPk(invitationId, {
        include: [
            { model: db.User, as: 'client', attributes: ['username'] },
            { model: db.Package, as: 'package', required: false },
            { model: db.Theme, as: 'theme', required: false },
            { model: db.Mempelai, as: 'mempelai', required: false },
            { model: db.Event, as: 'events', required: false },
            { model: db.GalleryPhoto, as: 'galleryPhotos', required: false },
            { model: db.LoveStory, as: 'loveStories', required: false },
        ]
    });
    // Mengembalikan objek 'bersih' (plain object) untuk mencegah error di frontend
    return invitationInstance ? invitationInstance.get({ plain: true }) : null;
};


/**
 * GET /api/invitations/my-invitations
 * Mengambil semua undangan yang telah dibuat oleh Admin yang sedang login.
 */
exports.getAdminInvitations = async (req, res) => {
    try {
        // Mengambil undangan berdasarkan ID admin yang ada di token JWT (req.user.id)
        const invitations = await db.Invitation.findAll({
            where: { adminId: req.user.id },
            // Sertakan data dari tabel lain yang terhubung
            include: [
                { model: db.Package, as: 'package', attributes: ['name'], required: false },
                { model: db.Theme, as: 'theme', attributes: ['name'], required: false }
            ],
            order: [['createdAt', 'DESC']] // Urutkan dari yang terbaru
        });

        res.status(200).json({ success: true, data: invitations });

    } catch (error) {
        console.error('Error saat mengambil undangan admin:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

/**
 * GET /api/invitations/all
 * Mengambil SEMUA undangan untuk Super Admin.
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
        console.error('Error fatal saat mengambil semua undangan:', error); 
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

/**
 * GET /api/invitations/public/:slug
 * Mengambil data undangan yang 'Aktif' untuk ditampilkan ke publik.
 */
exports.getPublicInvitationBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        
        const invitation = await db.Invitation.findOne({
            where: {
                slug: slug,
                status: 'Aktif' // Hanya tampilkan undangan yang statusnya 'Aktif'
            }
        });

        if (!invitation) {
            return res.status(404).json({ success: false, error: 'Undangan tidak ditemukan atau belum aktif.' });
        }

        // Gunakan helper yang sudah ada untuk mengambil semua data terkait
        const fullInvitationData = await getFullInvitationData(invitation.id);

        res.status(200).json({ success: true, data: fullInvitationData });

    } catch (error) {
        console.error('Error saat mengambil data undangan publik:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

