const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Requirement = sequelize.define('Requirement', {
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
    allowNull: true, // NULL for public posts on Feed Wall
    references: {
      model: 'vendor_registrations',
      key: 'id',
    },
  },
  type: {
    type: DataTypes.ENUM('manpower', 'marketing', 'serviceProvider'),
    allowNull: false,
  },
  requestType: {
    type: DataTypes.ENUM('direct', 'public'),
    allowNull: false,
    defaultValue: 'public',
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
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
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending', // pending, accepted, rejected, closed
  },
  extraData: {
    type: DataTypes.JSON,
    allowNull: true, // To store custom form values like staff count,shift,duration etc.
  },
}, {
  timestamps: true,
  tableName: 'requirements',
});

module.exports = Requirement;
