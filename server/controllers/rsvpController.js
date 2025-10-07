const db = require('../models');

/**
 * GET /api/rsvps/:slug
 * Mengambil semua RSVP untuk undangan tertentu.
 */
exports.getRsvpsBySlug = async (req, res) => {
    try {
        const invitation = await db.Invitation.findOne({ where: { slug: req.params.slug } });
        if (!invitation) {
            return res.status(404).json({ success: false, error: 'Undangan tidak ditemukan.' });
        }

        const rsvps = await db.RSVP.findAll({
            where: { invitationId: invitation.id },
            order: [['createdAt', 'DESC']] // Tampilkan dari yang terbaru
        });

        res.status(200).json({ success: true, data: rsvps });
    } catch (error) {
        console.error('Error saat mengambil data RSVP:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

/**
 * POST /api/rsvps/:slug
 * Menyimpan RSVP baru untuk undangan tertentu.
 */
exports.createRsvp = async (req, res) => {
    const { guest_name, attendance_status, message } = req.body;

    try {
        const invitation = await db.Invitation.findOne({ where: { slug: req.params.slug } });
        if (!invitation) {
            return res.status(404).json({ success: false, error: 'Undangan tidak ditemukan.' });
        }

        if (!guest_name || !attendance_status) {
            return res.status(400).json({ success: false, error: 'Nama dan status kehadiran wajib diisi.' });
        }

        const newRsvp = await db.RSVP.create({
            guest_name,
            attendance_status,
            message,
            invitationId: invitation.id
        });

        res.status(201).json({ success: true, message: 'Terima kasih atas konfirmasi Anda!', data: newRsvp });

    } catch (error) {
        console.error('Error saat menyimpan RSVP:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
