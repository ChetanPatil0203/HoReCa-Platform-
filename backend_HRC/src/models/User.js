const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pincode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  role: {
    type: DataTypes.ENUM('owner', 'vendor', 'superadmin'),
    allowNull: false,
    defaultValue: 'owner',
  },
  vendorType: {
    type: DataTypes.STRING, // 'Raw Material', 'Manpower', 'Service Provider', 'Marketing Agency'
    allowNull: true,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  otpCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  profilePhoto: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
  },
  bankName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  accountNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ifscCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  accountHolderName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  deliveryRadius: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  minOrderValue: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  paymentTerms: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  notificationSettings: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  token: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
  tableName: 'users',
});

module.exports = User;
