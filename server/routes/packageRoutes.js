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

// Semua rute di sini dilindungi dan hanya untuk Super Admin
router.use(authMiddleware, isSuperAdmin);

router.route('/')
    .get(getAllPackages)
    .post(createPackage);

router.route('/:id')
    .put(updatePackage)
    .delete(deletePackage);

module.exports = router;
