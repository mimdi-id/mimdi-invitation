const express = require('express');
const router = express.Router();
const { getAdminInvitations, getAllInvitations, getPublicInvitationBySlug } = require('../controllers/invitationController');
const authMiddleware = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');
const isSuperAdmin = require('../middleware/isSuperAdmin');

// --- RUTE BARU UNTUK PUBLIK ---
// Tidak memerlukan middleware otentikasi
router.get('/public/:slug', getPublicInvitationBySlug);
// -----------------------------

// Rute untuk dasbor Admin
router.get('/my-invitations', authMiddleware, isAdmin, getAdminInvitations);

// Rute untuk dasbor Super Admin
router.get('/all', authMiddleware, isSuperAdmin, getAllInvitations);

module.exports = router;

