const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Document = sequelize.define('Document', {
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
  docKey: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  docName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  docNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fileUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  issueDate: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  expiryDate: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  verification: {
    type: DataTypes.STRING,
    defaultValue: 'Pending Verification',
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending',
  },
}, {
  timestamps: true,
  tableName: 'documents',
});

module.exports = Document;
