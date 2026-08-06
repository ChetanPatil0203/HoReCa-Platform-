const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ChatMessage = sequelize.define('ChatMessage', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  sessionId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  sender: {
    type: DataTypes.ENUM('user', 'bot'),
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    defaultValue: 'text', // 'text' or 'card'
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  cardType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cardData: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
}, {
  timestamps: true,
});

module.exports = ChatMessage;
