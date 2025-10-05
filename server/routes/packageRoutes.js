const express = require('express');
const router = express.Router();
const { getAllPackages, createPackage, updatePackage, deletePackage } = require('../controllers/packageController');
const authMiddleware = require('../middleware/authMiddleware');
const isSuperAdmin = require('../middleware/isSuperAdmin');
const isAdmin = require('../middleware/isAdmin');

router.get('/', authMiddleware, isAdmin, getAllPackages);
router.post('/', authMiddleware, isSuperAdmin, createPackage);
router.put('/:id', authMiddleware, isSuperAdmin, updatePackage);
router.delete('/:id', authMiddleware, isSuperAdmin, deletePackage);

module.exports = router;

