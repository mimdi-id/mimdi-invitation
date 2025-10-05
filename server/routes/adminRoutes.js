const express = require('express');
const router = express.Router();
const { getAllAdmins, createAdmin, updateAdmin, deleteAdmin } = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const isSuperAdmin = require('../middleware/isSuperAdmin');

router.get('/', authMiddleware, isSuperAdmin, getAllAdmins);
router.post('/', authMiddleware, isSuperAdmin, createAdmin);
router.put('/:id', authMiddleware, isSuperAdmin, updateAdmin);
router.delete('/:id', authMiddleware, isSuperAdmin, deleteAdmin);

module.exports = router;

