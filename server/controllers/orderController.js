const db = require('../models');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

/**
 * POST /api/orders
 * Membuat pesanan baru, yang juga secara otomatis membuat user klien baru (jika belum ada)
 * dan draf undangan. Ini adalah fungsi inti yang dipanggil oleh Admin.
 */
exports.createOrder = async (req, res) => {
    const adminId = req.user.id;
    const { client_username, title, slug, packageId, themeId } = req.body;

    if (!client_username || !title || !slug || !packageId || !themeId) {
        return res.status(400).json({ success: false, error: 'Semua kolom wajib diisi.' });
    }

    const t = await db.sequelize.transaction();

    try {
        const admin = await db.User.findByPk(adminId, { transaction: t });
        if (!admin) {
            await t.rollback();
            return res.status(404).json({ success: false, error: 'Admin tidak ditemukan.' });
        }

        if (admin.invitation_quota <= 0) {
            await t.rollback();
            return res.status(403).json({ success: false, error: 'Kuota undangan Anda telah habis. Harap hubungi Super Admin.' });
        }

        const clientRole = await db.Role.findOne({ where: { name: 'User' } }, { transaction: t });
        if (!clientRole) throw new Error('Peran "User" tidak ditemukan.');

        let clientUser = await db.User.findOne({ where: { username: client_username } }, { transaction: t });
        
        const client_pin_plain = Math.random().toString(36).substring(2, 8).toUpperCase();
        const hashedPin = await bcrypt.hash(client_pin_plain, 10);

        if (!clientUser) {
            const placeholderPassword = await bcrypt.hash(Math.random().toString(36), 10);

            clientUser = await db.User.create({
                username: client_username,
                password: placeholderPassword,
                password_pin: hashedPin, // <-- FIX DI SINI
                roleId: clientRole.id,
            }, { transaction: t });
        } else {
            clientUser.password_pin = hashedPin; // <-- DAN DI SINI
            await clientUser.save({ transaction: t });
        }
        
        const invitation = await db.Invitation.create({
            title,
            slug,
            status: 'Draft',
            adminId: admin.id,
            clientId: clientUser.id,
            packageId,
            themeId,
            client_pin_plain: client_pin_plain
        }, { transaction: t });
        
        const packageDetails = await db.Package.findByPk(packageId, { transaction: t });
        await db.Order.create({
            invitationId: invitation.id,
            packageId: packageId,
            amount: packageDetails.price,
            payment_status: 'Tertunda'
        }, { transaction: t });

        await admin.decrement('invitation_quota', { by: 1, transaction: t });

        await t.commit();

        res.status(201).json({ 
            success: true, 
            message: 'Draf undangan berhasil dibuat.',
            data: {
                client_pin: client_pin_plain
            }
        });

    } catch (error) {
        await t.rollback();
        console.error('Error saat membuat pesanan:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ success: false, error: 'Slug URL sudah digunakan. Harap gunakan slug yang lain.' });
        }
        res.status(500).json({ success: false, error: 'Terjadi kesalahan pada server.' });
    }
};

exports.getAdminOrders = async (req, res) => {
    try {
        const orders = await db.Order.findAll({
            include: [{
                model: db.Invitation,
                as: 'invitation',
                where: { adminId: req.user.id },
                include: [
                    { model: db.User, as: 'client', attributes: ['username'] }
                ]
            }, {
                model: db.Package,
                as: 'package',
                attributes: ['name']
            }],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        console.error('Error saat mengambil pesanan admin:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.activateOrder = async (req, res) => {
    try {
        const order = await db.Order.findByPk(req.params.id, {
            include: [{ model: db.Invitation, as: 'invitation', include: ['package'] }]
        });

        if (!order) {
            return res.status(404).json({ success: false, error: 'Pesanan tidak ditemukan.' });
        }
        
        if (order.invitation.adminId !== req.user.id) {
            return res.status(403).json({ success: false, error: 'Anda tidak berwenang untuk tindakan ini.' });
        }

        const now = new Date();
        const expiryDate = new Date();
        expiryDate.setMonth(now.getMonth() + order.invitation.package.active_period_months);

        await db.sequelize.transaction(async (t) => {
            await order.update({
                payment_status: 'Dikonfirmasi',
                confirmed_at: now
            }, { transaction: t });

            await order.invitation.update({
                status: 'Aktif',
                activation_date: now,
                expiry_date: expiryDate
            }, { transaction: t });
        });

        res.status(200).json({ success: true, message: 'Pesanan telah dikonfirmasi dan undangan telah diaktifkan.' });

    } catch (error) {
        console.error('Error saat mengaktifkan pesanan:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

