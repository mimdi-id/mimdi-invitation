const express = require('express');
const router = express.Router();

// Impor semua fungsi controller, termasuk yang baru
const { 
    getAllAdmins, 
    createAdmin,
    deleteAdmin,
    updateAdminQuota // Impor fungsi baru
} = require('../controllers/adminController');

const authMiddleware = require('../middleware/authMiddleware');
const isSuperAdmin = require('../middleware/isSuperAdmin');

// Rute yang sudah ada
router.get('/', authMiddleware, isSuperAdmin, getAllAdmins);
router.post('/', authMiddleware, isSuperAdmin, createAdmin);
router.delete('/:id', authMiddleware, isSuperAdmin, deleteAdmin);

// --- RUTE BARU UNTUK MENGUBAH KUOTA ---
router.put('/:id/quota', authMiddleware, isSuperAdmin, updateAdminQuota);
// ------------------------------------

module.exports = router;

