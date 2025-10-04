const express = require('express');
const router = express.Router();

// Impor semua fungsi controller yang dibutuhkan
const { 
    getAllAdmins, 
    createAdmin,
    updateAdmin,
    deleteAdmin
} = require('../controllers/adminController');

// Impor middleware keamanan
const authMiddleware = require('../middleware/authMiddleware');
const isSuperAdmin = require('../middleware/isSuperAdmin');

// Definisikan rute dan pasang middleware + controller
// GET /api/admins -> Mengambil semua admin
router.get('/', authMiddleware, isSuperAdmin, getAllAdmins);

// POST /api/admins -> Membuat admin baru
router.post('/', authMiddleware, isSuperAdmin, createAdmin);

// PUT /api/admins/:id -> Memperbarui admin berdasarkan ID
router.put('/:id', authMiddleware, isSuperAdmin, updateAdmin);

// DELETE /api/admins/:id -> Menghapus admin berdasarkan ID
router.delete('/:id', authMiddleware, isSuperAdmin, deleteAdmin);

module.exports = router;

