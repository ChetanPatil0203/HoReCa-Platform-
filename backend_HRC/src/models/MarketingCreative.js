const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const MarketingCreative = sequelize.define('MarketingCreative', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  requirementId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  supplierId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING, // e.g. "Social Post", "Reel", "Poster", "Banner"
    allowNull: false,
  },
  version: {
    type: DataTypes.STRING,
    defaultValue: 'v1.0',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  fileUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  clientFeedback: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'revision_requested'),
    defaultValue: 'pending',
  },
}, {
  timestamps: true,
  tableName: 'marketing_creatives',
});

module.exports = MarketingCreative;
