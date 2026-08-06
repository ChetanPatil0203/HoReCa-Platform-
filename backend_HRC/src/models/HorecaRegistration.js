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
  status: {
    type: DataTypes.STRING,
    defaultValue: 'registered',
  },
}, {
  timestamps: true,
  tableName: 'horeca_registrations',
});

module.exports = HorecaRegistration;
