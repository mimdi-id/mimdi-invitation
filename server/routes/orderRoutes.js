const express = require('express');
const router = express.Router();
const { createOrder } = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');

router.post('/', authMiddleware, isAdmin, createOrder);

module.exports = router;

