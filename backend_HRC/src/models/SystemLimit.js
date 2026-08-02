const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const SystemLimit = sequelize.define('SystemLimit', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  key: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING, // 'HORECA', 'VENDOR', 'GENERAL', 'SECURITY'
    allowNull: false,
    defaultValue: 'GENERAL',
  },
  value: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  unit: {
    type: DataTypes.STRING, // 'posts/mo', 'products', 'MB', 'requests/min', etc.
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
  tableName: 'system_limits',
});

module.exports = SystemLimit;
