const db = require('../models');
const bcrypt = require('bcryptjs');

/**
 * GET /api/admins
 * Mengambil semua pengguna dengan peran 'Admin'.
 */
exports.getAllAdmins = async (req, res) => {
    try {
        const adminRole = await db.Role.findOne({ where: { name: 'Admin' } });
        if (!adminRole) {
            return res.status(200).json({ success: true, data: [] });
        }

        const admins = await db.User.findAll({
            where: { roleId: adminRole.id },
            attributes: ['id', 'username', 'invitation_quota'],
        });

        res.status(200).json({ success: true, data: admins });
    } catch (error) {
        console.error('Error saat mengambil data admin:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

/**
 * POST /api/admins
 * Membuat pengguna baru dengan peran 'Admin'.
 */
exports.createAdmin = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ success: false, error: 'Username dan password diperlukan.' });
    }

    try {
        const adminRole = await db.Role.findOne({ where: { name: 'Admin' } });
        if (!adminRole) {
            return res.status(500).json({ success: false, error: 'Peran "Admin" tidak ditemukan.' });
        }

        const existingUser = await db.User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ success: false, error: 'Username sudah digunakan.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = await db.User.create({
            username,
            password: hashedPassword,
            roleId: adminRole.id,
            invitation_quota: 10,
        });

        res.status(201).json({
            success: true,
            message: 'Admin berhasil dibuat.',
            data: { id: newAdmin.id, username: newAdmin.username, invitation_quota: newAdmin.invitation_quota },
        });
    } catch (error) {
        console.error('Error saat membuat admin:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

/**
 * PUT /api/admins/:id
 * Memperbarui data admin (misalnya, kuota).
 */
exports.updateAdmin = async (req, res) => {
    try {
        const { invitation_quota } = req.body;
        const admin = await db.User.findByPk(req.params.id);

        if (!admin) {
            return res.status(404).json({ success: false, error: 'Admin tidak ditemukan.' });
        }

        admin.invitation_quota = invitation_quota ?? admin.invitation_quota;
        await admin.save();

        res.status(200).json({ success: true, message: 'Admin berhasil diperbarui.', data: admin });
    } catch (error) {
        console.error('Error saat memperbarui admin:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

/**
 * DELETE /api/admins/:id
 * Menghapus admin.
 */
exports.deleteAdmin = async (req, res) => {
    try {
        const admin = await db.User.findByPk(req.params.id);

        if (!admin) {
            return res.status(404).json({ success: false, error: 'Admin tidak ditemukan.' });
        }

        await admin.destroy();
        res.status(200).json({ success: true, message: 'Admin berhasil dihapus.' });
    } catch (error) {
        console.error('Error saat menghapus admin:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

