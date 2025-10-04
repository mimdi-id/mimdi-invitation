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

// Semua rute di sini dilindungi dan hanya untuk Super Admin
router.use(authMiddleware, isSuperAdmin);

router.route('/')
    .get(getAllThemes)
    .post(createTheme);

router.route('/:id')
    .put(updateTheme)
    .delete(deleteTheme);

module.exports = router;
