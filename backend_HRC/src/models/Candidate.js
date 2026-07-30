const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Candidate = sequelize.define('Candidate', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  supplierId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'vendor_registrations',
      key: 'id',
    },
    comment: 'Vendor/Supplier ID who owns this candidate',
  },
  candidateCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  experience: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Fresh / 1 Year',
  },
  salary: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Market Rate',
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Local',
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Available', // Available, Working, Submitted, Unavailable
  },
  verification: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Pending Verification', // Verified, Pending Verification, Pending
  },
  skills: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  documents: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'candidates',
  timestamps: true,
});

module.exports = Candidate;
