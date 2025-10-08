const express = require('express');
const router = express.Router();

const {
    getAllPackages,
    createPackage,
    updatePackage,
    deletePackage
} = require('../controllers/packageController');

const authMiddleware = require('../middleware/authMiddleware');
const isSuperAdmin = require('../middleware/isSuperAdmin');

// --- PERUBAHAN DI SINI ---
// Rute ini sekarang menjadi PUBLIK, tidak memerlukan login.
router.get('/', getAllPackages);
// -------------------------

// Rute untuk membuat, mengupdate, dan menghapus tetap hanya untuk Super Admin
router.post('/', authMiddleware, isSuperAdmin, createPackage);
router.put('/:id', authMiddleware, isSuperAdmin, updatePackage);
router.delete('/:id', authMiddleware, isSuperAdmin, deletePackage);

module.exports = router;

