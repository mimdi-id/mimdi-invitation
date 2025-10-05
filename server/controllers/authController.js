const db = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Fungsi utilitas untuk membuat token JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '30d',
    });
};

/**
 * POST /api/auth/login
 * Mengotentikasi pengguna dan mengembalikan token beserta data pengguna.
 */
const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, error: 'Tolong berikan username dan password' });
    }

    try {
        const user = await db.User.findOne({
            where: { username },
            include: { 
                model: db.Role, 
                as: 'role', 
                attributes: ['name']
            }
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, error: 'Username atau password salah' });
        }

        const token = generateToken(user.id);

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Pastikan HANYA mengekspor objek yang berisi fungsi 'login'
module.exports = {
    login,
};

