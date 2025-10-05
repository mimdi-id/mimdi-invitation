const express = require('express');
const router = express.Router();
const { getAllThemes, createTheme, updateTheme, deleteTheme } = require('../controllers/themeController');
const authMiddleware = require('../middleware/authMiddleware');
const isSuperAdmin = require('../middleware/isSuperAdmin');
const isAdmin = require('../middleware/isAdmin');

router.get('/', authMiddleware, isAdmin, getAllThemes);
router.post('/', authMiddleware, isSuperAdmin, createTheme);
router.put('/:id', authMiddleware, isSuperAdmin, updateTheme);
router.delete('/:id', authMiddleware, isSuperAdmin, deleteTheme);

module.exports = router;

