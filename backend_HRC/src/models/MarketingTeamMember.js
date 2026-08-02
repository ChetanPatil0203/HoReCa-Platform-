const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const MarketingTeamMember = sequelize.define('MarketingTeamMember', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  supplierId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING, // e.g. "Campaign Manager", "Graphic Designer", "SEO Specialist"
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  avatar: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  activeCampaigns: {
    type: DataTypes.TEXT, // JSON stringified array of campaign names
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('Active', 'On Leave', 'Inactive'),
    defaultValue: 'Active',
  },
}, {
  timestamps: true,
  tableName: 'marketing_team_members',
});

module.exports = MarketingTeamMember;
