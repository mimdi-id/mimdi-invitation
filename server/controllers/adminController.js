const { User, Role } = require('../models');
const bcrypt = require('bcryptjs');

/**
 * @desc    Membuat akun Admin baru (hanya oleh Super Admin)
 * @route   POST /api/admins
 * @access  Private (Super Admin)
 */
exports.createAdmin = async (req, res) => {
    const { name, email, password, invitationQuota } = req.body;

    try {
        // Cek jika email sudah ada
        let user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ msg: 'Email sudah terdaftar untuk admin lain.' });
        }

        // Dapatkan role 'admin'
        const adminRole = await Role.findOne({ where: { name: 'admin' } });
        if (!adminRole) {
            return res.status(500).json({ msg: 'Role "admin" tidak ditemukan. Jalankan seeder.' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Buat admin baru
        const newAdmin = await User.create({
            name,
            email,
            password: hashedPassword,
            roleId: adminRole.id,
            invitationQuota: invitationQuota || 0, // Default 0 jika tidak diset
        });

        // Hapus password dari objek respons
        const adminResponse = newAdmin.toJSON();
        delete adminResponse.password;

        res.status(201).json(adminResponse);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

/**
 * @desc    Mendapatkan semua akun Admin (hanya oleh Super Admin)
 * @route   GET /api/admins
 * @access  Private (Super Admin)
 */
exports.getAllAdmins = async (req, res) => {
    try {
        const adminRole = await Role.findOne({ where: { name: 'admin' } });
        if (!adminRole) {
            return res.status(500).json({ msg: 'Role "admin" tidak ditemukan.' });
        }

        const admins = await User.findAll({
            where: { roleId: adminRole.id },
            attributes: { exclude: ['password'] } // Jangan kirim password
        });

        res.json(admins);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


/**
 * @desc    Mengupdate kuota Admin (hanya oleh Super Admin)
 * @route   PUT /api/admins/:id/quota
 * @access  Private (Super Admin)
 */
exports.updateAdminQuota = async (req, res) => {
    const { quota } = req.body;
    
    if (typeof quota !== 'number' || quota < 0) {
        return res.status(400).json({ msg: 'Nilai kuota tidak valid.' });
    }

    try {
        const admin = await User.findByPk(req.params.id);

        if (!admin) {
            return res.status(404).json({ msg: 'Admin tidak ditemukan.' });
        }

        admin.invitationQuota = quota;
        await admin.save();
        
        const adminResponse = admin.toJSON();
        delete adminResponse.password;

        res.json(adminResponse);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


/**
 * @desc    Menghapus akun Admin (hanya oleh Super Admin)
 * @route   DELETE /api/admins/:id
 * @access  Private (Super Admin)
 */
exports.deleteAdmin = async (req, res) => {
    try {
        const admin = await User.findByPk(req.params.id);

        if (!admin) {
            return res.status(404).json({ msg: 'Admin tidak ditemukan.' });
        }

        // Sebaiknya, tambahkan logika untuk menangani undangan yang dimiliki admin ini
        // Untuk saat ini, kita langsung hapus.
        await admin.destroy();

        res.json({ msg: 'Akun admin berhasil dihapus.' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
