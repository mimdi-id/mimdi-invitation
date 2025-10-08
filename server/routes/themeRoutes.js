const express = require('express');
const router = express.Router();

const {
    getAllThemes,
    createTheme,
    updateTheme,
    deleteTheme
} = require('../controllers/themeController');

const authMiddleware = require('../middleware/authMiddleware');
const isSuperAdmin = require('../middleware/isSuperAdmin');
const upload = require('../middleware/upload');

// --- PERUBAHAN DI SINI (jika belum publik) ---
// Rute ini sekarang menjadi PUBLIK, tidak memerlukan login.
router.get('/', getAllThemes);
// ------------------------------------------

// Rute untuk membuat, mengupdate, dan menghapus tetap hanya untuk Super Admin
router.post('/', authMiddleware, isSuperAdmin, upload.single('preview_image'), createTheme);
router.put('/:id', authMiddleware, isSuperAdmin, upload.single('preview_image'), updateTheme);
router.delete('/:id', authMiddleware, isSuperAdmin, deleteTheme);

module.exports = router;

