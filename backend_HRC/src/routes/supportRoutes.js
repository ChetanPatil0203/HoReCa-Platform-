const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');

router.post('/tickets', supportController.createSupportTicket);
router.get('/owner-tickets', supportController.getUserSupportTickets);
router.get('/admin/tickets', supportController.getAllSupportTickets);
router.put('/admin/tickets/:id', supportController.updateSupportTicketStatus);
router.post('/tickets/:id/messages', supportController.addTicketMessage);

module.exports = router;
