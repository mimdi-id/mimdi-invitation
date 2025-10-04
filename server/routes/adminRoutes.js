const express = require('express');
const router = express.Router();
const { 
    createAdmin, 
    getAllAdmins, 
    updateAdminQuota, 
    deleteAdmin 
} = require('../controllers/adminController');

const authMiddleware = require('../middleware/authMiddleware');
const isSuperAdmin = require('../middleware/isSuperAdmin');

// Semua rute di file ini dilindungi dan hanya untuk Super Admin
// Rantai middleware: Cek Token -> Cek Role Super Admin -> Jalankan Controller
router.post('/', authMiddleware, isSuperAdmin, createAdmin);
router.get('/', authMiddleware, isSuperAdmin, getAllAdmins);
router.put('/:id/quota', authMiddleware, isSuperAdmin, updateAdminQuota);
router.delete('/:id', authMiddleware, isSuperAdmin, deleteAdmin);

module.exports = router;
