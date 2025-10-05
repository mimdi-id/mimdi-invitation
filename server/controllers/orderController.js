const db = require('../models');
const bcrypt = require('bcryptjs'); // Pastikan bcrypt diimpor

exports.createOrder = async (req, res) => {
    const { client_username, title, slug, packageId, themeId } = req.body;
    const adminId = req.user.id;

    try {
        const admin = await db.User.findByPk(adminId);
        if (admin.invitation_quota <= 0) {
            return res.status(403).json({ success: false, error: 'Kuota undangan Anda telah habis.' });
        }

        const userRole = await db.Role.findOne({ where: { name: 'User' } });
        if (!userRole) {
            return res.status(500).json({ success: false, error: 'Konfigurasi peran pengguna tidak ditemukan.' });
        }
        
        const clientPinPlainText = Math.random().toString(36).slice(-8);
        const clientPinHashed = await bcrypt.hash(clientPinPlainText, 10);

        const [clientUser, created] = await db.User.findOrCreate({
            where: { username: client_username },
            defaults: { 
                password: await bcrypt.hash(Math.random().toString(36).slice(-10), 10), // Enkripsi password utama juga
                password_pin: clientPinHashed,
                roleId: userRole.id 
            }
        });

        const result = await db.sequelize.transaction(async (t) => {
            // ... (sisa logika transaction tetap sama)
            const newInvitation = await db.Invitation.create({
                title, slug, status: 'Draf', adminId, userId: clientUser.id, packageId, themeId,
            }, { transaction: t });
            const selectedPackage = await db.Package.findByPk(packageId, { transaction: t });
            await db.Order.create({
                amount: selectedPackage.price, payment_status: 'Tertunda', invitationId: newInvitation.id, packageId,
            }, { transaction: t });
            admin.invitation_quota -= 1;
            await admin.save({ transaction: t });
            return { newInvitation, clientPin: created ? clientPinPlainText : '(klien sudah ada, gunakan PIN sebelumnya)' };
        });

        res.status(201).json({ 
            success: true, 
            message: 'Pesanan dan draf undangan berhasil dibuat.',
            data: { invitation: result.newInvitation, client_pin: result.clientPin }
        });

    } catch (error) {
        console.error('Error saat membuat pesanan:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ success: false, error: 'Slug undangan sudah digunakan.' });
        }
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

