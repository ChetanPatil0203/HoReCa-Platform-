const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const MarketingProposal = sequelize.define('MarketingProposal', {
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
  amount: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  strategy: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  services: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  deliverables: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  duration: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  startDate: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  completionDate: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  teamSize: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  paymentTerms: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  revisionLimit: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  onlineFields: {
    type: DataTypes.TEXT, // JSON stringified online campaign parameters
    allowNull: true,
  },
  offlineFields: {
    type: DataTypes.TEXT, // JSON stringified offline campaign parameters
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('draft', 'submitted', 'accepted', 'rejected'),
    defaultValue: 'submitted',
  },
}, {
  timestamps: true,
  tableName: 'marketing_proposals',
});

module.exports = MarketingProposal;
