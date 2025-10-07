const db = require('../models');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

// Fungsi createOrder tetap sama seperti sebelumnya
exports.createOrder = async (req, res) => { /* ... kode lengkap ... */ };

/**
 * GET /api/orders/my-orders
 * (FUNGSI BARU) Mengambil semua pesanan yang dibuat oleh Admin yang sedang login.
 */
exports.getAdminOrders = async (req, res) => {
    try {
        const orders = await db.Order.findAll({
            // Cari pesanan di mana Invitation-nya dibuat oleh admin ini
            include: [{
                model: db.Invitation,
                as: 'invitation',
                where: { adminId: req.user.id },
                include: [ // Sertakan juga data klien dari undangan
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

/**
 * PUT /api/orders/:id/activate
 * (FUNGSI BARU) Mengonfirmasi pembayaran dan mengaktifkan undangan.
 */
exports.activateOrder = async (req, res) => {
    try {
        const order = await db.Order.findByPk(req.params.id, {
            include: [{ model: db.Invitation, as: 'invitation', include: ['package'] }]
        });

        if (!order) {
            return res.status(404).json({ success: false, error: 'Pesanan tidak ditemukan.' });
        }
        
        // Pastikan admin yang mencoba mengaktifkan adalah pemilik undangan
        if (order.invitation.adminId !== req.user.id) {
            return res.status(403).json({ success: false, error: 'Anda tidak berwenang untuk tindakan ini.' });
        }

        const now = new Date();
        const expiryDate = new Date();
        expiryDate.setMonth(now.getMonth() + order.invitation.package.active_period_months);

        // Gunakan transaction untuk memastikan kedua update berhasil
        await db.sequelize.transaction(async (t) => {
            // 1. Update status pesanan
            await order.update({
                payment_status: 'Dikonfirmasi',
                confirmed_at: now
            }, { transaction: t });

            // 2. Update status undangan, tanggal aktivasi, dan tanggal kedaluwarsa
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

