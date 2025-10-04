const jwt = require('jsonwebtoken');
const db = require('../models');

/**
 * Middleware untuk melindungi rute.
 * Memverifikasi token JWT dan melampirkan data pengguna (termasuk peran) ke objek request.
 */
const authMiddleware = async (req, res, next) => {
    let token;

    // Cek apakah header Authorization ada dan berformat 'Bearer <token>'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 1. Ambil token dari header
            token = req.headers.authorization.split(' ')[1];

            // 2. Verifikasi token menggunakan secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Ambil data pengguna dari database berdasarkan ID di token
            //    INI ADALAH BAGIAN YANG DIPERBAIKI:
            //    Kita menggunakan 'include' untuk mengambil data Role yang terhubung.
            req.user = await db.User.findByPk(decoded.id, {
                include: {
                    model: db.Role,
                    as: 'role' // Pastikan 'as' ini cocok dengan yang ada di model User
                }
            });

            // Jika pengguna tidak ditemukan (misalnya sudah dihapus)
            if (!req.user) {
                return res.status(401).json({ success: false, error: 'Token tidak valid, pengguna tidak ditemukan' });
            }

            // Lanjutkan ke middleware atau controller selanjutnya
            next();

        } catch (error) {
            console.error('Error otentikasi token:', error.message);
            res.status(401).json({ success: false, error: 'Token tidak valid atau kedaluwarsa' });
        }
    }

    // Jika tidak ada token sama sekali
    if (!token) {
        res.status(401).json({ success: false, error: 'Tidak ada token, otorisasi ditolak' });
    }
};

module.exports = authMiddleware;

