const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ChatSession = sequelize.define('ChatSession', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    defaultValue: 'New Conversation',
  },
}, {
  timestamps: true,
});

module.exports = ChatSession;
