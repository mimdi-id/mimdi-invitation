const express = require('express');
const router = express.Router();
const { getRsvpsBySlug, createRsvp } = require('../controllers/rsvpController');

// Rute publik untuk mengambil semua RSVP (Buku Tamu)
router.get('/:slug', getRsvpsBySlug);

// Rute publik untuk mengirim RSVP baru
router.post('/:slug', createRsvp);

module.exports = router;
