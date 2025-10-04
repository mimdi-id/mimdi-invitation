const db = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Fungsi untuk menghasilkan token JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '30d',
    });
};

// @desc    Register a new user (jika diperlukan di masa depan)
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
    // Implementasi register bisa ditambahkan di sini jika perlu
    res.status(501).json({ success: false, error: 'Fungsi register belum diimplementasikan.' });
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    // --- PERBAIKAN DI SINI ---
    // Menggunakan 'username' bukan 'email'
    const { username, password } = req.body;

    // Validasi input
    if (!username || !password) {
        return res.status(400).json({ success: false, error: 'Tolong berikan username dan password' });
    }

    try {
        // Cari user berdasarkan username
        const user = await db.User.findOne({ 
            where: { username },
            include: { model: db.Role, as: 'role' } // Sertakan role untuk info di frontend
        });

        // Jika user tidak ditemukan atau password tidak cocok
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, error: 'Username atau password salah' });
        }

        // Jika berhasil, kirim token
        res.status(200).json({
            success: true,
            token: generateToken(user.id),
            user: {
                id: user.id,
                username: user.username,
                role: user.role.name
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    // req.user sudah diisi oleh authMiddleware
    if (!req.user) {
         return res.status(404).json({ success: false, error: 'User tidak ditemukan' });
    }
    res.status(200).json({ success: true, data: req.user });
};

module.exports = {
    register,
    login,
    getMe,
};

