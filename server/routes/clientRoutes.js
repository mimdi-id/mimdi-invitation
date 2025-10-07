const express = require('express');
const router = express.Router();
const { clientAuth, updateInvitationDashboard } = require('../controllers/clientController');
const multer = require('multer');
const path = require('path');

// Konfigurasi Multer (tetap sama)
const storage = multer.diskStorage({
    destination: function (req, file, cb) { cb(null, 'uploads/'); },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Rute otentikasi (tetap sama)
router.post('/auth', clientAuth);

// --- PERBAIKAN DI SINI ---
// Middleware 'upload.fields' sekarang juga akan menerima 'gallery_images'
router.put(
    '/invitations/:slug/dashboard', 
    upload.fields([
        { name: 'cover_image', maxCount: 1 },
        { name: 'gallery_images', maxCount: 10 } // Izinkan hingga 10 foto galeri
    ]),
    updateInvitationDashboard
);

module.exports = router;

