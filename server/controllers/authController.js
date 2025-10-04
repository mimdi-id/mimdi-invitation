const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');

// @desc    Register a new user (admin/superadmin)
// @route   POST /api/auth/register
// @access  Public (for initial setup) or Private (SuperAdmin only)
exports.register = async (req, res) => {
    const { name, email, password, roleName } = req.body;

    try {
        // Cek apakah user sudah ada
        let user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ success: false, error: 'User already exists' });
        }

        // Cari Role berdasarkan nama
        const role = await Role.findOne({ where: { name: roleName || 'Admin' } });
        if (!role) {
            return res.status(400).json({ success: false, error: 'Invalid role specified' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Buat user baru
        user = await User.create({
            name,
            email,
            password: hashedPassword,
            roleId: role.id
        });

        sendTokenResponse(user, 201, res);

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Please provide email and password' });
    }

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        sendTokenResponse(user, 200, res);

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    // req.user di-set dari authMiddleware
    res.status(200).json({ success: true, data: req.user });
};


// Helper untuk membuat dan mengirim token
const sendTokenResponse = (user, statusCode, res) => {
    const payload = { id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '30d'
    });

    res.status(statusCode).json({
        success: true,
        token
    });
};

