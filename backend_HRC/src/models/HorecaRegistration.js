const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const HorecaRegistration = sequelize.define('HorecaRegistration', {
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
  bizCategory: {
    type: DataTypes.STRING, // 'Hotel', 'Restaurant', 'Cafe'
    allowNull: false,
  },
  ownerName: {
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
  fssaiNo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'registered',
  },
}, {
  timestamps: true,
  tableName: 'horeca_registrations',
});

module.exports = HorecaRegistration;
