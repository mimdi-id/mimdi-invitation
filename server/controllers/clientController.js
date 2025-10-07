const db = require('../models');
const bcrypt = require('bcryptjs');

// Fungsi helper untuk mengambil data undangan lengkap (tetap sama)
const getFullInvitationData = async (invitationId) => {
    const invitationInstance = await db.Invitation.findByPk(invitationId, {
        include: [
            { model: db.User, as: 'client', attributes: ['username'] },
            { model: db.Package, as: 'package' }, { model: db.Theme, as: 'theme' },
            { model: db.Mempelai, as: 'mempelai' }, { model: db.Event, as: 'events' },
            { model: db.GalleryPhoto, as: 'galleryPhotos' }, { model: db.LoveStory, as: 'loveStories' },
        ]
    });
    return invitationInstance ? invitationInstance.get({ plain: true }) : null;
};

exports.updateInvitationTheme = async (req, res) => {
    const { slug } = req.params;
    const { themeId } = req.body;

    try {
        const invitation = await db.Invitation.findOne({ where: { slug } });
        if (!invitation) {
            return res.status(404).json({ success: false, error: 'Undangan tidak ditemukan.' });
        }

        invitation.themeId = themeId;
        await invitation.save();

        // Ambil kembali data terbaru untuk dikirim ke frontend
        const updatedData = await getFullInvitationData(invitation.id);
        res.status(200).json({ success: true, message: 'Tema berhasil diperbarui!', data: updatedData });

    } catch (error) {
        console.error('Error saat memperbarui tema:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};


// Fungsi otentikasi klien
exports.clientAuth = async (req, res) => {
    const { slug, pin } = req.body;
    if (!slug || !pin) {
        return res.status(400).json({ success: false, error: 'Slug dan PIN diperlukan.' });
    }
    try {
        const invitation = await db.Invitation.findOne({ 
            where: { slug: slug.trim() },
            include: { model: db.User, as: 'client' }
        });

        if (!invitation || !invitation.client || !invitation.client.password_pin) {
            return res.status(401).json({ success: false, error: 'Undangan tidak ditemukan atau PIN belum diatur.' });
        }

        const isMatch = await bcrypt.compare(pin, invitation.client.password_pin);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'PIN salah.' });
        }

        const fullInvitationData = await getFullInvitationData(invitation.id);
        res.status(200).json({ success: true, message: 'Otentikasi berhasil.', data: fullInvitationData });
    } catch (error) {
        console.error('Client auth error:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

/**
 * PUT /api/client/invitations/:slug/dashboard
 * (VERSI FINAL & PALING LENGKAP) Klien memperbarui semua data undangan.
 */
exports.updateInvitationDashboard = async (req, res) => {
    const { slug } = req.params;
    const files = req.files;

    try {
        const mempelaiData = req.body.mempelaiData ? JSON.parse(req.body.mempelaiData) : null;
        const eventData = req.body.eventData ? JSON.parse(req.body.eventData) : null;
        const mediaData = req.body.mediaData ? JSON.parse(req.body.mediaData) : null;
        const loveStoryData = req.body.loveStoryData ? JSON.parse(req.body.loveStoryData) : null;
        const otherData = req.body.otherData ? JSON.parse(req.body.otherData) : null; // Data baru

        const invitation = await db.Invitation.findOne({ where: { slug } });
        if (!invitation) {
            return res.status(404).json({ success: false, error: 'Undangan tidak ditemukan.' });
        }

        // --- Proses Data Media & File ---
        if (files && files.cover_image) {
            invitation.cover_image_url = `/uploads/${files.cover_image[0].filename}`;
        }
        if (mediaData) {
            invitation.music_url = mediaData.music_url;
            invitation.video_url = mediaData.video_url;
        }

        
            // ... (logika file dan media tetap sama)
            if (otherData) {
            invitation.doa_quotes = otherData.doa_quotes;
            invitation.turut_mengundang_text = otherData.turut_mengundang_text; // Simpan teks
        }
        await invitation.save();
        
        // Gunakan transaction untuk memastikan semua operasi data relasional berhasil
        await db.sequelize.transaction(async (t) => {
            // --- Proses Data Mempelai ---
            if (mempelaiData && Array.isArray(mempelaiData)) {
                for (const mempelai of mempelaiData) {
                    const payload = {
                        full_name: mempelai.full_name || null,
                        nickname: mempelai.nickname || null,
                        initials: mempelai.initials || null, // Ditambahkan
                        child_order: mempelai.child_order || null,
                        parents_name: mempelai.parents_name || null,
                        social_media_urls: mempelai.social_media_urls || {}, // Ditambahkan
                        gift_info: mempelai.gift_info || {} // Ditambahkan
                    };
                    const [instance, created] = await db.Mempelai.findOrCreate({
                        where: { invitationId: invitation.id, type: mempelai.type },
                        defaults: payload, transaction: t
                    });
                    if (!created) { await instance.update(payload, { transaction: t }); }
                }
            }

            // --- Proses Data Acara ---
            if (eventData && Array.isArray(eventData)) {
                await db.Event.destroy({ where: { invitationId: invitation.id }, transaction: t });
                const cleanEventData = eventData
                    .filter(event => event.title && event.title.trim() !== '')
                    .map(event => ({ ...event, id: undefined, invitationId: invitation.id }));
                if (cleanEventData.length > 0) {
                    await db.Event.bulkCreate(cleanEventData, { transaction: t });
                }
            }
            
            // --- Proses Data Cerita Cinta ---
            if (loveStoryData && Array.isArray(loveStoryData)) {
                await db.LoveStory.destroy({ where: { invitationId: invitation.id }, transaction: t });
                const cleanLoveStoryData = loveStoryData
                    .filter(story => story.title && story.story)
                    .map((story, index) => ({...story, id: undefined, story_order: index + 1, invitationId: invitation.id}));
                if (cleanLoveStoryData.length > 0) {
                    await db.LoveStory.bulkCreate(cleanLoveStoryData, { transaction: t });
                }
            }

            // --- Proses Data Galeri Foto ---
            if (files && files.gallery_images) {
                const galleryPhotoData = files.gallery_images.map((file, index) => ({
                    image_url: `/uploads/${file.filename}`,
                    upload_order: index + 1,
                    invitationId: invitation.id
                }));
                await db.GalleryPhoto.destroy({ where: { invitationId: invitation.id }, transaction: t });
                await db.GalleryPhoto.bulkCreate(galleryPhotoData, { transaction: t });
            }

            await invitation.save();
        });
        
        const updatedData = await getFullInvitationData(invitation.id);
        res.status(200).json({ success: true, message: 'Data undangan berhasil diperbarui!', data: updatedData });

    } catch (error) {
        console.error('Error saat memperbarui dasbor undangan:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};