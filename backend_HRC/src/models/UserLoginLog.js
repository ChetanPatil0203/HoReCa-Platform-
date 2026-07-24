const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const UserLoginLog = sequelize.define('UserLoginLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userRole: {
    type: DataTypes.STRING, // 'owner', 'vendor', 'superadmin'
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING, // 'Hotel', 'Restaurant', 'Cafe', 'Raw Material', 'Manpower', 'Service Provider', 'Marketing Agency', etc.
    allowNull: true,
  },
  loginTime: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING, // 'success', 'failed'
    defaultValue: 'success',
  },
}, {
  timestamps: true,
  tableName: 'user_login_logs',
});

module.exports = UserLoginLog;
