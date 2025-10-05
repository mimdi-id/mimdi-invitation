const express = require('express');
const router = express.Router();
const { getAdminInvitations, getAllInvitations } = require('../controllers/invitationController');
const authMiddleware = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');
const isSuperAdmin = require('../middleware/isSuperAdmin');

// Rute untuk Admin -> Melihat undangannya sendiri
router.get('/my-invitations', authMiddleware, isAdmin, getAdminInvitations);

// Rute BARU untuk Super Admin -> Melihat SEMUA undangan
router.get('/all', authMiddleware, isSuperAdmin, getAllInvitations);

module.exports = router;

