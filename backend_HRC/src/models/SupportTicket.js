const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const SupportTicket = sequelize.define('SupportTicket', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  ticketId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userEmail: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  userMobile: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  userRole: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'owner',
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'General Query',
  },
  priority: {
    type: DataTypes.ENUM('Low', 'Medium', 'High', 'Urgent'),
    defaultValue: 'Medium',
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  relatedTo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('Open', 'In Progress', 'Awaiting Response', 'Resolved', 'Closed'),
    defaultValue: 'Open',
  },
  adminNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  messages: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  resolvedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  timestamps: true,
  tableName: 'SupportTickets',
});

module.exports = SupportTicket;
