const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const VendorService = sequelize.define('VendorService', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  vendorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'vendor_registrations',
      key: 'id',
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  pricingType: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Fixed Price',
  },
  price: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  duration: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  availability: {
    type: DataTypes.STRING,
    defaultValue: 'Available Today',
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Active',
  },
  included: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  excluded: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
  tableName: 'vendor_services',
});

module.exports = VendorService;
