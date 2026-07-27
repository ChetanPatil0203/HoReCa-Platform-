const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const MarketingRequirement = sequelize.define('MarketingRequirement', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  ownerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'horeca_registrations',
      key: 'id',
    },
  },
  supplierId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'vendor_registrations',
      key: 'id',
    },
  },
  requestType: {
    type: DataTypes.ENUM('direct', 'public'),
    allowNull: false,
    defaultValue: 'public',
  },
  campaignType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  businessType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  objective: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  budget: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  duration: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  audience: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  targetArea: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  platforms: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  services: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending',
  },
}, {
  timestamps: true,
  tableName: 'marketing_requirements',
});

module.exports = MarketingRequirement;
