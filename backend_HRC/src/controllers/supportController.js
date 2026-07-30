const supportService = require('../services/supportService');

// POST /api/support/tickets (Submit Ticket from Owner / Vendor)
exports.createSupportTicket = async (req, res) => {
  try {
    const data = req.body;
    const ticket = await supportService.createSupportTicketService(data);
    return res.status(201).json({
      success: true,
      message: 'Support ticket submitted successfully.',
      data: ticket,
    });
  } catch (error) {
    console.error('createSupportTicket Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit support ticket.',
    });
  }
};

// GET /api/support/owner-tickets (Fetch Owner Support Tickets)
exports.getUserSupportTickets = async (req, res) => {
  try {
    const { userId, role } = req.query;
    const tickets = await supportService.getUserSupportTicketsService(userId, role || 'owner');
    return res.status(200).json({
      success: true,
      data: tickets,
    });
  } catch (error) {
    console.error('getUserSupportTickets Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch support tickets.',
    });
  }
};

// GET /api/support/admin/tickets (Fetch All Tickets for Super Admin)
exports.getAllSupportTickets = async (req, res) => {
  try {
    const filters = req.query;
    const tickets = await supportService.getAllSupportTicketsService(filters);
    return res.status(200).json({
      success: true,
      data: tickets,
    });
  } catch (error) {
    console.error('getAllSupportTickets Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch admin support tickets.',
    });
  }
};

// PUT /api/support/admin/tickets/:id (Update Status/Notes by Super Admin)
exports.updateSupportTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const ticket = await supportService.updateSupportTicketStatusService(id, updateData);
    return res.status(200).json({
      success: true,
      message: 'Support ticket updated successfully.',
      data: ticket,
    });
  } catch (error) {
    console.error('updateSupportTicketStatus Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update support ticket.',
    });
  }
};

// POST /api/support/tickets/:id/messages (Send message in chat)
exports.addTicketMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { senderName, senderRole, message } = req.body;
    const result = await supportService.addTicketMessageService(id, { senderName, senderRole, message });
    return res.status(200).json({
      success: true,
      message: 'Message sent successfully.',
      data: result,
    });
  } catch (error) {
    console.error('addTicketMessage Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to send chat message.',
    });
  }
};
