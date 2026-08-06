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
  panNo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  gstin: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  brn: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fssaiNo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  profilePhoto: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
  },
  profilePhotoPublicId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  profilePhotoAssetId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  profilePhotoResourceType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  profilePhotoDeliveryType: {
    type: DataTypes.STRING,
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
  status: {
    type: DataTypes.STRING,
    defaultValue: 'registered',
  },
}, {
  timestamps: true,
  tableName: 'vendor_registrations',
});

module.exports = VendorRegistration;
