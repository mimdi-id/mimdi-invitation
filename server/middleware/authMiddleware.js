const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authMiddleware = async (req, res, next) => {
    let token;

    // Cek header untuk 'Bearer token'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
    }

    try {
        // Verifikasi token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Cari user di DB dan lampirkan ke request object
        req.user = await User.findByPk(decoded.id, {
            attributes: { exclude: ['password'] } // Jangan sertakan password
        });

        if (!req.user) {
             return res.status(401).json({ success: false, error: 'User not found' });
        }

        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
    }
};

module.exports = authMiddleware;

