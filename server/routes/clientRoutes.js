const express = require('express');
const router = express.Router();

// --- PERBAIKAN DI SINI: Impor semua fungsi yang dibutuhkan ---
const { 
    clientAuth, 
    updateInvitationDashboard, 
    updateInvitationTheme 
} = require('../controllers/clientController');
// -----------------------------------------------------------

const upload = require('../middleware/upload');

// Rute untuk otentikasi klien
router.post('/auth', clientAuth);

// Rute untuk klien memperbarui data undangan mereka (termasuk file)
router.put(
    '/invitations/:slug/dashboard', 
    upload.fields([
        { name: 'cover_image', maxCount: 1 },
        { name: 'gallery_images', maxCount: 10 }
    ]),
    updateInvitationDashboard
);

// Rute baru untuk klien mengganti tema
router.put('/invitations/:slug/theme', updateInvitationTheme);

module.exports = router;

