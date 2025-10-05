const db = require('../models');
const bcrypt = require('bcryptjs');

// Fungsi helper yang telah diperbaiki untuk mengambil data bersih
const getFullInvitationData = async (invitationId) => {
    const invitationInstance = await db.Invitation.findByPk(invitationId, {
        include: [
            { model: db.User, as: 'client', attributes: ['username'] },
            { model: db.Package, as: 'package' },
            { model: db.Theme, as: 'theme' },
            { model: db.Mempelai, as: 'mempelai' },
            { model: db.Event, as: 'events' },
            { model: db.GalleryPhoto, as: 'galleryPhotos' },
            { model: db.LoveStory, as: 'loveStories' },
        ]
    });

    // --- PERBAIKAN KRITIS DI SINI ---
    // Konversi instance Sequelize yang kompleks menjadi objek JavaScript biasa.
    // Ini akan membersihkan semua metadata dan fungsi internal.
    return invitationInstance ? invitationInstance.get({ plain: true }) : null;
    // ------------------------------------
};

exports.clientAuth = async (req, res) => {
    const { slug, pin } = req.body;
    if (!slug || !pin) {
        return res.status(400).json({ success: false, error: 'Slug dan PIN diperlukan.' });
    }

    try {
        const trimmedSlug = slug.trim();
        const invitation = await db.Invitation.findOne({ 
            where: { slug: trimmedSlug },
            include: { model: db.User, as: 'client' }
        });

        if (!invitation || !invitation.client) {
            return res.status(404).json({ success: false, error: 'Undangan tidak ditemukan.' });
        }

        const client = invitation.client;
        if (!client.password_pin) {
            return res.status(401).json({ success: false, error: 'PIN untuk klien ini belum diatur.' });
        }

        const isMatch = await bcrypt.compare(pin, client.password_pin);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'PIN salah.' });
        }

        // Sekarang kita memanggil fungsi helper yang sudah mengembalikan data bersih
        const fullInvitationData = await getFullInvitationData(invitation.id);
        res.status(200).json({ success: true, message: 'Otentikasi berhasil.', data: fullInvitationData });

    } catch (error) {
        console.error('Client auth error:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.updateInvitationDashboard = async (req, res) => {
    const { slug } = req.params;
    const { mempelaiData } = req.body; // Kita akan terima data per bagian

    try {
        const invitation = await db.Invitation.findOne({ where: { slug } });
        if (!invitation) {
            return res.status(404).json({ success: false, error: 'Undangan tidak ditemukan.' });
        }

        // --- Proses Data Mempelai ---
        if (mempelaiData && Array.isArray(mempelaiData)) {
            // Kita akan menggunakan bulkCreate dengan opsi updateOnDuplicate
            // Ini akan membuat data baru jika belum ada, atau mengupdate jika sudah ada.
            await db.Mempelai.bulkCreate(mempelaiData.map(m => ({
                ...m,
                invitationId: invitation.id // Pastikan setiap data mempelai terhubung ke undangan yang benar
            })), {
                updateOnDuplicate: ["full_name", "nickname", "initials", "child_order", "parents_name", "social_media_urls", "gift_info"]
            });
        }
        
        // (Di sini kita akan menambahkan logika untuk bagian lain seperti Event, Gallery, dll. di masa depan)

        // Ambil kembali data terbaru untuk dikirim ke frontend
        const updatedData = await getFullInvitationData(invitation.id);
        res.status(200).json({ success: true, message: 'Data berhasil diperbarui!', data: updatedData });

    } catch (error) {
        console.error('Error updating invitation dashboard:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

