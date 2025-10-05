const express = require('express');
const router = express.Router();
const { clientAuth, updateInvitationDashboard } = require('../controllers/clientController');

router.post('/auth', clientAuth);
router.put('/invitations/:id', updateInvitationDashboard);

module.exports = router;

