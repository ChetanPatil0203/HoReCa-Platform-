const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const VendorRegistration = sequelize.define('VendorRegistration', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  bizName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  vendorType: {
    type: DataTypes.STRING, // 'Raw Material', 'Manpower', 'Service Provider', 'Marketing Agency'
    allowNull: false,
  },
  subCategory: {
    type: DataTypes.STRING, // e.g. 'Dairy', 'Chef', 'Plumbing', etc.
    allowNull: true,
  },
  contactPerson: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  gstin: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'registered',
  },
}, {
  timestamps: true,
  tableName: 'vendor_registrations',
});

module.exports = VendorRegistration;
