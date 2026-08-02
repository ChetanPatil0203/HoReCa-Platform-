const { SupportTicket, User, HorecaRegistration, VendorRegistration } = require('../models');
const { Op } = require('sequelize');
const socketService = require('./socketService');
const { sendNotificationToUser } = require('./notificationService');

// Create Support Ticket
exports.createSupportTicketService = async (data) => {
  const latestTicket = await SupportTicket.findOne({
    order: [['createdAt', 'DESC']],
    attributes: ['ticketId'],
  });

  let nextNum = 1001;
  if (latestTicket && latestTicket.ticketId) {
    const match = latestTicket.ticketId.match(/TKT-(\d+)/i);
    if (match && match[1]) {
      nextNum = parseInt(match[1], 10) + 1;
    }
  }

  let ticketId = `TKT-${nextNum}`;
  let exists = await SupportTicket.findOne({ where: { ticketId } });
  while (exists) {
    nextNum += 1;
    ticketId = `TKT-${nextNum}`;
    exists = await SupportTicket.findOne({ where: { ticketId } });
  }

  const isUuid = data.userId && typeof data.userId === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(data.userId);
  const validUserId = isUuid ? data.userId : null;
  const initialMsg = data.message || data.description || data.subject || 'Ticket created.';

  const ticket = await SupportTicket.create({
    ticketId,
    userId: validUserId,
    userName: data.userName || data.name || 'HRC Owner',
    userEmail: data.userEmail || data.email || null,
    userMobile: data.userMobile || data.mobile || null,
    userRole: data.userRole || 'owner',
    subject: data.subject || data.description || 'Support Request',
    category: data.category || 'General Query',
    priority: data.priority || 'Medium',
    message: initialMsg,
    relatedTo: data.relatedTo || null,
    status: 'Open',
    messages: [
      {
        id: `msg-${Date.now()}`,
        senderName: data.userName || 'Owner',
        senderRole: data.userRole || 'owner',
        message: initialMsg,
        createdAt: new Date().toISOString(),
      }
    ],
  });

  return ticket;
};

// Fetch User's Support Tickets (Owner / Vendor)
exports.getUserSupportTicketsService = async (userId, userRole = 'owner') => {
  const where = {};
  if (userId) {
    where.userId = userId;
  } else if (userRole) {
    where.userRole = userRole;
  }

  return await SupportTicket.findAll({
    where,
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'email', 'mobile'],
        include: [
          { model: HorecaRegistration, as: 'horecaRegistration' },
          { model: VendorRegistration, as: 'vendorRegistration' }
        ]
      }
    ]
  });
};

// Fetch All Support Tickets (For Super Admin)
exports.getAllSupportTicketsService = async (filters = {}) => {
  const where = {};
  if (filters.status && filters.status !== 'All') {
    where.status = filters.status;
  }
  if (filters.category && filters.category !== 'All') {
    where.category = filters.category;
  }
  if (filters.priority && filters.priority !== 'All') {
    where.priority = filters.priority;
  }

  return await SupportTicket.findAll({
    where,
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'email', 'mobile'],
        include: [
          { model: HorecaRegistration, as: 'horecaRegistration' },
          { model: VendorRegistration, as: 'vendorRegistration' }
        ]
      }
    ]
  });
};

// Update Support Ticket Status & Admin Notes (Super Admin)
exports.updateSupportTicketStatusService = async (id, updateData) => {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  const where = isUuid ? { id } : { ticketId: id };

  const ticket = await SupportTicket.findOne({ where });
  if (!ticket) {
    throw new Error('Support Ticket not found.');
  }

  if (updateData.status) ticket.status = updateData.status;
  if (updateData.adminNotes !== undefined) {
    ticket.adminNotes = updateData.adminNotes;
    
    // Add admin message to messages list if provided
    if (updateData.adminNotes && updateData.adminNotes.trim()) {
      const currentMessages = Array.isArray(ticket.messages) ? [...ticket.messages] : [];
      currentMessages.push({
        id: `msg-${Date.now()}`,
        senderName: 'Super Admin',
        senderRole: 'admin',
        message: updateData.adminNotes,
        createdAt: new Date().toISOString(),
      });
      ticket.messages = currentMessages;
      ticket.changed('messages', true);
    }
  }

  if (updateData.status === 'Resolved' || updateData.status === 'Closed') {
    ticket.resolvedAt = new Date();
  }

  await ticket.save();

  // Socket.io & Notification Emits
  socketService.emitToRoom(ticket.ticketId, 'ticket_updated', ticket);
  socketService.emitToRoom(ticket.id, 'ticket_updated', ticket);
  socketService.broadcastEvent('ticket_updated', ticket);

  if (ticket.userId) {
    sendNotificationToUser(ticket.userId, `Ticket ${ticket.ticketId} Updated`, `Status: ${ticket.status}`);
  }

  return ticket;
};

// Add Chat Message to Ticket
exports.addTicketMessageService = async (id, { senderName, senderRole, message }) => {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  const where = isUuid ? { id } : { ticketId: id };

  const ticket = await SupportTicket.findOne({ where });
  if (!ticket) {
    throw new Error('Support Ticket not found.');
  }

  const currentMessages = Array.isArray(ticket.messages) ? [...ticket.messages] : [];
  const newMsg = {
    id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    senderName: senderName || (senderRole === 'admin' ? 'Super Admin' : ticket.userName),
    senderRole: senderRole || 'owner',
    message: message || '',
    createdAt: new Date().toISOString(),
  };

  currentMessages.push(newMsg);
  ticket.messages = currentMessages;
  ticket.changed('messages', true);

  await ticket.save();

  // Socket.io & Notification Emits
  socketService.emitToRoom(ticket.ticketId, 'receive_message', newMsg);
  socketService.emitToRoom(ticket.id, 'receive_message', newMsg);
  socketService.broadcastEvent('receive_message', { ticketId: ticket.ticketId, newMsg });

  if (senderRole === 'admin' && ticket.userId) {
    sendNotificationToUser(ticket.userId, `New Reply on ${ticket.ticketId}`, message);
  }

  return { ticket, newMsg, messages: currentMessages };
};
