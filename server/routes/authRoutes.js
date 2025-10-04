const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @desc    Mendaftarkan Super Admin/Admin (sesuai logika di controller)
 * @route   POST /api/auth/register
 * @access  Public (atau dilindungi sesuai kebutuhan)
 */
router.post('/register', register);

/**
 * @desc    Login Super Admin/Admin
 * @route   POST /api/auth/login
 * @access  Public
 */
router.post('/login', login);

/**
 * @desc    Mendapatkan data user yang sedang login
 * @route   GET /api/auth/me
 * @access  Private
 */
router.get('/me', authMiddleware, getMe);


module.exports = router;

