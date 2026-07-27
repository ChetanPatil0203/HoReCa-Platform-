const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ServiceProviderRequirement = sequelize.define('ServiceProviderRequirement', {
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
  category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  serviceType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  time: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  urgency: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  budget: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending',
  },
}, {
  timestamps: true,
  tableName: 'service_provider_requirements',
});

module.exports = ServiceProviderRequirement;
