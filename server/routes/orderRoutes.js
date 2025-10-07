const express = require('express');
const router = express.Router();
const { createOrder, getAdminOrders, activateOrder } = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');

// Rute untuk membuat pesanan baru (tetap sama)
router.post('/', authMiddleware, isAdmin, createOrder);

// --- RUTE BARU ---
// Rute untuk mendapatkan daftar pesanan milik admin
router.get('/my-orders', authMiddleware, isAdmin, getAdminOrders);

// Rute untuk mengaktifkan pesanan dan undangan
router.put('/:id/activate', authMiddleware, isAdmin, activateOrder);
// -----------------

module.exports = router;

